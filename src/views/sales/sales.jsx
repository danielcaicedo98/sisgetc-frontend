import { fetchWithToken } from 'api/fetchHelpers';
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Container, Row, Col, ListGroup, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import ProductCrud from 'views/products/ProductCrud';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useNavigate } from 'react-router-dom';

const Sales = () => {
  const [product, setProduct] = useState([]);
  const [article, setArticle] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState('');
  const [totalSale, setTotalSale] = useState(0);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [client, setClient] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [description, setDescription] = useState('');
  const [saleStatus, setSaleStatus] = useState('');
  const [select_payment_method, setSelectPaymentMethod] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productDebounceTimer, setProductDebounceTimer] = useState(null);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [providerOptions, setProviderOptions] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [providerDebounceTimer, setProviderDebounceTimer] = useState(null);


  const navigate = useNavigate();
  useEffect(() => {
    const price = parseFloat(unitPrice) || 0;
    const total = quantity * price;
    setTotalSale(total);
  }, [quantity, unitPrice]);

  useEffect(() => {
    fillPaymentMethod()
  }, []);

  const fillPaymentMethod = async () => {

    try {
      const res = await fetchWithToken('basics/payment_methods/', null, 'GET');

      // Aquí suponemos que la respuesta es un array directo. Si es un objeto con una propiedad que contiene el array, ajusta esto.
      if (Array.isArray(res)) {
        setSelectPaymentMethod(res); // Guardamos el array de unidades en el estado
      } else {
        // Si la respuesta es un objeto con una clave (ejemplo: { data: [...] })
        setSelectPaymentMethod(res.data || []); // Ajusta según la estructura de la respuesta
      }

    } catch (error) {
      setError('Error fetching cities');

      console.error('Error fetching cities:', error);
    }
  };

  const searchProducts = async (query) => {
    if (!query) {
      setProductOptions([]);
      console.log("no encontrado")
      return;
    }

    setIsLoadingProducts(true);

    try {
      // Llamar a fetchWithToken para obtener los productos filtrados por el nombre
      const res = await fetchWithToken(`basics/products/?name_like=${encodeURIComponent(query)}`, null, 'GET');
      const data = res.map(item => ({
        id: item.value,   // Cambiar "value" por "id"
        name: item.label  // Cambiar "label" por "name"
      }));

      setProductOptions(data);
    } catch (error) {
      setIsLoadingProducts(false);
      console.error('Error fetching products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const searchProviders = async (query) => {
    if (!query) {
      setProviderOptions([]);
      console.log("no encontrado")
      return;
    }

    setIsLoadingProviders(true);

    try {
      // Llamar a fetchWithToken para obtener los proveedores filtrados por el nombre
      const res = await fetchWithToken(`/basics/customers/?name_like=${encodeURIComponent(query)}`, null, 'GET');
      const data = res.map(item => ({
        id: item.value,   // Cambiar "value" por "id"
        name: item.label  // Cambiar "label" por "name"
      }));

      setProviderOptions(data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching providers:', error);
      setIsLoadingProviders(false);


    } finally {
      setIsLoadingProviders(false);
    }
  };

  const handleProductInputChange = (query, productId) => {
    if (productDebounceTimer) {
      clearTimeout(productDebounceTimer);
    }

    const timer = setTimeout(() => {
      searchProducts(query);
    }, 300);
    setProductDebounceTimer(timer);
  };

  const handleProductChange = (selected) => {
    setProduct(selected); // `selected` será un array de objetos seleccionados.
    if (selected.length > 0) {
      const selectedProduct = selected[0]; // Toma el primer elemento si hay selección.
      setUnitPrice(selectedProduct.price?.toString() || ''); // Ajusta según la estructura de tu objeto.
    }
  };

  const handleProviderInputChange = (query) => {
    if (providerDebounceTimer) {
      clearTimeout(providerDebounceTimer);
    }

    const timer = setTimeout(() => {
      searchProviders(query);
    }, 300); // Espera 300ms después del último cambio
    setProviderDebounceTimer(timer);
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(0, quantity + amount);
    setQuantity(newQuantity);
  };

  const handleUnitPriceChange = (e) => {
    const inputValue = e.target.value;
    setUnitPrice(inputValue);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const addToCart = () => {
    console.log(product)
    // try {
      if (!product) {
        setError('Por favor, ingrese un producto.');
        return;
      }

      const price = parseFloat(unitPrice) || 0;
      const newProduct = {
        product: product,
        quantity,
        unitPrice: price,
        total: quantity * price,
      };

      setCart([...cart, newProduct]);
      setProduct([{
        name: "",
        id: ""
      }]);
      setQuantity(0);
      setUnitPrice('');
      setTotalSale(0);
      setError('');
    // }catch (error) {
    //   alert("Por favor diligencia todos los datos")
    // }
    
  };

  const handleEditProduct = (index) => {
    const item = cart[index];
    setProduct(item.product);
    setQuantity(item.quantity);
    setUnitPrice(item.unitPrice.toString());

    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const handleDeleteProduct = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const handleCheckout = async () => {

    if (!paymentMethod) {
      setError('Por favor, seleccione un método de pago.');
      return;
    }

    const addVenta = {
      sale_details: cart.map(p => ({
        quantity: p.quantity,
        unit_value: p.unitPrice,
        subtotal: p.total,
        product: p.product[0].id
      })),
      payment_method: paymentMethod,
      total: totalCartAmount,
      is_active: true,
      customer: proveedor[0].id,
      sale_status: 1
    }

    try {
      const response = await fetchWithToken('sales/', addVenta, 'POST'); // Llamar a fetchWithToken
      console.log(response.created)
      if (response.created) {
        alert('Compra guardada exitosamente.');
        navigate('/saleslist');
      }
      else {
        alert(`Error en campos: ${Object.keys(response)}\nDescripción: ${Object.values(response).flat()[0]}`);
      }
    } catch (error) {
      console.error('Error al guardar la compra:', error);
      alert('Hubo un problema al guardar la compra. Por favor, inténtalo nuevamente.');
    }

  };

  const totalCartAmount = cart.reduce((acc, item) => acc + item.total, 0);

  return (
    <Container fluid>
      <h1 className="text-center mb-4">Gestión de Ventas</h1>
      <Row>
        {/* Panel Izquierdo */}
        <Col md={6}>
          <Card>
            <Card.Header className="text-center" style={{ backgroundImage: 'linear-gradient(to right, #D98E32, #fe713b)' }}>
              <h4 className="text-white">Registrar Venta</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3" controlId="client">
                  <Form.Label className="mt-2 fw-bold">Cliente</Form.Label>
                  <Typeahead
                    id="proveedor-typeahead"
                    labelKey="name"
                    onChange={(selected) => setProveedor(selected)}
                    onInputChange={handleProviderInputChange}
                    options={providerOptions}
                    placeholder="Escribe el cliente"
                    selected={proveedor}
                    isLoading={isLoadingProviders}
                    minLength={1}
                    clearButton
                  />
                </Form.Group>
                <Form.Group controlId="saleDate">
                  <Form.Label className="fw-bold">Fecha de Venta</Form.Label>
                  <Form.Control
                    type="date"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="product">
                  <Form.Label className="mt-3 fw-bold">Producto</Form.Label>
                  <Typeahead
                    id="proveedor-typeahead"
                    labelKey="name"
                    onChange={(selected) => handleProductChange(selected)}
                    onInputChange={handleProductInputChange}
                    options={productOptions}
                    placeholder="Escribe el producto"
                    selected={product} // Esto será un array
                    isLoading={isLoadingProducts}
                    minLength={1}
                    clearButton
                  />
                </Form.Group>
                <Row className="mt-3">
                  <Col>
                    <Form.Group className="mb-3" controlId="quantity">
                      <Form.Label className="fw-bold">Cantidad</Form.Label>
                      <InputGroup>
                        <Button variant="outline-secondary" onClick={() => handleQuantityChange(-1)}>-</Button>
                        <Form.Control
                          type="number"
                          value={quantity}
                          readOnly
                        />
                        <Button variant="outline-secondary" onClick={() => handleQuantityChange(1)}>+</Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="unitPrice">
                      <Form.Label className="fw-bold">Precio Unitario</Form.Label>
                      <Form.Control
                        type="number"
                        value={unitPrice}
                        onChange={handleUnitPriceChange}
                        placeholder="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="totalSale">
                  <Form.Label className="fw-bold">Total</Form.Label>
                  <Form.Control
                    type="number"
                    value={totalSale}
                    readOnly
                  />
                </Form.Group>
                <Button style={{ backgroundImage: 'linear-gradient(to right, #29b1ef, #0675a8)' }} onClick={addToCart}>
                  Agregar Producto
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        {/* Panel Derecho */}
        <Col md={6}>
          <Card>
            <Card.Header className="text-center" style={{ backgroundImage: 'linear-gradient(to left, #D98E32, #fe713b)' }}>
              <h4 className="text-white">Carrito de Ventas</h4>
            </Card.Header>
            <Card.Body className="mt-3">
              {cart.length > 0 ? (
                <>
                  <ListGroup>
                    {cart.map((item, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Producto:</strong> {item.product[0].name} - <strong>Cantidad:</strong> {item.quantity} - <strong>Precio Unitario:</strong> ${item.unitPrice} - <strong>Total:</strong> ${item.total}
                        </div>
                        <div>
                          <Button variant="warning" size="sm" onClick={() => handleEditProduct(index)}>Editar</Button>
                          <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDeleteProduct(index)}>Eliminar</Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <h5 className="mt-3">Total del Carrito: ${totalCartAmount}</h5>
                  <Form.Group className="mt-3" controlId="paymentMethod">
                    <Form.Label className="fw-bold">Método de Pago</Form.Label>
                    <Form.Control
                      as="select"
                      value={paymentMethod}
                      onChange={handlePaymentMethodChange}
                    >
                      <option value="">Seleccione metodo</option>
                      {select_payment_method.map(item => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="saleStatus">
                    <Form.Label className="fw-bold">Estado de la Venta</Form.Label>
                    <Form.Control
                      as="select"
                      value={saleStatus}
                      onChange={(e) => setSaleStatus(e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      <option value="Pagado">Pagado</option>
                      <option value="Pendiente">Pendiente</option>
                    </Form.Control>
                  </Form.Group>
                  <Button style={{ backgroundImage: 'linear-gradient(to left, #29b1ef, #0675a8)' }} className="mt-3" onClick={handleCheckout}>
                    Finalizar Venta
                  </Button>
                </>
              ) : (
                <p>El carrito está vacío.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Sales;
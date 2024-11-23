import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, ListGroup, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import ProductCrud from 'views/products/ProductCrud';

const Sales = () => {
  const [product, setProduct] = useState('');
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await ProductCrud.fetchProducts();
        setProducts(productData);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const price = parseFloat(unitPrice) || 0;
    const total = quantity * price;
    setTotalSale(total);
  }, [quantity, unitPrice]);

  const handleProductChange = (e) => {
    const inputValue = e.target.value;
    setProduct(inputValue);

    const selectedProduct = products.find(p => p.name === inputValue);
    if (selectedProduct) {
      setUnitPrice(selectedProduct.price.toString());
    }
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
    if (!product) {
      setError('Por favor, ingrese un producto.');
      return;
    }

    const price = parseFloat(unitPrice) || 0;
    const newProduct = {
      product,
      quantity,
      unitPrice: price,
      total: quantity * price,
    };

    setCart([...cart, newProduct]);
    setProduct('');
    setQuantity(0);
    setUnitPrice('');
    setTotalSale(0);
    setError('');
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

  const handleCheckout = () => {
    if (!paymentMethod) {
      setError('Por favor, seleccione un método de pago.');
      return;
    }

    console.log("Venta enviada:", cart);
    console.log("Método de pago:", paymentMethod);
    setCart([]);
    setPaymentMethod('');
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
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el nombre del cliente"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
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
                  <Form.Control
                    type="text"
                    placeholder="Escriba o seleccione un producto"
                    value={product}
                    onChange={handleProductChange}
                    list="productList"
                  />
                  <datalist id="productList">
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.name}>
                        {prod.name}
                      </option>
                    ))}
                  </datalist>
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
                  Agregar Venta
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
                          <strong>Producto:</strong> {item.product} - <strong>Cantidad:</strong> {item.quantity} - <strong>Precio Unitario:</strong> ${item.unitPrice} - <strong>Total:</strong> ${item.total}
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
                      <option value="">Seleccione...</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                      <option value="Transferencia Bancaria">Transferencia Bancaria</option>
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
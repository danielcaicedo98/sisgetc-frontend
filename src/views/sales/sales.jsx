import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, ListGroup, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import ProductCrud from 'views/products/ProductCrud';

const Sales = () => {   
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
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

  const calculateTotalSale = () => {
    setTotalSale(quantity * unitPrice);
  };

  const handleProductChange = (e) => {
    const inputValue = e.target.value;
    setProduct(inputValue);

    const selectedProduct = products.find(p => p.name === inputValue);
    if (selectedProduct) {
      setUnitPrice(selectedProduct.price);
      calculateTotalSale();
    }
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(0, quantity + amount);
    setQuantity(newQuantity);
    calculateTotalSale();
  };

  const handleUnitPriceChange = (e) => {
    setUnitPrice(Number(e.target.value));
    calculateTotalSale();
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const addToCart = () => {
    if (!product) {
      setError('Por favor, ingrese un producto.');
      return;
    }

    const newProduct = {
      product,
      quantity,
      unitPrice,
      total: quantity * unitPrice,
    };

    setCart([...cart, newProduct]);
    setProduct('');
    setQuantity(0);
    setUnitPrice(0);
    setTotalSale(0);
    setError('');
  };

  const handleEditProduct = (index) => {
    const item = cart[index];
    setProduct(item.product);
    setQuantity(item.quantity);
    setUnitPrice(item.unitPrice);

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
    <React.Fragment>
      <Container fluid>
        <Row className='mt-1 mb-4'>
          <Card.Body>
            <h1>VENTAS</h1>

            <Form className="mb-3">
              <Row>
                <Col md={4}>
                  <Form.Group controlId="saleStatus">
                    <Form.Label>Estado de la Venta</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Ingrese el estado de la venta" 
                      value={saleStatus}
                      onChange={(e) => setSaleStatus(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="client">
                    <Form.Label>Cliente</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Ingrese el nombre del cliente" 
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="saleDate">
                    <Form.Label>Fecha de Venta</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Row>

        <Row>
          <Col md={6}>
            <Card>
              <Card.Body>
                <h4>Registro de Venta</h4>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form>
                  <Form.Group className="mb-3" controlId="product">
                    <Form.Label>Producto</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Escriba o seleccione un producto..." 
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

                  {/* Botones para aumentar/reducir cantidad */}
                  <Form.Group className="mb-3" controlId="quantity">
                    <Form.Label>Cantidad</Form.Label>
                    <InputGroup>
                      <Button variant="outline-secondary" onClick={() => handleQuantityChange(-1)}>-</Button>
                      <Form.Control 
                        type="number" 
                        placeholder="Ingrese la cantidad" 
                        value={quantity} 
                        readOnly 
                      />
                      <Button variant="outline-secondary" onClick={() => handleQuantityChange(1)}>+</Button>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="unitPrice">
                    <Form.Label>Precio Unitario</Form.Label>
                    <Form.Control 
                      type="number" 
                      placeholder="Ingrese el precio unitario" 
                      value={unitPrice} 
                      onChange={handleUnitPriceChange} 
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="totalSale">
                    <Form.Label>Total de la Venta</Form.Label>
                    <Form.Control 
                      type="number" 
                      placeholder="Total de la venta" 
                      value={totalSale} 
                      readOnly 
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3}
                      placeholder="Descripción de la venta"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="primary" onClick={addToCart}>
                    Agregar al Carrito
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Body>
                <h4>Carrito de Ventas</h4>
                {cart.length > 0 ? (
                  <>
                    <ListGroup className="mb-3">
                      {cart.map((item, index) => (
                        <ListGroup.Item key={index} style={{ color: '#6c757d' }}>
                          <strong>Producto:</strong> {item.product} - <strong>Cantidad:</strong> {item.quantity} - <strong>Precio Unitario:</strong> ${item.unitPrice} - <strong>Total:</strong> ${item.total}
                          <Button 
                            variant="warning" 
                            size="sm" 
                            className="ms-2" 
                            onClick={() => handleEditProduct(index)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            className="ms-2" 
                            onClick={() => handleDeleteProduct(index)}
                          >
                            Eliminar
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    <h6>Total del Carrito: ${totalCartAmount}</h6>

                    <Form.Group className="mb-3" controlId="paymentMethod">
                      <Form.Label>Método de Pago</Form.Label>
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

                    <Button variant="success" onClick={handleCheckout}>
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
    </React.Fragment>
  );
};

export default Sales;


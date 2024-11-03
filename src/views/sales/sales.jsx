import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, ListGroup, Form, Button, Alert } from 'react-bootstrap';
import ProductCrud from 'views/products/ProductCrud';

import SocialCard from 'components/Widgets/SocialCard';
import avatar1 from '../../assets/images/user/avatar-1.jpg'

const Sales = () => {   
  const [showForm, setShowForm] = useState(true);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts]  = useState([]);

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
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(p => p.id === selectedProductId);
    
    if (selectedProduct) {
      setProduct(selectedProduct.name);
      setUnitPrice(selectedProduct.price); 
      calculateTotalSale();
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
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


  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };
    
    return (
        <React.Fragment>
          <Container fluid>
            <Row className='mt-1 mb-4'>
              <Card.Body>
                <h1>VENTAS</h1>
                  <Card.Text className="">
                    Aquí podrá visualizar el estado de las ventas más recientes realizadas por Tortas Crispan y registrar una nueva venta.
                  </Card.Text>
              </Card.Body>
            </Row>

            <Row>
              <Col className="text-end mb-3">
                <Button variant="primary" onClick={toggleFormVisibility}>
                  {showForm ? 'Ocultar Formulario' : 'Registrar Venta'}
                </Button>
              </Col>
            </Row>

            {showForm && (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <h4>Registro de Venta</h4>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                  <Form.Group className="mb-3" controlId="product">
                    <Form.Label>Producto</Form.Label>
                    <Form.Control 
                      as="select" 
                      value={product} 
                      onChange={handleProductChange} 
                    >
                      <option value="">Seleccione un producto...</option>
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="quantity">
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control 
                      type="number" 
                      placeholder="Ingrese la cantidad" 
                      value={quantity} 
                      onChange={handleQuantityChange} 
                    />
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
                      placeholder="Ingrese el total de la venta" 
                      value={totalSale} 
                      readOnly 
                    />
                  </Form.Group>

                  <Button variant="primary" onClick={addToCart}>
                    Agregar al Carrito
                  </Button>
                </Form>

                {cart.length > 0 && (
                  <>
                    <h5 className="mt-4">Carrito de Ventas</h5>
                    <ListGroup className="mb-3">
                      {cart.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <strong>Producto:</strong> {item.product} - <strong>Cantidad:</strong> {item.quantity} - <strong>Precio Unitario:</strong> ${item.unitPrice} - <strong>Total:</strong> ${item.total}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    <h6>Total de la venta: ${totalCartAmount}</h6>

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
                      Enviar Venta
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
          <Row>
            <Col lg={4} md={12}>
              <SocialCard
                params={{
                  icon: 'fa fa-envelope-open',
                  class: 'red',
                  variant: 'primary',
                  primaryTitle: '8.62k',
                  primaryText: 'Suscriptores',
                  secondaryText: 'Tu lista de clientes crece',
                  label: 'Gestionar Lista'
                }}
              />
              <SocialCard 
                params={{
                  icon: 'fab fa-instagram',
                  class: 'red',
                  variant: 'success',
                  primaryTitle: '+40',
                  primaryText: 'Seguidores',
                  secondaryText: 'Tu base de seguidores crece',
                  label: 'Ver Seguidores',
                  href: 'https://www.instagram.com/tortas.crispan?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
                }}
              />
            </Col>
            <Col lg={8} md={12}>
              <Card>
                <Card.Header>
                  <h5>Últimas Actividades</h5>
                </Card.Header>
                <Card.Body className="card-body pt-4">
                  <ListGroup as="ul" bsPrefix=" " className="feed-blog ps-0">
                    <ListGroup.Item as="li" bsPrefix=" " className="active-feed">
                      <div className="feed-user-img">
                        <img src={avatar1} className="img-radius " alt="User-Profile" />
                      </div>
                      <h6>
                        <span className="badge bg-danger">Pedido</span> Eddie subió nuevos pedidos:{' '}
                        <small className="text-muted">Hace 2 horas</small>
                      </h6>
                      <p className="m-b-15 m-t-15">
                        Pedido especial para <b> @todos</b>. Detalles del pedido: Lorem Ipsum es simplemente un texto ficticio de la industria de la impresión.
                      </p>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

                  
          </Row>

        </Container>
      </React.Fragment>
  );
}

export default Sales;
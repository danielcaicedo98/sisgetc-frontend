import React, { useState } from 'react';
import { Card, Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';



import OrderCard from '../../components/Widgets/OrderCard';

import SocialCard from 'components/Widgets/SocialCard';

import avatar1 from '../../assets/images/user/avatar-1.jpg'

const Sales = () => {   
  const [showForm, setShowForm] = useState(false);

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
                    Suspendisse vel quam malesuada, aliquet sem sit amet, fringilla elit. Morbi tempor tincidunt tempor. Etiam id turpis
                    viverra, vulputate sapien nec, varius sem. Curabitur ullamcorper fringilla eleifend. In ut eros hendrerit est consequat
                    posuere et at velit.
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
                        <Form>
                          <Form.Group className="mb-3" controlId="product">
                            <Form.Label>Producto</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese el producto" />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="quantity">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control type="number" placeholder="Ingrese la cantidad" />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="unitPrice">
                            <Form.Label>Precio Unitario</Form.Label>
                            <Form.Control type="number" placeholder="Ingrese el precio unitario" />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="totalSale">
                            <Form.Label>Total de la Venta</Form.Label>
                            <Form.Control type="number" placeholder="Ingrese el total de la venta" />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="taxes">
                            <Form.Label>Impuestos</Form.Label>
                            <Form.Control type="number" placeholder="Ingrese los impuestos aplicables" />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="paymentMethod">
                            <Form.Label>Método de Pago</Form.Label>
                            <Form.Control as="select">
                              <option value="credit">Crédito</option>
                              <option value="debit">Débito</option>
                              <option value="cash">Efectivo</option>
                              <option value="paypal">PayPal</option>
                            </Form.Control>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="saleDate">
                            <Form.Label>Fecha de la Venta</Form.Label>
                            <Form.Control type="date" />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="customer">
                            <Form.Label>Cliente</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese el nombre del cliente" />
                          </Form.Group>

                          <Button variant="success" type="submit">
                            Guardar Venta
                          </Button>
                        </Form>
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
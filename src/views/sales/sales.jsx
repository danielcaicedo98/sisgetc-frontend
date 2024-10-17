import React, { useState } from 'react';
import { Card, Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';

import uniqueVisitorChart from './chart/analytics-unique-visitor-chart';
import customerChart from './chart/analytics-cuatomer-chart';
import customerChart1 from './chart/analytics-cuatomer-chart-1';

import OrderCard from '../../components/Widgets/OrderCard';
import Chart from 'react-apexcharts';
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
              <Col md = {12} xl = {6}>
                <Card>
                  <Card.Header>
                    <h5>Visitantes únicos</h5>
                  </Card.Header>
                  <Card.Body className='ps-4 pt-4 pb-0'>
                    <Chart {...uniqueVisitorChart}/>
                  </Card.Body>
                </Card>
              </Col>
              <Col md = {12} xl = {6}>
                <Row>
                  <Col sm = {6}>
                    <Card>
                     <Card.Body>
                      <Row>
                        <Col sm = "auto">
                          <span> Clientes</span>
                        </Col>
                        <Col className="text-end">
                          <h2 className="mb-0">82</h2>
                          <span className="text-c-yellow">
                            8.2%
                            <i className="feather icon-trending-up ms-1" />
                          </span>
                        </Col>
                      </Row>
                      <Chart {...customerChart1} />
                      <Row className="mt-3 text-center">
                        <Col>
                          <h3 className="m-0">
                            <i className="fas fa-circle f-10 mx-2" style={{color:'#BF0426'}} />
                              39
                          </h3>
                          <span className="ms-3">Nuevos</span>
                        </Col>
                        <Col>
                          <h3 className="m-0">
                          <i className="fas fa-circle f-10 mx-2" style={{ color: '#D9831A' }} />
                              18
                          </h3>
                          <span className="ms-3">Recurrentes</span>
                        </Col>
                      </Row>
                     </Card.Body>
                    </Card>
                  </Col>
                  <Col md={12} xl={6}>
                  <Row>
                    <Col sm={12}>
                      <Card className="bg-primary text-white">
                        <Card.Body>
                          <Row>
                            <Col sm="auto">
                              <span>Ventas</span>
                            </Col>
                            <Col className="text-end">
                              <h2 className="mb-0 text-white">90</h2>
                              <span className="text-white">
                                8.2%
                                <i className="feather icon-trending-up ms-1" />
                              </span>
                            </Col>
                          </Row>
                          <Chart {...customerChart} />
                          <Row className="mt-3 text-center">
                            <Col>
                              <h3 className="m-0 text-white">
                                <i className="fas fa-circle f-10 mx-2 text-success" />
                                  67
                              </h3>
                              <span className="ms-3">Individuales</span>
                            </Col>
                            <Col>
                              <h3 className="m-0 text-white">
                                <i className="fas fa-circle f-10 mx-2 text-white" />
                                  18
                              </h3>
                              <span className="ms-3">Compuestas</span>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>  
            </Col>
          </Row>

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
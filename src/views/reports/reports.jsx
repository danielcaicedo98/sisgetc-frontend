import React from 'react';
import { Card, Container, Row, Col} from 'react-bootstrap';

import uniqueVisitorChart from './chart/analytics-unique-visitor-chart';
import customerChart from './chart/analytics-cuatomer-chart';
import customerChart1 from './chart/analytics-cuatomer-chart-1';

import Chart from 'react-apexcharts';


const Reports = () => {   

    return (
        <React.Fragment>
          <Container fluid>
            <Row className='mt-1 mb-4'>
              <Card.Body>
                <h1>REPORTES</h1>
                  <Card.Text className="text-muted mb-4">
                    Suspendisse vel quam malesuada, aliquet sem sit amet, fringilla elit. Morbi tempor tincidunt tempor. Etiam id turpis
                    viverra, vulputate sapien nec, varius sem. Curabitur ullamcorper fringilla eleifend. In ut eros hendrerit est consequat
                    posuere et at velit.
                  </Card.Text>             
              </Card.Body>
            </Row>
            
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
          </Container>
        </React.Fragment>
      );
}


export default Reports;
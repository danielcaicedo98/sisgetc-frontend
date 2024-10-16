import React from 'react';
import { Card, Container, Row, Col, ListGroup} from 'react-bootstrap';

import OrderCard from '../../components/Widgets/OrderCard';
import Chart from 'react-apexcharts';
import SocialCard from 'components/Widgets/SocialCard';

const Sales = () => {   

    const uniqueVisitorChart = {}
    const customerChart = {}
    const avatar1 = '../../assets/images/user/avatar-1.jpg'
    
    return (
        <React.Fragment>
          <Container fluid>
            <Row className='mt-4'>
              <col md = {12} xl = {6}>
                <Card>
                  <Card.Body>
                    <h1>VENTAS</h1>
                    <Card.Text className="text-muted mb-4">
                      Suspendisse vel quam malesuada, aliquet sem sit amet, fringilla elit. Morbi tempor tincidunt tempor. Etiam id turpis
                      viverra, vulputate sapien nec, varius sem. Curabitur ullamcorper fringilla eleifend. In ut eros hendrerit est consequat
                      posuere et at velit.
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Header>
                    <h5> Visitantes Únicos</h5>
                  </Card.Header>
                  <Card.Body className='ps-4 pt-4 pb-0'>
                    <Chart {...uniqueVisitorChart}/>
                  </Card.Body>
                </Card>
              </col>
              <Col md = {12} xl = {6}>
                <Row>
                  <Col sm = {6}>
                    <Card>
                    <Col md={12} xl={6}>
          <Card>
            <Card.Header>
              <h5>Visitantes Únicos</h5>
            </Card.Header>
            <Card.Body className="ps-4 pt-4 pb-0">
              <Chart {...uniqueVisitorChart} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} xl={6}>
          <Row>
            <Col sm={6}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col sm="auto">
                      <span>Clientes</span>
                    </Col>
                    <Col className="text-end">
                      <h2 className="mb-0">826</h2>
                      <span className="text-c-green">
                        8.2%
                        <i className="feather icon-trending-up ms-1" />
                      </span>
                    </Col>
                  </Row>
                  <Chart {...customerChart} />
                  <Row className="mt-3 text-center">
                    <Col>
                      <h3 className="m-0">
                        <i className="fas fa-circle f-10 mx-2 text-success" />
                        674
                      </h3>
                      <span className="ms-3">Nuevos</span>
                    </Col>
                    <Col>
                      <h3 className="m-0">
                        <i className="fas fa-circle text-primary f-10 mx-2" />
                        182
                      </h3>
                      <span className="ms-3">Recurrentes</span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="bg-primary text-white">
                <Card.Body>
                  <Row>
                    <Col sm="auto">
                      <span>Clientes</span>
                    </Col>
                    <Col className="text-end">
                      <h2 className="mb-0 text-white">826</h2>
                      <span className="text-white">
                        8.2%
                        <i className="feather icon-trending-up ms-1" />
                      </span>
                    </Col>
                  </Row>
                  <Chart {...customerChart1} />
                  <Row className="mt-3 text-center">
                    <Col>
                      <h3 className="m-0 text-white">
                        <i className="fas fa-circle f-10 mx-2 text-success" />
                        674
                      </h3>
                      <span className="ms-3">Nuevos</span>
                    </Col>
                    <Col>
                      <h3 className="m-0 text-white">
                        <i className="fas fa-circle f-10 mx-2 text-white" />
                        182
                      </h3>
                      <span className="ms-3">Recurrentes</span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </React.Fragment>
      );
}

export default Sales;
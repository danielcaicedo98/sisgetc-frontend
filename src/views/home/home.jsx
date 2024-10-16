import React from 'react';

// react-bootstrap
import { Row, Col} from 'react-bootstrap';

// project import
import OrderCard from '../../components/Widgets/OrderCard';

const DashAnalytics = () => {
  return (
    <React.Fragment>
      <Row>
        {/* order cards */}
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Pedidos Recibidos',
              class: 'bg-c-blue',
              icon: 'feather icon-shopping-cart',
              primaryText: '486',
              secondaryText: 'Pedidos Completados',
              extraText: '351'
            }}
          />
        </Col>
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Ventas Totales',
              class: 'bg-c-green',
              icon: 'feather icon-tag',
              primaryText: '1641',
              secondaryText: 'Este Mes',
              extraText: '213'
            }}
          />
        </Col>
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Ingresos',
              class: 'bg-c-yellow',
              icon: 'feather icon-dollar-sign',
              primaryText: '$42,562',
              secondaryText: 'Este Mes',
              extraText: '$5,032'
            }}
          />
        </Col>
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Ganancia Total',
              class: 'bg-c-red',
              icon: 'feather icon-award',
              primaryText: '$9,562',
              secondaryText: 'Este Mes',
              extraText: '$542'
            }}
          />
        </Col>          
      </Row>
    </React.Fragment>
  );
};

export default DashAnalytics;
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Importa Link para navegación

import OrderCard from '../../components/Widgets/OrderCard';
import '../../assets/scss/themes/_homecustom.scss';

const DashAnalytics = () => {
  return (
    <React.Fragment>
      <div className='card_home'>
        <div class="card">
          <div class="card-body">
            <h5>Bienvenida de nuevo, Esperanza Quiñones!</h5>
            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
      </div>
      <Row>

        <Col md={6} xl={4}>
          {/* Envolver OrderCard en un Link para navegar */}
          <Link to="/sales" style={{ textDecoration: 'none' }}> {/* Ruta de destino */}
            <OrderCard
              params={{
                title: 'Gestión',
                class: 'bg-c-green',
                icon: 'feather icon-tag',
                primaryText: 'Ventas',
                secondaryText: 'This Month',
                extraText: '__'
              }}
            />
          </Link>
        </Col>
        <Col md={6} xl={4}>
          <Link to="/purchases" style={{ textDecoration: 'none' }}> {/* Otra ruta */}
            <OrderCard
              params={{
                title: 'Gestión',
                class: 'bg-c-yellow',
                icon: 'feather icon-shopping-cart',
                primaryText: 'Compras',
                secondaryText: 'This Month',
                extraText: '$__'
              }}
            />
          </Link>
        </Col>
        <Col md={6} xl={4}>
          <Link to="/reports" style={{ textDecoration: 'none' }}> {/* Otra ruta */}
            <OrderCard
              params={{
                title: 'Gestión',
                class: 'bg-c-red',
                icon: 'feather icon-activity',
                primaryText: 'Reportes',
                secondaryText: 'This Month',
                extraText: '$__'
              }}
            />
          </Link>
        </Col>

      </Row>
    </React.Fragment>
  );
};

export default DashAnalytics;
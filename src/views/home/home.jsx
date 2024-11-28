import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Importa Link para navegación

import OrderCard from '../../components/Widgets/OrderCard';
import '../../assets/scss/themes/_homecustom.scss';
import { fetchWithToken } from 'api/fetchHelpers';

const DashAnalytics = () => {
  const [user_name] = useState(localStorage.getItem('name') || '')

  const [metrics, setMetrics] = useState({
    ventas: '',
    total_ventas: "",
    compras: '',
    total_compras: '',
    utilidad: "",
    clientes_nuevos: '',
    todos_los_clientes: ''
  })

  useEffect(() => {
    fillMetrics();
  }, []);

  const dateToday = () => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${año}-${mes}-${dia}`;
  }

  const fillMetrics = async () => {
    const date_today = dateToday()
    const response = await fetchWithToken(`reports/dashboard/metrics/?filter_date=${date_today}`, null, 'GET')
    setMetrics({
      ventas: response.ventas,
      total_ventas: response.total_ventas,
      compras: response.compras,
      total_compras: response.total_compras,
      utilidad: response.utilidad,
      clientes_nuevos: response.clientes_nuevos,
      todos_los_clientes: response.todos_los_clientes
    })
    
  }

  
  return (
    <React.Fragment>
      <div className='card_home'>
        <div class="card">
          <div class="card-body">
            <h5>Bienvenido de nuevo, {user_name}!</h5>
            {/* <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> */}
          </div>
        </div>
      </div>
      <Row>
        <Col md={6} xl={4}>
          {/* Envolver OrderCard en un Link para navegar */}
          <Link to="/sales" style={{ textDecoration: 'none' }}> {/* Ruta de destino */}
            <OrderCard
              params={{
                title: 'Ventas Mes Actual',
                class: 'bg-c-green',
                icon: 'feather icon-tag',
                primaryText: `${metrics.total_ventas}`,
                secondaryText: 'Numero de ventas',
                extraText: `${metrics.ventas}`
              }}
            />
          </Link>
        </Col>
        <Col md={6} xl={4}>
          <Link to="/purchases" style={{ textDecoration: 'none' }}> {/* Otra ruta */}
            <OrderCard
              params={{
                title: 'Compras Mes Actual',
                class: 'bg-c-yellow',
                icon: 'feather icon-shopping-cart',
                primaryText: `${metrics.total_compras}`,
                secondaryText: 'Numero de Compras',
                extraText: `${metrics.compras}`
              }}
            />
          </Link>
        </Col>
        <Col md={6} xl={4}>
          <Link to="/customer" style={{ textDecoration: 'none' }}> {/* Otra ruta */}
            <OrderCard
              params={{
                title: 'Clientes Nuevos Mes Actual',
                class: 'bg-c-blue',
                icon: 'feather icon-user',
                primaryText: `${metrics.clientes_nuevos}`,
                secondaryText: 'Todos los Clientes',
                extraText: `${metrics.todos_los_clientes}`
              }}
            />
          </Link>
        </Col>
        <Col md={6} xl={4}>
          <Link to="/" style={{ textDecoration: 'none' }}> {/* Otra ruta */}
            <OrderCard
              params={{
                title: 'Ganancias Mes Actual',
                class: 'bg-c-red',
                icon: 'feather icon-activity',
                primaryText: `${metrics.utilidad}`,
                secondaryText: '',
                extraText: ` `
              }}
            />
          </Link>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashAnalytics;
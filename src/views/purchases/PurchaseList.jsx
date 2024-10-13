// src/views/purchases/PurchasesList.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PurchaseDetailsModal from './PurchaseDetailsModal';
import './PurchasesList.scss';

const PurchasesList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    date: '',
    provider: '',
    description: '',
  });

  const navigate = useNavigate();

  const fetchPurchases = () => {
    setLoading(true);
    fetch('http://localhost:5000/purchases')
      .then(response => response.json())
      .then(data => {
        setPurchases(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching purchases:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPurchase(null);
    setShowModal(false);
  };

  const handleUpdatePurchase = (updatedPurchase) => {
    const updatedPurchases = purchases.map(p => (p.id === updatedPurchase.id ? updatedPurchase : p));
    setPurchases(updatedPurchases);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Filtrar las compras según los criterios
  const filteredPurchases = purchases.filter(purchase => {
    const dateMatch = filters.date ? new Date(purchase.fecha).toLocaleDateString() === new Date(filters.date).toLocaleDateString() : true;
    const providerMatch = purchase.proveedor.name.toLowerCase().includes(filters.provider.toLowerCase());
    const descriptionMatch = purchase.descripcion.toLowerCase().includes(filters.description.toLowerCase());

    return dateMatch && providerMatch && descriptionMatch;
  });

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <span>Cargando compras...</span>
      </div>
    );
  }
  const convertirFecha = (fecha) => {
    const [año, mes, día] = fecha.split('-');
    return `${día}/${mes}/${año}`;
  };

  return (
    <div className="purchases-list-container">
      <h2>Lista de Compras</h2>
      
      {/* Filtros */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="filterDate">
            <Form.Label>Fecha:</Form.Label>
            <Form.Control 
              type="date" 
              name="date" 
              value={filters.date} 
              onChange={handleFilterChange} 
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="filterProvider">
            <Form.Label>Proveedor:</Form.Label>
            <Form.Control 
              type="text" 
              name="provider" 
              value={filters.provider} 
              onChange={handleFilterChange} 
              placeholder="Proveedor" 
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="filterDescription">
            <Form.Label>Descripción:</Form.Label>
            <Form.Control 
              type="text" 
              name="description" 
              value={filters.description} 
              onChange={handleFilterChange} 
              placeholder="Descripción" 
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Contenedor con scroll */}
      <div className="table-container">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Descripción</th>
              <th>Total ($)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map(purchase => (
              <tr key={purchase.id}>
                <td>{convertirFecha(purchase.fecha)}</td>
                <td>{purchase.proveedor.name}</td>
                <td>{purchase.descripcion}</td>
                <td>{purchase.total.toFixed(2)}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    onClick={() => handleViewDetails(purchase)}
                    className="me-2"
                  >
                    Ver Detalles
                  </Button>                
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal para ver y editar detalles de la compra */}
      {selectedPurchase && (
        <PurchaseDetailsModal 
          show={showModal} 
          handleClose={handleCloseModal} 
          purchase={selectedPurchase} 
          onUpdate={handleUpdatePurchase}
        />
      )}
    </div>
  );
};

export default PurchasesList;
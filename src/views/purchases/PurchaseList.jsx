// src/views/purchases/PurchasesList.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PurchaseDetailsModal from './PurchaseDetailsModal';
import './PurchasesList.scss';

const PurchasesList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch all purchases from the server
  useEffect(() => {
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
  }, []);

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPurchase(null);
    setShowModal(false);
  };

  const handleEdit = (id) => {
    navigate(`/purchases`);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <span>Cargando compras...</span>
      </div>
    );
  }

  return (
    <div className="purchases-list-container">
      <h2>Lista de Compras</h2>
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
          {purchases.map(purchase => (
            <tr key={purchase.id}>
              <td>{new Date(purchase.fecha).toLocaleDateString()}</td>
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
                <Button 
                  variant="warning" 
                  size="sm" 
                  onClick={() => handleEdit(purchase.id)}
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para ver detalles de la compra */}
      {selectedPurchase && (
        <PurchaseDetailsModal 
          show={showModal} 
          handleClose={handleCloseModal} 
          purchase={selectedPurchase} 
        />
      )}
    </div>
  );
};

export default PurchasesList;

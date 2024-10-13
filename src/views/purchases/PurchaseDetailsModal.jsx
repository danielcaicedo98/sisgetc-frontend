// src/views/purchases/PurchaseDetailsModal.jsx
import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const PurchaseDetailsModal = ({ show, handleClose, purchase }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Fecha:</strong> {new Date(purchase.fecha).toLocaleDateString()}</p>
        <p><strong>Proveedor:</strong> {purchase.proveedor.name}</p>
        <p><strong>Descripción:</strong> {purchase.descripcion}</p>
        <p><strong>Total:</strong> ${purchase.total.toFixed(2)}</p>

        <h5>Productos:</h5>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Unidad</th>
              <th>Precio ($)</th>
              <th>Subtotal ($)</th>
            </tr>
          </thead>
          <tbody>
            {purchase.productos.map((p, index) => (
              <tr key={index}>
                <td>{p.producto.name}</td>
                <td>{p.cantidad}</td>
                <td>{p.unidad}</td>
                <td>{p.precio.toFixed(2)}</td>
                <td>{(p.cantidad * p.precio).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PurchaseDetailsModal;

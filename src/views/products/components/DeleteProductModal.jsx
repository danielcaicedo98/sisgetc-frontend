import React from 'react';

const DeleteProductModal = ({ showModal, handleClose, handleConfirm }) => {
  if (!showModal) return null;

  return (
    <div className="modal d-block" style={modalOverlayStyle}>
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmación</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de eliminar este producto?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
            <button className="btn btn-success" onClick={handleConfirm}>Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilo para el overlay del modal (fondo semi-transparente)
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1050, // Asegurarse de que esté encima de otros elementos
};

export default DeleteProductModal;

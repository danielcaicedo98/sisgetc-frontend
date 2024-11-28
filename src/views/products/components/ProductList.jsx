import React, { useState } from 'react';
import './ProductList.scss';

const ProductList = ({ products, onEdit, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDesctiption, setSelectedDescription] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calcula los productos a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const handleImageClick = (imageSrc, descriptionSrc) => {
    setSelectedImage(imageSrc);
    setSelectedDescription(descriptionSrc)
  };



  const closeModal = () => {
    setSelectedImage(null);
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="product-list">
      <div className="table-container">


        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Unidad de Medida</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan="8">No hay productos agregados.</td>
              </tr>
            ) : (
              currentProducts.map((product, index) => (
                <tr key={index}>
                  <td>
                    {product.photo && (
                      <img
                        src={product.photo}
                        alt={product.name}
                        className="thumbnail"
                        onClick={() => handleImageClick(product.photo, product.description)}
                      />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.measurement_unit.label}</td>
                  <td>{product.price}</td>
                  <td>{product.category.label}</td>
                  <td>
                    <button onClick={() => onEdit(product)}>Editar</button>
                    <button onClick={() => onDelete(product.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          {'<'}
        </button>
        <span className='m-2'>{` Página ${currentPage} de ${totalPages} `}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          {'>'}
        </button>
      </div>

      {/* Modal para mostrar la imagen ampliada */}
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <img src={selectedImage} alt="Imagen ampliada" className="large-image" />
            <div className="card mt-1">
              <div className="card-body">
                <h5 className="card-title">Descripción</h5>
                <p className="card-text">{selectedDesctiption}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

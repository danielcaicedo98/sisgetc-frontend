import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { fetchWithToken } from 'api/fetchHelpers';
import DeleteProductModal from './components/DeleteProductModal';

const ProductCrud = () => {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetchWithToken('products/', null, 'GET');
    console.log(response)
    setProducts(response);
  };

  const addProduct = async (product) => {

    const response = await fetchWithToken('products/', product, 'POST');
    const newProduct = await response.json();
    setProducts([...products, product]);
  };

  const updateProduct = async (updatedProduct) => {
    const response = await fetchWithToken(`products/${updatedProduct.id}`, updatedProduct, 'PUT');
    const product = await response.json();
    setProducts(products.map((p) => (p.id === product.id ? product : p)));
    setProductToEdit(null);
  };
  
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [productToDelete, setProductToDelete] = useState(null); // Producto seleccionado para eliminar
  const [confirmationMessage, setConfirmationMessage] = useState(''); // Mensaje de confirmación

  // Función para eliminar el producto
  const deleteProduct = async (id) => {
    setShowModal(false);
    const response = await fetchWithToken(`products/${id}/`, null, 'DELETE');   
  };

  // Función para abrir el modal
  const handleShowModal = (id) => {
    setProductToDelete(id); // Guardar el id del producto a eliminar
    setShowModal(true); // Mostrar el modal
  };

  // Función para cerrar el modal sin hacer nada
  const handleCloseModal = () => {
    setShowModal(false); // Cerrar el modal
    setProductToDelete(null); // Resetear el id del producto
  };

  // Función para confirmar la eliminación
  const handleConfirmDeletion = () => {
    if (productToDelete !== null) {
      deleteProduct(productToDelete); // Eliminar el producto
      setTimeout(() => {
        alert('Producto Eliminado');
        window.location.reload(); // Recargar la página
      }, 500);
    }
    // Cerrar el modal
    setProductToDelete(null); // Resetear el id del producto
  };

  const handleEdit = (product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsEdit(true)
    setProductToEdit(product);
  };

  const handleSubmit = (product) => {
    if (productToEdit) {
      updateProduct(product);
    } else {
      addProduct(product);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Gestiona tus Productos</h1>
      <DeleteProductModal
        showModal={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmDeletion}
      />
      <ProductForm onSubmit={handleSubmit} productToEdit={productToEdit} isEdit={isEdit} />
      <ProductList products={products} onEdit={handleEdit} onDelete={handleShowModal} />
    </div>
  );
};

export default ProductCrud;

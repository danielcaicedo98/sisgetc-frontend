import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { fetchWithToken } from 'api/fetchHelpers';

const ProductCrud = () => {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetchWithToken('products',null,'GET');
    // const data = await response.json();
    console.log(response)
    setProducts(response);
  };

  const addProduct = async (product) => {
    
    const response = await fetchWithToken('products', product,'POST');
    const newProduct = await response.json();
    setProducts([...products, newProduct]);
  };

  const updateProduct = async (updatedProduct) => {
    const response = await fetch(`products/${updatedProduct.id}`, updatedProduct,'PUT');
    const product = await response.json();
    setProducts(products.map((p) => (p.id === product.id ? product : p)));
    setProductToEdit(null);
  };

  const deleteProduct = async (id) => {    
    const response = await fetchWithToken(`products/${id}/`, null, 'DELETE');
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEdit = (product) => {
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
      <h1>Product Management</h1>
      <ProductForm onSubmit={handleSubmit} productToEdit={productToEdit} />
      <ProductList products={products} onEdit={handleEdit} onDelete={deleteProduct} />
    </div>
  );
};

export default ProductCrud;

import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { fetchWithToken } from 'api/fetchHelpers';

const ProductCrud = () => {
  const [products, setProducts] = useState([
    {
      name: "Manzanas",
      quantity: 10,
      measurement_unit: "kg",
      price: 2500,
      description: "Manzanas frescas y jugosas",
      category: "Frutas",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2022/09/IMG_20220916_200154-768x1024.jpg"
    },
    {
      name: "Manzanas",
      quantity: 10,
      measurement_unit: "kg",
      price: 2500,
      description: "Manzanas frescas y jugosas",
      category: "Frutas",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2022/09/IMG_20220916_200154-768x1024.jpg"
    },
    {
      name: "Manzanas",
      quantity: 10,
      measurement_unit: "kg",
      price: 2500,
      description: "Manzanas frescas y jugosas",
      category: "Frutas",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2022/09/IMG_20220916_200154-768x1024.jpg"
    },
    {
      name: "Manzanas",
      quantity: 10,
      measurement_unit: "kg",
      price: 2500,
      description: "Manzanas frescas y jugosas",
      category: "Frutas",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2022/09/IMG_20220916_200154-768x1024.jpg"
    },
    {
      name: "Manzanas",
      quantity: 10,
      measurement_unit: "kg",
      price: 2500,
      description: "Manzanas frescas y jugosas",
      category: "Frutas",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2022/09/IMG_20220916_200154-768x1024.jpg"
    },
    {
      name: "Leche",
      quantity: 5,
      measurement_unit: "litros",
      price: 3500,
      description: "Leche entera de alta calidad",
      category: "Lácteos",
      photo: "https://via.placeholder.com/150"
    },
    {
      name: "Harina de trigo",
      quantity: 3,
      measurement_unit: "kg",
      price: 4000,
      description: "Harina de trigo refinada",
      category: "Cereales",
      photo: "https://via.placeholder.com/150"
    },
    {
      name: "Huevos",
      quantity: 30,
      measurement_unit: "unidades",
      price: 12000,
      description: "Huevos frescos de granja",
      category: "Proteínas",
      photo: "https://via.placeholder.com/150"
    },
    {
      name: "Arroz",
      quantity: 2,
      measurement_unit: "kg",
      price: 2000,
      description: "Arroz blanco de alta calidad",
      category: "Cereales",
      photo: "https://via.placeholder.com/150"
    }
  ]);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetchWithToken('products', null, 'GET');
    // const data = await response.json();
    console.log(response)
    setProducts(response);
  };

  const addProduct = async (product) => {

    const response = await fetchWithToken('products', product, 'POST');
    const newProduct = await response.json();
    setProducts([...products, product]);
  };

  const updateProduct = async (updatedProduct) => {
    const response = await fetchWithToken(`products/${updatedProduct.id}`, updatedProduct, 'PUT');
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
      <h1>Gestiona tus Productos</h1>
      <ProductForm onSubmit={handleSubmit} productToEdit={productToEdit} />
      <ProductList products={products} onEdit={handleEdit} onDelete={deleteProduct} />
    </div>
  );
};

export default ProductCrud;

import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { fetchWithToken } from 'api/fetchHelpers';

const ProductCrud = () => {
  const [products, setProducts] = useState([
    {
      name: "Cupcake Amor",
      quantity: 10,
      measurement_unit: "unidad",
      price: 5500,
      description: "Cupcake con bizcocho artesanal. Puedes disfrutarlo en sabores como: Coco, Maní, Vainilla, Chocolate, Maracuyá … etc",
      category: "Cupakes",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2022/09/IMG_20220916_200154-768x1024.jpg"
    },
    {
      name: "DripCake REF01 1LB",
      quantity: 5,
      measurement_unit: "unidad",
      price: 108000,
      description: "Deliciosa torta alta con efecto chorreante y brillos.",
      category: "DripCakes",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2021/10/1633067145494-1-1-247x296.jpg"
    },
    {
      name: "Torta Gourmet Maracuya",
      quantity: 10,
      measurement_unit: "Kilo Gramo",
      price: 12000,
      description: "Torta finamente preparada con productos seleccionados y 100% naturales,  con un delicioso sabor y cubierta de maracuyá.",
      category: "Tortas Gourmet",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2021/08/tb_maracuya_02-600x616.jpg"
    },
    {
      name: "Cupcake Amor",
      quantity: 10,
      measurement_unit: "unidad",
      price: 5500,
      description: "Cupcake con bizcocho artesanal. Puedes disfrutarlo en sabores como: Coco, Maní, Vainilla, Chocolate, Maracuyá … etc",
      category: "Cupakes",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2022/09/IMG_20220916_200154-768x1024.jpg"
    },
    {
      name: "DripCake REF01 1LB",
      quantity: 5,
      measurement_unit: "unidad",
      price: 108000,
      description: "Deliciosa torta alta con efecto chorreante y brillos.",
      category: "DripCakes",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2021/10/1633067145494-1-1-247x296.jpg"
    },
    {
      name: "Torta Gourmet Maracuya",
      quantity: 10,
      measurement_unit: "kg",
      price: 12000,
      description: "Torta finamente preparada con productos seleccionados y 100% naturales,  con un delicioso sabor y cubierta de maracuyá.",
      category: "Tortas Gourmet",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2021/08/tb_maracuya_02-600x616.jpg"
    },
    {
      name: "Cupcake Amor",
      quantity: 10,
      measurement_unit: "unidad",
      price: 5500,
      description: "Cupcake con bizcocho artesanal. Puedes disfrutarlo en sabores como: Coco, Maní, Vainilla, Chocolate, Maracuyá … etc",
      category: "Cupakes",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2022/09/IMG_20220916_200154-768x1024.jpg"
    },
    {
      name: "DripCake REF01 1LB",
      quantity: 5,
      measurement_unit: "unidad",
      price: 108000,
      description: "Deliciosa torta alta con efecto chorreante y brillos.",
      category: "DripCakes",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2021/10/1633067145494-1-1-247x296.jpg"
    },
    {
      name: "Torta Gourmet Maracuya",
      quantity: 10,
      measurement_unit: "kg",
      price: 12000,
      description: "Torta finamente preparada con productos seleccionados y 100% naturales,  con un delicioso sabor y cubierta de maracuyá.",
      category: "Tortas Gourmet",
      photo: "https://www.tortascrispan.com/wp-content/uploads/2021/08/tb_maracuya_02-600x616.jpg"
    },
  ]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isEdit,setIsEdit] = useState(false);

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
    console.log(id)
    const response = await fetchWithToken(`products/${id}/`, null, 'DELETE');
    console.log(response)
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEdit = (product) => {
    setIsEdit(true)
    setProductToEdit(product);
    console.log(product)
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
      <ProductForm onSubmit={handleSubmit} productToEdit={productToEdit} isEdit={isEdit} />
      <ProductList products={products} onEdit={handleEdit} onDelete={deleteProduct} />
    </div>
  );
};

export default ProductCrud;

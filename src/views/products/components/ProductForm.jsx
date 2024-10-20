import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, productToEdit }) => {
  const [product, setProduct] = useState({ name: '', price: '' });

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
    setProduct({ name: '', price: '' }); // Reset form after submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Product Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="price" className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          id="price"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-success">Save</button>
    </form>
  );
};

export default ProductForm;

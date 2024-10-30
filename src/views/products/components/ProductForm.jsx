import React, { useState } from "react";
import "./ProductForm.scss";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    measurement_unit: "",
    price: "",
    description: "",
    category: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photo: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Aquí puedes manejar el envío del formulario
  };

  return (
    <form className="responsive-form" onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </label>
      <label>
        Quantity:
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
      </label>
      <label>
        Measurement Unit:
        <select name="measurement_unit" value={formData.measurement_unit} onChange={handleChange}>
          <option value="kg">Kg</option>
          <option value="g">g</option>
          <option value="lb">lb</option>
        </select>
      </label>
      <label>
        Price:
        <input type="number" name="price" value={formData.price} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </label>
      <label>
        Category:
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="food">Food</option>
        </select>
      </label>
      <label>
        Photo:
        <div className="" >
          <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
        </div>
      </label>
      <button type="submit" className="save-button">Save</button>
    </form>
  );
};

export default ProductForm;

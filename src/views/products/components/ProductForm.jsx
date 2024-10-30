import React, { useEffect, useState } from "react";
import "./ProductForm.scss";

const ProductForm = ({ productToEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    measurement_unit: "",
    price: "",
    description: "",
    category: "",
    photo: null,
  });  

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    }
  }, [productToEdit]);



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
        Nombre:
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </label>
      <label>
        Cantidad:
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
      </label>
      <label>
        Unidad de Medida:
        <select name="measurement_unit" value={formData.measurement_unit} onChange={handleChange}>
          <option value="Kilo Gramo">Kilo Gramo</option>
          <option value="g">g</option>
          <option value="lb">lb</option>
          <option value="unidad">unidad</option>
        </select>
      </label>
      <label>
        Precio:
        <input type="number" name="price" value={formData.price} onChange={handleChange} />
      </label>      
      <label>
        Categoría:
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Cupcakes">Cupcakes</option>
          <option value="DripCakes">DripCakes</option>
          <option value="Tortas Gourmet">Tortas Gourmet</option>
        </select>
      </label>
      <label>
        Foto:
        <div className="" >
          <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
        </div>
      </label>
      <label>
        Descripción:
        <textarea name="description" value={formData.description} onChange={handleChange} className="text-area" />
      </label>
      <button type="submit" className="save-button">Guardar</button>
    </form>
  );
};

export default ProductForm;

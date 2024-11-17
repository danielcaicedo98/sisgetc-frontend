import React, { useEffect, useState } from "react";
import "./ProductForm.scss";
import { fetchWithToken } from "api/fetchHelpers";

const ProductForm = ({ productToEdit, isEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    measurement_unit: "1",
    price: "",
    description: "",
    category: "1",
    photo: null,
  });

  const [isEditF, setIsEditF] = useState(false)
  const [select_measurements, setSelectMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fillMeasurement();
  }, []);

  const fillMeasurement = async () => {
    setLoading(true); // Indicamos que la carga está en proceso
    try {
      const res = await fetchWithToken('basics/measurement_units/', null, 'GET');

      // Aquí suponemos que la respuesta es un array directo. Si es un objeto con una propiedad que contiene el array, ajusta esto.
      if (Array.isArray(res)) {
        setSelectMeasurements(res); // Guardamos el array de unidades en el estado
      } else {
        // Si la respuesta es un objeto con una clave (ejemplo: { data: [...] })
        setSelectMeasurements(res.data || []); // Ajusta según la estructura de la respuesta
      }
      setLoading(false);
    } catch (error) {
      setError('Error fetching measurements');
      setLoading(false);
      console.error('Error fetching measurements:', error);
    }
  };

  useEffect(() => {
    if (productToEdit) {
      console.log(productToEdit)
      setIsEditF(isEdit)
      setFormData(productToEdit);
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(name, value)
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photo: e.target.files[0],
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(formData)
    if (isEditF) {
      const updatedProduct = {
        id: formData.id,
        name: formData.name,
        quantity: formData.quantity,
        measurement_unit: typeof formData.measurement_unit == "object" ? formData.measurement_unit.value : formData.measurement_unit,
        price: formData.price,
        description: formData.description,
        category: typeof formData.category == 'object' ? formData.category.value : formData.category
      }

      const response = await fetchWithToken(`products/${updatedProduct.id}/`, updatedProduct, 'PUT');
      if (response.updated) {
        alert('Producto actualizado exitosamente.');
        window.location.reload();
      } else {
        alert(`Error en campos: ${Object.keys(response)}\nDescripción: ${Object.values(response).flat()[0]}`);
      }
    } else if (!isEditF) {
      const addProduct = {
        name: formData.name,
        quantity: formData.quantity,
        measurement_unit: typeof formData.measurement_unit == "object" ? formData.measurement_unit.value : formData.measurement_unit,
        price: formData.price,
        description: formData.description,
        category: formData.category
      }

      const response = await fetchWithToken('products/', addProduct, 'POST');
      if (response.updated) {
        alert('Producto agregado exitosamente.');
        setFormData([...formData, addProduct]);
      } else {
        alert(`Error en campos: ${Object.keys(response)}\nDescripción: ${Object.values(response).flat()[0]}`);
      }
    }
  };

  return (
    <form className="responsive-form">
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
        <select name="measurement_unit" value={formData.measurement_unit.value} onChange={handleChange}>
          <option value="">Selecciona unidad</option>
          {select_measurements.map(item => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Precio:
        <input type="number" name="price" value={formData.price} onChange={handleChange} />
      </label>
      <label>
        Categoría:
        <select name="category" value={formData.category.value} onChange={handleChange}>
          <option value="1">TORTAS</option>
          <option value="2">GALLETAS</option>
          <option value="3">MUFFINS</option>
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
      {isEdit ? <button onClick={handleUpdate} className="edit-button">Editar</button> : <button onClick={handleUpdate} className="save-button">Guardar</button>}
    </form>
  );
};

export default ProductForm;

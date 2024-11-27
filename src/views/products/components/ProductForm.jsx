import React, { useEffect, useState } from "react";
import "./ProductForm.scss";
import { fetchWithToken, fetchWithTokenForm } from "api/fetchHelpers";

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
  const [select_categories, setSelectCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fillMeasurement();
    fillCategory()
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

  const fillCategory = async () => {
    setLoading(true); // Indicamos que la carga está en proceso
    try {
      const res = await fetchWithToken('basics/categories/', null, 'GET');
      // Aquí suponemos que la respuesta es un array directo. Si es un objeto con una propiedad que contiene el array, ajusta esto.
      if (Array.isArray(res)) {
        setSelectCategories(res); // Guardamos el array de unidades en el estado
      } else {
        // Si la respuesta es un objeto con una clave (ejemplo: { data: [...] })
        setSelectCategories(res.data || []); // Ajusta según la estructura de la respuesta
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

    if (isEditF) {

      const setAddProduct = new FormData();

      // Desestructuración de formData para mayor claridad y limpieza
      const { id, name, quantity, measurement_unit, price, description, category, photo } = formData;

      // Construcción del objeto updatedProduct
      const updatedProduct = {
        id,
        name,
        quantity,
        measurement_unit: typeof measurement_unit === "object" ? measurement_unit.value : measurement_unit,
        price,
        description,
        category: typeof category === 'object' ? category.value : category,
        is_active: true
      };

      // Agregar los datos al FormData
      Object.entries(updatedProduct).forEach(([key, value]) => {
        if (key === 'photo' && value instanceof File) {
          // Si es un archivo, agregarlo directamente
          setAddProduct.append(key, value);
        } else {
          // Si no es un archivo, agregar el valor normal
          setAddProduct.append(key, value);
        }
      });

      // Si photo es un objeto, lo agregamos también
      if (photo instanceof File) {
        setAddProduct.append("photo", photo);
      }

      // Enviar la solicitud PUT para actualizar el producto
      const response = await fetchWithTokenForm(`products/${updatedProduct.id}/`, setAddProduct, 'PUT');

      // Manejar la respuesta
      if (response.updated) {
        alert('Producto actualizado exitosamente.');
        window.location.reload();
      } else {
        // Si la respuesta contiene errores, formatear la alerta
        const errorFields = Object.keys(response);
        const errorDescription = Object.values(response).flat()[0];
        alert(`Error en campos: ${errorFields.join(', ')}\nDescripción: ${errorDescription}`);
      }
    } else if (!isEditF) {
      const addProduct = new FormData();
      for (let key in formData) {
        if (key === 'photo' && formData[key] instanceof File) {
          // Verifica si el campo es un archivo
          addProduct.append(key, formData[key]);
        } else {
          // Si no es un archivo, agrega el dato normalmente
          addProduct.append(key, formData[key]);
        }
      }
      addProduct.append("is_active", true)
      const response = await fetchWithTokenForm('products/', addProduct, 'POST');
      if (response.updated) {
        alert('Producto agregado exitosamente.');
        window.location.reload(); // Recargar la página
        setFormData([...formData, addProduct]);
      } else {
        alert(`Error en campos: ${Object.keys(response)}\nDescripción: ${Object.values(response).flat()[0]}`);
      }
    }
  };


  // const handleUpdate = async (e) => {
  //   e.preventDefault();

  //   // Crear un objeto FormData para enviar los datos
  //   const formDataToSend = new FormData();
  //   formDataToSend.append("name", formData.name);
  //   formDataToSend.append("quantity", formData.quantity);
  //   formDataToSend.append("measurement_unit",
  //     typeof formData.measurement_unit === "object"
  //       ? formData.measurement_unit.value
  //       : formData.measurement_unit
  //   );
  //   formDataToSend.append("price", formData.price);
  //   formDataToSend.append("description", formData.description);
  //   formDataToSend.append("category",
  //     typeof formData.category === "object"
  //       ? formData.category.value
  //       : formData.category
  //   );
  //   if (formData.photo) {
  //     formDataToSend.append("photo", formData.photo);
  //   }

  //   // Editar o agregar producto
  //   const endpoint = isEditF ? `products/${formData.id}/` : "products/";
  //   const method = isEditF ? "PUT" : "POST";

  //   console.log(formDataToSend)

  //   const response = await fetchWithTokenForm(endpoint, formDataToSend, method);

  //   if (response.updated) {
  //     alert(`${isEditF ? "Producto actualizado" : "Producto agregado"} exitosamente.`);
  //     // window.location.reload();
  //   } else {
  //     alert(`Error en campos: ${Object.keys(response)}\nDescripción: ${Object.values(response).flat()[0]}`);
  //   }
  // };

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
          <option value="">Selecciona categoria</option>
          {select_categories.map(item => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
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

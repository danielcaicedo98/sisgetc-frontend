// src/views/purchases/Purchases.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import ProductItem from './ProductItem'; // Asegúrate de importar el componente actualizado
import '../../assets/scss/purchases/Purchases.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithToken } from '../../api/fetchHelpers';

const Purchases = () => {
  const { id } = useParams(); // Obtener el ID de la compra a editar, si existe
  const navigate = useNavigate();

  const [productos, setProductos] = useState([{
    id: Date.now(),
    text: '',
    precio: '',
    cantidad: '',
    unidad: 'Unidades',
    productoObj: null
  }]);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);

  // Nuevos estados para fecha, proveedor, descripción y total
  const [fecha, setFecha] = useState('');
  const [proveedor, setProveedor] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [total, setTotal] = useState(0);

  // Estados de error para fecha, proveedor y descripción
  const [fechaError, setFechaError] = useState('');
  const [proveedorError, setProveedorError] = useState('');
  const [descripcionError, setDescripcionError] = useState('');

  // Estados para sugerencias de proveedores y productos
  const [providerOptions, setProviderOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  // Estados para manejar el loading de las sugerencias
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Debounce timers
  const [providerDebounceTimer, setProviderDebounceTimer] = useState(null);
  const [productDebounceTimer, setProductDebounceTimer] = useState(null);


  const searchProviders = async (query) => {
    if (!query) {
      setProviderOptions([]);
      console.log("no encontrado")
      return;
    }

    setIsLoadingProviders(true);

    try {
      // Llamar a fetchWithToken para obtener los proveedores filtrados por el nombre
      const data = await fetchWithToken(`providers?name_like=${encodeURIComponent(query)}`, null, 'GET');

      const uniqueNames = new Set(data.map(provider => provider.name));

      // Agregar el nuevo proveedor solo si no existe
      if (!uniqueNames.has(query)) {
        uniqueNames.add(query);
        data.push({
          id: `${Date.now() + Math.random()}`,
          name: `${query}`
        });
      }

      setProviderOptions(data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching providers:', error);
      setIsLoadingProviders(false);
      setProviderOptions([{
        id: `${Date.now() + Math.random()}`,
        name: `${query}`
      }])
      
      
    } finally {
      setIsLoadingProviders(false);
    }
  };

  // Función para buscar productos  

  const searchProducts = async (query) => {
    if (!query) {
      setProductOptions([]);
      console.log("no encontrado")
      return;
    }

    setIsLoadingProducts(true);

    try {
      // Llamar a fetchWithToken para obtener los productos filtrados por el nombre
      const data = await fetchWithToken(`products?name_like=${encodeURIComponent(query)}`, null, 'GET');

      const uniqueNames = new Set(data.map(product => product.name));

      // Agregar el nuevo producto solo si no existe
      if (!uniqueNames.has(query)) {
        uniqueNames.add(query);
        data.push({
          id: `${Date.now() + Math.random()}`,
          name: `${query}`
        });
      }

      setProductOptions(data);
    } catch (error) {
      setIsLoadingProviders(false);
      setProductOptions([{
        id: `${Date.now() + Math.random()}`,
        name: `${query}`
      }])
      console.error('Error fetching products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };


  // Manejar cambios en el proveedor con debounce
  const handleProviderInputChange = (query) => {
    if (providerDebounceTimer) {
      clearTimeout(providerDebounceTimer);
    }

    const timer = setTimeout(() => {
      searchProviders(query);
    }, 300); // Espera 300ms después del último cambio
    setProviderDebounceTimer(timer);
  };

  // Manejar cambios en el producto con debounce
  const handleProductInputChange = (query, productId) => {
    if (productDebounceTimer) {
      clearTimeout(productDebounceTimer);
    }

    const timer = setTimeout(() => {
      searchProducts(query);
    }, 300);
    setProductDebounceTimer(timer);
  };

  // Manejar cambios en el producto seleccionado
  const handleProductoChange = useCallback((id, productoObj) => {
    setProductos((prevProductos) =>
      prevProductos.map(p => (p.id === id ? { ...p, productoObj, text: productoObj ? productoObj.name : '' } : p))
    );
    setErrors((prevErrors) => ({ ...prevErrors, [id]: { ...prevErrors[id], producto: '' } }));
  }, []);

  // Manejar cambios en el precio del producto
  const handlePriceChange = useCallback((id, precio) => {
    setProductos((prevProductos) =>
      prevProductos.map(p => (p.id === id ? { ...p, precio: precio === '' ? '' : parseFloat(precio) } : p))
    );
    setErrors((prevErrors) => ({ ...prevErrors, [id]: { ...prevErrors[id], precio: '' } }));
  }, []);

  // Manejar cambios en la cantidad del producto
  const handleCantidadChange = useCallback((id, cantidad) => {
    setProductos((prevProductos) =>
      prevProductos.map(p => (p.id === id ? { ...p, cantidad: cantidad === '' ? '' : parseInt(cantidad) } : p))
    );
    setErrors((prevErrors) => ({ ...prevErrors, [id]: { ...prevErrors[id], cantidad: '' } }));
  }, []);

  // Manejar cambios en la unidad del producto
  const handleUnidadChange = useCallback((id, unidad) => {
    setProductos((prevProductos) =>
      prevProductos.map(p => (p.id === id ? { ...p, unidad } : p))
    );
    setErrors((prevErrors) => ({ ...prevErrors, [id]: { ...prevErrors[id], unidad: '' } }));
  }, []);

  // Agregar un nuevo producto
  const addProduct = () => {
    setProductos([...productos, { id: Date.now(), text: '', precio: '', cantidad: '', unidad: '', productoObj: null }]);
  };

  // Solicitar confirmación antes de eliminar un producto
  const requestRemoveProduct = (id) => {
    setProductToRemove(id);
    setShowConfirm(true);
  };

  // Confirmar eliminación del producto
  const confirmRemoveProduct = () => {
    setProductos(productos.filter(p => p.id !== productToRemove));
    setShowConfirm(false);
    setProductToRemove(null);
  };

  // Cancelar eliminación del producto
  const cancelRemoveProduct = () => {
    setShowConfirm(false);
    setProductToRemove(null);
  };

  const clearAll = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todos los productos?')) {
      setProductos([{ id: Date.now(), text: '', precio: '', cantidad: '', unidad: '', productoObj: null }]);
      setErrors({});
    }
  };


  useEffect(() => {
    const newTotal = productos.reduce((acc, producto) => {
      const precio = parseFloat(producto.precio) || 0;
      const cantidad = parseInt(producto.cantidad) || 0;
      return acc + precio;
      //return acc + (precio * cantidad);

    }, 0);
    setTotal(newTotal);
  }, [productos]);

  // Validar los campos antes de enviar
  const validate = () => {
    let valid = true;
    let newErrors = {};

    // Validar fecha
    if (!fecha) {
      valid = false;
      setFechaError('La fecha es requerida.');
    } else {
      setFechaError('');
    }

    // Validar proveedor
    if (proveedor.length === 0) {
      valid = false;
      setProveedorError('El proveedor es requerido.');
    } else {
      setProveedorError('');
    }

    // Validar productos
    // productos.forEach(producto => {
    //   if (!producto.text.trim()) {
    //     valid = false;
    //     newErrors[producto.id] = { ...newErrors[producto.id], text: 'El nombre del producto es requerido.' };
    //   }
    //   if (producto.precio === '' || isNaN(producto.precio) || producto.precio <= 0) {
    //     valid = false;
    //     newErrors[producto.id] = { ...newErrors[producto.id], precio: 'El precio debe ser un número positivo.' };
    //   }
    //   if (!producto.productoObj) {
    //     valid = false;
    //     newErrors[producto.id] = { ...newErrors[producto.id], producto: 'Selecciona un producto válido.' };
    //   }
    //   if (producto.cantidad === '' || isNaN(producto.cantidad) || producto.cantidad <= 0) {
    //     valid = false;
    //     newErrors[producto.id] = { ...newErrors[producto.id], cantidad: 'La cantidad debe ser un número positivo.' };
    //   }
    //   if (!producto.unidad) {
    //     valid = false;
    //     newErrors[producto.id] = { ...newErrors[producto.id], unidad: 'Selecciona una unidad válida.' };
    //   }
    // });

    setErrors(newErrors);
    return valid;
  };


  const handleSubmit = async (e) => {
    console.log(descripcion)
    e.preventDefault();    
    if (validate()) {
      const compra = {
        purchase_date:fecha,
        // supplier: proveedor[0].id,
        supplier: 1,  // Asumiendo que solo se selecciona un proveedor
        desctription:descripcion,
        total:total,
        is_active:true,
        payment_methon: 1,
        purchase_details: productos.map(p => ({
          // article: p.productoObj.id, // Incluye el objeto completo del producto
          article: 1,
          quantity: p.cantidad,
          // measurment_unit: p.unidad,
          measurment_unit:2,
          unit_price: p.precio,
          subtotal: 1
        }))
      };

      try {
        const response = await fetchWithToken('purchases/', compra, 'POST'); // Llamar a fetchWithToken
        console.log(response)
        alert('Compra guardada exitosamente.');
        // Redireccionar a la lista de compras después de guardar
        navigate('/purchases-list');
      } catch (error) {
        console.error('Error al guardar la compra:', error);
        alert('Hubo un problema al guardar la compra. Por favor, inténtalo nuevamente.');
      }
    } else {
      alert('Por favor, corrige los errores en el formulario.');
    }
  };
  return (
    <React.Fragment>
      <Card.Body>
        <div className="form-container">
          <h1>Agregar Compra</h1>
          <form onSubmit={handleSubmit}>
            {/* Campos estáticos para Fecha, Proveedor y Descripción */}
            <div className="static-fields">
              <div className="left-column">
                <div className="campo">
                  <label htmlFor="proveedor">Proveedor</label>
                  <Typeahead
                    id="proveedor-typeahead"
                    labelKey="name"
                    onChange={(selected) => setProveedor(selected)}
                    onInputChange={handleProviderInputChange}
                    options={providerOptions}
                    placeholder="Escribe el proveedor"
                    selected={proveedor}
                    isLoading={isLoadingProviders}
                    minLength={1}
                    clearButton
                  />
                  {proveedorError && <span className="error">{proveedorError}</span>}
                </div>
                <div className="campo">
                  <label htmlFor="fecha">Fecha</label>
                  <input
                    type="date"
                    id="fecha"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                  {fechaError && <span className="error">{fechaError}</span>}
                </div>
              </div>
              <div className="right-column">
                <div className="campo">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción de la compra"
                  />
                  {descripcionError && <span className="error">{descripcionError}</span>}
                </div>
              </div>
            </div>

            {/* Lista de productos */}
            {productos.map((producto) => (
              <div key={producto.id} className="producto-container">
                <ProductItem
                  producto={producto}
                  onChangeProducto={handleProductoChange}
                  onChangePrecio={handlePriceChange}
                  onChangeCantidad={handleCantidadChange}
                  onChangeUnidad={handleUnidadChange}
                  onRemove={requestRemoveProduct}
                  productOptions={productOptions}
                  isLoadingProducts={isLoadingProducts}
                  onProductInputChange={handleProductInputChange}
                />
                {errors[producto.id] && (
                  <div className="error-messages">
                    {errors[producto.id].text && <span className="error">{errors[producto.id].text}</span>}
                    {errors[producto.id].precio && <span className="error">{errors[producto.id].precio}</span>}
                    {errors[producto.id].cantidad && <span className="error">{errors[producto.id].cantidad}</span>}
                    {errors[producto.id].unidad && <span className="error">{errors[producto.id].unidad}</span>}
                    {errors[producto.id].producto && <span className="error">{errors[producto.id].producto}</span>}
                  </div>
                )}
              </div>
            ))}

            {/* Total */}
            <div className="total-container">
              <h3>Total: ${total.toFixed(2)}</h3>
            </div>

            {/* Botones del formulario */}
            <div className="buttons-group">
              <button type="button" className="agregar-producto" onClick={addProduct}>Agregar Producto</button>
              <button type="button" className="clear-all" onClick={clearAll}>Limpiar Todo</button>
              <button type="submit" className="submit-button">Guardar</button>
            </div>
          </form>
        </div>
      </Card.Body>

      {/* Modal de confirmación para eliminar un producto */}
      <Modal show={showConfirm} onHide={cancelRemoveProduct}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este producto?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelRemoveProduct}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmRemoveProduct}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default Purchases;

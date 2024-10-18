// src/views/purchases/PurchaseDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { fetchWithToken } from '../../api/fetchHelpers';

const PurchaseDetailsModal = ({ show, handleClose, purchase, onUpdate }) => {
  const [fecha, setFecha] = useState('');
  const [proveedor, setProveedor] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);

  const [providerOptions, setProviderOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [errors, setErrors] = useState({});

  // Estado para manejar la edición de productos
  const [editingProductos, setEditingProductos] = useState([]);

  useEffect(() => {
    if (purchase) {
      setFecha(purchase.date);
      setProveedor([purchase.supplier.name]);
      setDescripcion(purchase.description);
      setProductos(purchase.purchase_details);
      setTotal(purchase.total);
      setEditingProductos(purchase.purchase_details.map(p => ({ ...p, tempId: Date.now() + Math.random() })));
    }
  }, [purchase]);

  // Calcular el total cada vez que cambian los productos
  useEffect(() => {
    const newTotal = productos.reduce((acc, producto) => {
      const precio = parseFloat(producto.precio) || 0;
      return acc + precio;
    }, 0);
    setTotal(newTotal);
  }, [productos]);


  const searchProviders = async (query) => {
    if (!query) {
      setProviderOptions([]);
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
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  // Función para buscar productos  

  const searchProducts = async (query) => {
    if (!query) {
      setProductOptions([]);
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
      console.error('Error fetching products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };


  // Manejar cambios en el proveedor con debounce
  const handleProviderInputChange = (query) => {
    // Implementar debounce si es necesario
    searchProviders(query);
  };

  // Manejar cambios en el producto con debounce
  const handleProductInputChange = (query) => {
    // Implementar debounce si es necesario
    searchProducts(query);
  };

  // Manejar cambios en los campos de la compra
  const handleProductChange = (index, field, value) => {
    const updatedProductos = [...productos];
    if (field === 'producto') { // Ajustado aquí
      updatedProductos[index].producto = value;
      updatedProductos[index].text = value ? value.name : '';
    } else {
      updatedProductos[index][field] = value;
    }
    setProductos(updatedProductos);
  };

  // Agregar un nuevo producto
  const addProduct = () => {
    setProductos([...productos, { producto: null, cantidad: 1, unidad: '', precio: 0 }]);
  };

  // Eliminar un producto
  const removeProduct = (index) => {
    const updatedProductos = [...productos];
    updatedProductos.splice(index, 1);
    setProductos(updatedProductos);
  };

  // Validar los campos antes de guardar
  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!fecha) {
      valid = false;
      newErrors.fecha = 'La fecha es requerida.';
    }

    if (proveedor.length === 0) {
      valid = false;
      newErrors.proveedor = 'El proveedor es requerido.';
    }


    setErrors(newErrors);
    return valid;
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    if (!validate()) {
      alert('Por favor, corrige los errores en el formulario.');
      return;
    }

    const updatedPurchase = {
      fecha,
      proveedor: proveedor[0], // Asumiendo que solo se selecciona un proveedor
      descripcion,
      total,
      productos: productos.map(p => ({
        producto: p.productoObj, // Incluye el objeto completo del producto
        cantidad: p.cantidad,
        unidad: p.unidad,
        precio: p.precio,
      })),
    };

    try {
      const response = await fetchWithToken(`purchases/${purchase.id}`, updatedPurchase, 'PUT');
      alert('Compra actualizada exitosamente.');

      // Notificar al componente padre para actualizar la lista
      if (onUpdate) {
        onUpdate(response);
      }

      handleClose();
    } catch (error) {
      console.error('Error al actualizar la compra:', error);
      alert('Hubo un problema al actualizar la compra. Por favor, inténtalo nuevamente.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Editar Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Fecha */}
          <Form.Group className="mb-3" controlId="formFecha">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              isInvalid={!!errors.fecha}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fecha}
            </Form.Control.Feedback>
          </Form.Group>
          {/* Proveedor */}
          <Form.Group className="mb-3" controlId="formProveedor">
            <Form.Label>Proveedor</Form.Label>
            <Typeahead
              id="proveedor-typeahead-modal"
              labelKey="name"
              onChange={(selected) => setProveedor(selected)}
              onInputChange={handleProviderInputChange}
              options={providerOptions}
              placeholder="Escribe el proveedor"
              selected={proveedor}
              isLoading={isLoadingProviders}
              minLength={1}
              clearButton
              renderMenuItemChildren={(option) => <span>{option.name}</span>}
            />
            {errors.proveedor && <div className="text-danger">{errors.proveedor}</div>}
          </Form.Group>
          {/* Descripción */}
          <Form.Group className="mb-3" controlId="formDescripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              isInvalid={!!errors.descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {errors.descripcion}
            </Form.Control.Feedback>
          </Form.Group>
          {/* Productos */}
          <Form.Label>Productos</Form.Label>
          {productos.map((producto, index) => (
            <div key={index} className="mb-3 p-3 border rounded">
              {/* Producto */}
              <Form.Group className="mb-3" controlId={`formProducto_${index}`}>
                <Form.Label>Producto</Form.Label>
                <Typeahead
                  id={`producto-typeahead-modal-${index}`}
                  labelKey="name"
                  onChange={(selected) => handleProductChange(index, 'producto', selected[0] || null)}
                  onInputChange={handleProductInputChange}
                  options={productOptions}
                  placeholder="Selecciona o escribe el producto"
                  selected={producto.producto ? [producto.producto] : []} // Ajustado aquí
                  isLoading={isLoadingProducts}
                  minLength={1}
                  clearButton
                  renderMenuItemChildren={(option) => <span>{option.name}</span>}
                />
                {errors[`producto_${index}`] && <div className="text-danger">{errors[`producto_${index}`]}</div>}
              </Form.Group>
              <div className="d-flex gap-3">
                {/* Cantidad */}
                <Form.Group className="mb-3 flex-fill" controlId={`formCantidad_${index}`}>
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={producto.cantidad}
                    onChange={(e) => handleProductChange(index, 'cantidad', e.target.value)}
                    isInvalid={!!errors[`cantidad_${index}`]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`cantidad_${index}`]}
                  </Form.Control.Feedback>
                </Form.Group>
                {/* Unidad */}
                <Form.Group className="mb-3 flex-fill" controlId={`formUnidad_${index}`}>
                  <Form.Label>Unidad</Form.Label>
                  <Form.Select
                    value={producto.unidad}
                    onChange={(e) => handleProductChange(index, 'unidad', e.target.value)}
                    isInvalid={!!errors[`unidad_${index}`]}
                  >
                    <option value="">Selecciona unidad</option>
                    <option value="Unidades">Unidades</option>
                    <option value="Gramos">Gramos</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors[`unidad_${index}`]}
                  </Form.Control.Feedback>
                </Form.Group>
                {/* Precio */}
                <Form.Group className="mb-3 flex-fill" controlId={`formPrecio_${index}`}>
                  <Form.Label>Precio ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={producto.precio}
                    onChange={(e) => handleProductChange(index, 'precio', e.target.value)}
                    isInvalid={!!errors[`precio_${index}`]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`precio_${index}`]}
                  </Form.Control.Feedback>
                </Form.Group>
                {/* Botón para eliminar producto */}
                <div className="d-flex align-items-end">
                  <Button variant="danger" onClick={() => removeProduct(index)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Botón para agregar producto */}
          <Button variant="secondary" onClick={addProduct}>
            Agregar Producto
          </Button>
          {/* Total */}
          <div className="mt-4">
            <h5>Total: ${total.toFixed(2)}</h5>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PurchaseDetailsModal;

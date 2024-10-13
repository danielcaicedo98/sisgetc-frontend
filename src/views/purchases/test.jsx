// src/views/purchases/PurchaseDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form, Spinner } from 'react-bootstrap';

const PurchaseDetailsModal = ({ show, handleClose, purchase, onUpdate }) => {
  // Estado para manejar el modo (vista o edición)
  const [isEditing, setIsEditing] = useState(false);

  // Estados para los campos editables
  const [fecha, setFecha] = useState('');
  const [proveedor, setProveedor] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);

  // Estados de sugerencias para proveedores y productos
  const [providerOptions, setProviderOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  // Estados para manejar el loading de las sugerencias
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Estados para manejar errores
  const [errors, setErrors] = useState({});

  // Inicializar los campos cuando el modal se abre
  useEffect(() => {
    if (purchase) {
      setFecha(purchase.fecha);
      setProveedor([purchase.proveedor]);
      setDescripcion(purchase.descripcion);
      setProductos(purchase.productos.map((p, index) => ({
        id: index, // Usar el índice como ID temporal
        producto: p.producto,
        cantidad: p.cantidad,
        unidad: p.unidad,
        precio: p.precio,
      })));
      setTotal(purchase.total);
      setIsEditing(false);
      setErrors({});
    }
  }, [purchase]);

  // Funciones para manejar cambios en los campos editables
  const handleProductChange = (index, field, value) => {
    const updatedProductos = [...productos];
    updatedProductos[index][field] = value;
    setProductos(updatedProductos);

    // Recalcular el total
    const newTotal = updatedProductos.reduce((acc, p) => acc + (parseFloat(p.precio) || 0) * (parseInt(p.cantidad) || 0), 0);
    setTotal(newTotal);
  };

  // Función para añadir un nuevo producto
  const addProduct = () => {
    setProductos([...productos, { id: productos.length, producto: {}, cantidad: 1, unidad: '', precio: 0 }]);
  };

  // Función para eliminar un producto
  const removeProduct = (index) => {
    const updatedProductos = productos.filter((_, i) => i !== index);
    setProductos(updatedProductos);

    // Recalcular el total
    const newTotal = updatedProductos.reduce((acc, p) => acc + (parseFloat(p.precio) || 0) * (parseInt(p.cantidad) || 0), 0);
    setTotal(newTotal);
  };

  // Función para manejar la actualización de la compra
  const handleSave = async () => {
    // Validaciones básicas
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

    if (!descripcion.trim()) {
      valid = false;
      newErrors.descripcion = 'La descripción es requerida.';
    }

    productos.forEach((p, index) => {
      if (!p.producto || !p.producto.name) {
        valid = false;
        newErrors[`producto_${index}`] = 'Selecciona un producto válido.';
      }
      if (!p.cantidad || p.cantidad <= 0) {
        valid = false;
        newErrors[`cantidad_${index}`] = 'La cantidad debe ser un número positivo.';
      }
      if (!p.unidad) {
        valid = false;
        newErrors[`unidad_${index}`] = 'Selecciona una unidad.';
      }
      if (!p.precio || p.precio <= 0) {
        valid = false;
        newErrors[`precio_${index}`] = 'El precio debe ser un número positivo.';
      }
    });

    setErrors(newErrors);

    if (!valid) {
      return;
    }

    // Construir el objeto de compra actualizado
    const updatedPurchase = {
      id: purchase.id,
      fecha,
      proveedor: proveedor[0],
      descripcion,
      total,
      productos: productos.map(p => ({
        producto: p.producto,
        cantidad: p.cantidad,
        unidad: p.unidad,
        precio: p.precio,
      })),
    };

    try {
      const response = await fetch(`http://localhost:5000/purchases/${purchase.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPurchase),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Compra actualizada:', data);
      alert('Compra actualizada exitosamente.');

      // Notificar al componente padre que se actualizó la compra
      if (onUpdate) {
        onUpdate(data);
      }

      // Cerrar el modal
      handleClose();
    } catch (error) {
      console.error('Error al actualizar la compra:', error);
      alert('Hubo un problema al actualizar la compra. Por favor, inténtalo nuevamente.');
    }
  };

  // Función para buscar proveedores (autocomplete)
  const searchProviders = (query) => {
    if (!query) {
      setProviderOptions([]);
      return;
    }

    setIsLoadingProviders(true);

    fetch(`http://localhost:5000/providers?name_like=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        setProviderOptions(data);
        setIsLoadingProviders(false);
      })
      .catch(error => {
        console.error('Error fetching providers:', error);
        setIsLoadingProviders(false);
      });
  };

  // Función para buscar productos (autocomplete)
  const searchProducts = (query) => {
    if (!query) {
      setProductOptions([]);
      return;
    }

    setIsLoadingProducts(true);

    fetch(`http://localhost:5000/products?name_like=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        setProductOptions(data);
        setIsLoadingProducts(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setIsLoadingProducts(false);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Compra' : 'Detalles de la Compra'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isEditing ? (
          // Modo de Vista
          <>
            <p><strong>Fecha:</strong> {new Date(fecha).toLocaleDateString()}</p>
            <p><strong>Proveedor:</strong> {proveedor[0]?.name}</p>
            <p><strong>Descripción:</strong> {descripcion}</p>
            <p><strong>Total:</strong> ${total.toFixed(2)}</p>

            <h5>Productos:</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Precio ($)</th>
                  <th>Subtotal ($)</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p, index) => (
                  <tr key={index}>
                    <td>{p.producto.name}</td>
                    <td>{p.cantidad}</td>
                    <td>{p.unidad}</td>
                    <td>{p.precio.toFixed(2)}</td>
                    <td>{(p.cantidad * p.precio).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : (
          // Modo de Edición
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
                onInputChange={searchProviders}
                options={providerOptions}
                placeholder="Selecciona o escribe el proveedor"
                selected={proveedor}
                isLoading={isLoadingProviders}
                minLength={1}
                clearButton
                renderMenuItemChildren={(option) => (
                  <div>
                    {option.name}
                  </div>
                )}
              />
              {errors.proveedor && <div className="text-danger mt-1">{errors.proveedor}</div>}
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
            <h5>Productos</h5>
            {productos.map((p, index) => (
              <div key={index} className="mb-3 border p-3 rounded">
                {/* Producto */}
                <Form.Group className="mb-3" controlId={`formProducto_${index}`}>
                  <Form.Label>Producto</Form.Label>
                  <Typeahead
                    id={`producto-typeahead-modal-${index}`}
                    labelKey="name"
                    onChange={(selected) => handleProductChange(index, 'producto', selected[0] || {})}
                    onInputChange={searchProducts}
                    options={productOptions}
                    placeholder="Selecciona o escribe el producto"
                    selected={p.producto && p.producto.name ? [p.producto] : []}
                    isLoading={isLoadingProducts}
                    minLength={1}
                    clearButton
                    renderMenuItemChildren={(option) => (
                      <div>
                        {option.name}
                      </div>
                    )}
                  />
                  {errors[`producto_${index}`] && <div className="text-danger mt-1">{errors[`producto_${index}`]}</div>}
                </Form.Group>

                {/* Cantidad */}
                <Form.Group className="mb-3" controlId={`formCantidad_${index}`}>
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={p.cantidad}
                    onChange={(e) => handleProductChange(index, 'cantidad', e.target.value)}
                    isInvalid={!!errors[`cantidad_${index}`]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`cantidad_${index}`]}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Unidad */}
                <Form.Group className="mb-3" controlId={`formUnidad_${index}`}>
                  <Form.Label>Unidad</Form.Label>
                  <Form.Select
                    value={p.unidad}
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
                <Form.Group className="mb-3" controlId={`formPrecio_${index}`}>
                  <Form.Label>Precio ($)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={p.precio}
                    onChange={(e) => handleProductChange(index, 'precio', e.target.value)}
                    isInvalid={!!errors[`precio_${index}`]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`precio_${index}`]}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Botón para eliminar producto */}
                <Button variant="danger" size="sm" onClick={() => removeProduct(index)}>
                  Eliminar Producto
                </Button>
              </div>
            ))}

            {/* Botón para agregar un nuevo producto */}
            <Button variant="secondary" onClick={addProduct}>
              Agregar Producto
            </Button>
          </Form>
)}</Modal.Body>
      <Modal.Footer>
        {!isEditing ? (
          <>
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
          </>
        ) : (
          <>
            <Button variant="success" onClick={handleSave}>
              Guardar Cambios
            </Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PurchaseDetailsModal;

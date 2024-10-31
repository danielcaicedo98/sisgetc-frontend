
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { fetchWithToken } from '../../api/fetchHelpers';
import '../../assets/scss/purchases/PurchaseDetailsModal.scss';

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

  useEffect(() => {

    if (purchase) {
      console.log(purchase)
      setFecha(purchase.purchase_date); // Asegúrate de que sea `purchase_date`
      setProveedor([purchase.supplier]); // Cambiar a `supplier`
      setDescripcion(purchase.description || ''); // Manejar descripción nula
      setProductos(purchase.purchase_details); // Cambiar a `purchase_details`
      setTotal(purchase.total);
    }
  }, [purchase]);

  // Calcular el total cada vez que cambian los productos
  useEffect(() => {
    const newTotal = productos.reduce((acc, producto) => {
      const precio = parseFloat(producto.unit_price) * producto.quantity; // Ajustar según datos
      return acc + precio;
    }, 0);
    setTotal(newTotal);
  }, [productos]);

  const searchProviders = async (query) => {
    // Lógica para buscar proveedores
  };

  const searchProducts = async (query) => {
    // Lógica para buscar productos
  };

  const handleProviderInputChange = (query) => {
    searchProviders(query);
  };

  const handleProductInputChange = (query) => {
    searchProducts(query);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProductos = [...productos];
    if (field === 'producto') {
      updatedProductos[index].article = value; // Cambiar a `article`
      updatedProductos[index].text = value ? value.label : ''; // Asumir que `label` es el nombre
    } else {
      updatedProductos[index][field] = value;
    }
    setProductos(updatedProductos);
  };

  const addProduct = () => {
    setProductos([...productos, { article: null, quantity: 1, unit_price: 0, measurment_unit: { label: '' } }]);
  };

  const removeProduct = (index) => {
    const updatedProductos = [...productos];
    updatedProductos.splice(index, 1);
    setProductos(updatedProductos);
  };

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
    e.preventDefault();

    if (!validate()) {
      alert('Por favor, corrige los errores en el formulario.');
      return;
    }
    console.log(proveedor)

    const updatedPurchase = {
      purchase_date: fecha, // Cambiar a `purchase_date`
      supplier: proveedor[0].id, // Cambiar a `supplier`
      description: descripcion,
      total,
      purchase_details: productos.map(p => ({
        quantity: p.quantity,
        unit_price: p.unit_price,
        measurment_unit: "1",
        subtotal: p.quantity * p.unit_price,
        article: p.article.value
      })),
    };

    try {
      const response = await fetchWithToken(`purchases/${purchase.id}/`, updatedPurchase, 'PUT');
      alert('Compra actualizada exitosamente.');

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
    <Modal show={show} onHide={handleClose} size="lg" scrollable className="purchase-details-modal">
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
            />
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
                  labelKey="label"
                  onChange={(selected) => handleProductChange(index, 'producto', selected[0] || null)}
                  onInputChange={handleProductInputChange}
                  options={productOptions}
                  placeholder="Selecciona o escribe el producto"
                  selected={producto.article ? [producto.article] : []}
                  isLoading={isLoadingProducts}
                  minLength={1}
                  clearButton
                />
              </Form.Group>
              <div className="d-flex gap-3">
                {/* Cantidad */}
                <Form.Group className="mb-3 flex-fill" controlId={`formCantidad_${index}`}>
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={producto.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3 flex-fill" controlId={`formUnidad_${index}`}>
                  <Form.Label>Unidad</Form.Label>
                  <Form.Select
                    value={producto.measurment_unit.label}
                    onChange={(e) => handleProductChange(index, 'unidad', { label: e.target.value })}
                    isInvalid={!!errors[`unidad_${index}`]}
                  >
                    <option value="">Selecciona unidad</option>
                    <option value="Unidades">Unidades</option>
                    <option value="Gramos">Gramos</option>
                    <option value="Gramos">{"Kilo Gramo"}</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors[`unidad_${index}`]}
                  </Form.Control.Feedback>
                </Form.Group>
                {/* Precio */}
                <Form.Group className="mb-3 flex-fill" controlId={`formPrecio_${index}`}>
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={producto.unit_price}
                    onChange={(e) => handleProductChange(index, 'unit_price', e.target.value)}
                  />
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

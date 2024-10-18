// src/views/purchases/ProductItem.jsx
import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Form } from 'react-bootstrap';

const ProductItem = React.memo(({
    producto,
    onChangeProducto,
    onChangePrecio,
    onChangeCantidad,
    onChangeUnidad,
    onRemove,
    productOptions,
    isLoadingProducts,
    onProductInputChange
}) => {
    return (
        <div className="producto">
            {/* Cantidad */}
            <Form.Group className="mb-3 flex-fill" >
                <Form.Label>Producto</Form.Label>
                <Typeahead
                    id={`producto-${producto.id}`}
                    labelKey="name"
                    onChange={(selected) => onChangeProducto(producto.id, selected[0] || null)}
                    onInputChange={(text) => onProductInputChange(text, producto.id)}
                    options={productOptions}
                    placeholder="Escribe el producto"
                    selected={producto.productoObj ? [producto.productoObj] : []}
                    isLoading={isLoadingProducts}
                    minLength={1}
                    clearButton
                />
            </Form.Group>
            <Form.Group className="mb-3 flex-fill" >
                <Form.Label>Cantidad</Form.Label>
                <input
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => onChangeCantidad(producto.id, e.target.value)}
                    placeholder="Escribe la cantidad"
                />
            </Form.Group>
            <Form.Group className="mb-3 flex-fill" >
                <Form.Label>Unidad</Form.Label>
                <Form.Select
                    value={producto.unidad}
                    onChange={(e) => onChangeUnidad(producto.id, e.target.value)}
                >
                    <option value="">Selecciona unidad</option>
                    <option value="Unidades">Unidades</option>
                    <option value="Gramos">Libras</option>
                    <option value="Gramos">Kilos</option>
                    <option value="Gramos">Gramos</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3 flex-fill" >
                <Form.Label>Precio ($)</Form.Label>
                <input
                    type="number"
                    step="0.01"
                    value={producto.precio}
                    onChange={(e) => onChangePrecio(producto.id, e.target.value)}
                    placeholder="Escribe el precio"
                />
            </Form.Group>
            <button type="button" onClick={() => onRemove(producto.id)}>Eliminar</button>
        </div >
    );
});

export default ProductItem;

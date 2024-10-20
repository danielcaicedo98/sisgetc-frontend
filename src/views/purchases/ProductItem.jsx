import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Button, Form } from 'react-bootstrap';
import '../../assets/scss/purchases/PurchasesList.scss';

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
            <Form.Group className="mb-3 flex-fill">
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
            <Form.Group className="mb-3 flex-fill">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => onChangeCantidad(producto.id, e.target.value)}
                    placeholder="Escribe la cantidad"
                />
            </Form.Group>
            <Form.Group className="mb-3 flex-fill">
                <Form.Label>Unidad</Form.Label>
                <Form.Select
                    value={producto.unidad}
                    onChange={(e) => onChangeUnidad(producto.id, e.target.value)}
                >
                    <option value="">Selecciona unidad</option>
                    <option value="Unidades">Unidades</option>
                    <option value="Libras">Libras</option>
                    <option value="Kilos">Kilos</option>
                    <option value="Gramos">Gramos</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4 flex-fill">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                    type="number"
                    step="0.01"
                    value={producto.precio}
                    onChange={(e) => onChangePrecio(producto.id, e.target.value)}
                    placeholder="Escribe el precio"
                />
            </Form.Group>
            <Form.Group className="mb-3 flex-fill">
                <Form.Label>Subtotal</Form.Label>
                <h3>${producto.precio * producto.cantidad}</h3>
            </Form.Group>
            <Form.Group className="mb-3 flex-fill">
                <Button type="button" className="button-e" onClick={() => onRemove(producto.id)}>Eliminar</Button>
            </Form.Group>

        </div>
    );
});

export default ProductItem;

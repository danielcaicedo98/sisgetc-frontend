// src/views/purchases/ProductItem.jsx
import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

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
            <Typeahead
                id={`producto-${producto.id}`}
                labelKey="name"
                onChange={(selected) => onChangeProducto(producto.id, selected[0] || null)}
                onInputChange={(text) => onProductInputChange(text, producto.id)}
                options={productOptions}
                placeholder="Selecciona o escribe el producto"
                selected={producto.productoObj ? [producto.productoObj] : []}
                isLoading={isLoadingProducts}
                minLength={1}
                clearButton
            />
            <input
                type="number"
                value={producto.cantidad}
                onChange={(e) => onChangeCantidad(producto.id, e.target.value)}
                placeholder="Cantidad"
            />
            <select
                className="form-select"
                value={producto.unidad}
                onChange={(e) => onChangeUnidad(producto.id, e.target.value)}
            >
                <option value="Unidades">Unidades</option>
                <option value="Gramos">Gramos</option>
            </select>
            <input
                type="number"
                step="0.01"
                value={producto.precio}
                onChange={(e) => onChangePrecio(producto.id, e.target.value)}
                placeholder="Precio"
            />
            <button type="button" onClick={() => onRemove(producto.id)}>Eliminar</button>
        </div>
    );
});

export default ProductItem;

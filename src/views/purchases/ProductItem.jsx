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
            <div className="campo">
                <label htmlFor="proveedor">Producto</label>
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
            </div>
            <div className="campo">
                <label htmlFor="proveedor">Cantidad</label>
                <input
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => onChangeCantidad(producto.id, e.target.value)}
                    placeholder="Escribe la cantidad"
                />
            </div>
            <div className="campo">               
                <select
                    className="form-select"
                    value={producto.unidad}
                    onChange={(e) => onChangeUnidad(producto.id, e.target.value)}
                >
                    <option value="Unidades">Unidades</option>
                    <option value="Gramos">Gramos</option>
                </select>
            </div>
            <div className="campo">
                <label htmlFor="proveedor">Precio</label>
                <input
                    type="number"
                    step="0.01"
                    value={producto.precio}
                    onChange={(e) => onChangePrecio(producto.id, e.target.value)}
                    placeholder="Escribe el precio"
                />
            </div>
            <button type="button" onClick={() => onRemove(producto.id)}>Eliminar</button>
        </div>
    );
});

export default ProductItem;

import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Button, Form } from 'react-bootstrap';
import '../../assets/scss/purchases/PurchasesList.scss';
import { fetchWithToken } from 'api/fetchHelpers';

const ProductItem = (
    {
        producto,
        onChangeProducto,
        onChangePrecio,
        onChangeCantidad,
        onChangeUnidad,
        onRemove,
        productOptions,
        isLoadingProducts,
        onProductInputChange
    }
) => {

    // const [select_measurements, setSelectMeasurements] = useState([]);

    // useEffect(() => {
    //     fillMeasurement()
    // }, []);

    // const fillMeasurement = async () => {
    //     try {
    //         const res = await fetchWithToken(`/basics/measurement_units/`, null, 'GET');
    //         setSelectMeasurements(res); // Guardamos la respuesta en el estado
    //         console.log(res)
    //     } catch (error) {
    //         console.error('Error fetching measurements:', error);
    //     }
    // }
    const [select_measurements, setSelectMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fillMeasurement();
    }, []);

    const fillMeasurement = async () => {
        setLoading(true); // Indicamos que la carga está en proceso
        try {
            const res = await fetchWithToken('/basics/measurement_units/', null, 'GET');
            console.log(res)

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
                    {select_measurements.map(item => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}


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
};

export default ProductItem;

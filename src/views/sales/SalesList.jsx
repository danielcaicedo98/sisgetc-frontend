import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Form, Alert, Card, CardBody, CardHeader, CardFooter } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { fetchWithToken } from 'api/fetchHelpers';
import './sales.scss'

const PurchasesList = () => {
    const [purchases, setPurchases] = useState([]);
    const [editPurchase, setEditPurchase] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [providerOptions, setProviderOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [isLoadingProviders, setIsLoadingProviders] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [error, setError] = useState('');
    const [productos, setProductos] = useState([]);
    const [proveedor, setProveedor] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        fetchPurchases();
        fetchPaymentMethods();
    }, []);

    const fetchPurchases = async () => {
        try {
            const res = await fetchWithToken('sales/', null, 'GET'); // Ajusta la ruta
            console.log(res)

            // Usamos Promise.all para esperar a que todas las solicitudes de clientes se resuelvan

            const data = await Promise.all(res.map(async (sale) => {
                // Obtener el cliente asociado para cada venta

                const customerData = await fetchWithToken(`customers/${sale.customer}/`, null, 'GET');

                // Retornar el objeto de venta con el nombre del cliente
                return {
                    ...sale,
                    customer: {
                        name: customerData.name ? customerData.name : '',
                        id: customerData.id ? customerData.id : sale.customer,
                    }    // Cambiar "label" por "name" si el cliente tiene una propiedad 'name'
                };
            }));

            const dataP = await Promise.all(data.map(async (sale) => {
                // Para cada venta, mapeamos sus detalles
                const saleWithDetails = await Promise.all(sale.sale_details.map(async (details) => {
                    // Obtener el producto asociado para cada detalle de la venta
                    const detailData = await fetchWithToken(`products/${details.product}/`, null, 'GET');
                    console.log(detailData.name)
                    // Retornar el detalle actualizado con el nombre y id del producto
                    return {
                        ...details,
                        product: {
                            name: detailData.name ? detailData.name : "Producto Inactivo",
                            id: detailData.id ? detailData.id : details.product
                        }
                    };
                }));

                // Retornar la venta con sus detalles actualizados
                return {
                    ...sale,
                    sale_details: saleWithDetails
                };
            }));

            setPurchases(dataP);
        } catch (error) {
            console.error('Error fetching purchases:', error);
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const methods = await fetchWithToken('basics/payment_methods/', null, 'GET');
            setPaymentMethods(methods);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    };

    const searchProviders = async (query) => {
        if (!query) {
            setProviderOptions([]);
            console.log("no encontrado")
            return;
        }

        setIsLoadingProviders(true);

        try {
            // Llamar a fetchWithToken para obtener los proveedores filtrados por el nombre
            const res = await fetchWithToken(`/basics/customers/?name_like=${encodeURIComponent(query)}`, null, 'GET');
            const data = res.map(item => ({
                id: item.value,   // Cambiar "value" por "id"
                name: item.label  // Cambiar "label" por "name"
            }));

            setProviderOptions(data);
        } catch (error) {
            console.error('Error fetching providers:', error);
            setIsLoadingProviders(false);
        } finally {
            setIsLoadingProviders(false);
        }
    };

    const handleEditClick = (purchase) => {
        setPaymentMethod(purchase.payment_method)
        setEditPurchase(purchase);
        setProductos(purchase.sale_details)
        setProveedor([purchase.customer])
        setShowModal(true);
    };

    const handleSaveChanges = async () => {
        console.log(paymentMethod)
        try {
            const updatedPurchase = {
                ...editPurchase,
                customer: proveedor[0].id,
                sale_details: productos.map(p => ({
                    ...p,
                    product: p.product.id
                })),
                payment_method: paymentMethod.value
            };
            
            const response = await fetchWithToken(`sales/${editPurchase.id}/`, updatedPurchase, 'PUT');
            setShowModal(false);
            if (response.updated) {
                alert('Venta actualizada exitosamente.');
                window.location.reload();
            } else {
                alert(`Error en campos: ${Object.keys(response)}\nDescripción: ${Object.values(response).flat()[0]}`);
            }
            fetchPurchases();
        } catch (error) {
            console.error('Error updating purchase:', error);
            setError('Hubo un problema al guardar los cambios.');
        }
    };

    const handleDeletePurchase = async (id) => {
        alert('Se ha eliminado la venta')
        window.location.reload();
        try {
            await fetchWithToken(`sales/${id}/`, null, 'DELETE');
            fetchPurchases();
        } catch (error) {
            console.error('Error deleting purchase:', error);
        }
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod({
            value:e.target.value
        });
    };

    // Función para manejar cambios en los productos
    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...productos];
        updatedProducts[index][field] = value;
        setEditPurchase({
            ...editPurchase,
            sale_details: updatedProducts,
        });
    };

    // Agregar un nuevo producto
    const addNewProduct = () => {
        const newProduct = { product: null, quantity: 1, unit_value: 0 };
        setProductos([
            ...productos, newProduct
        ])
    };

    const removeProduct = (index) => {
        const updatedProductos = [...productos];
        updatedProductos.splice(index, 1);
        setProductos(updatedProductos);
    };

    const handleProviderInputChange = (query) => {
        searchProviders(query);
    };

    const searchProducts = async (query) => {
        if (!query) {
            setProductOptions([]);
            console.log("no encontrado")
            return;
        }

        setIsLoadingProducts(true);

        try {
            // Llamar a fetchWithToken para obtener los productos filtrados por el nombre
            const res = await fetchWithToken(`basics/products/?name_like=${encodeURIComponent(query)}`, null, 'GET');
            const data = res.map(item => ({
                id: item.value,   // Cambiar "value" por "id"
                name: item.label  // Cambiar "label" por "name"
            }));

            setProductOptions(data);
        } catch (error) {
            setIsLoadingProducts(false);
            console.error('Error fetching products:', error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const handleProductInputChange = (query) => {
        searchProducts(query);
    };

    return (
        <div className='container-historial-sales'>
            <h1 className="text-center">Lista de Ventas</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Método de Pago</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((purchase) => (
                        <tr key={purchase.id}>
                            <td>{purchase.id}</td>
                            <td>{purchase.customer.name}</td>
                            <td>${purchase.total}</td>
                            <td>{purchase.payment_method.label}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleEditClick(purchase)}>
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="ms-2"
                                    onClick={() => handleDeletePurchase(purchase.id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* Modal de Edición */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg"  // Tamaño de modal más grande
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="custom-modal">
                <Card >
                    <CardHeader closeButton >
                        <Modal.Title>Editar Compra</Modal.Title>
                    </CardHeader>
                    <CardBody >
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Cliente</Form.Label>
                                <Typeahead
                                    id="proveedor-typeahead-modal"
                                    labelKey="name"
                                    onChange={(selected) => setProveedor(selected)}
                                    onInputChange={handleProviderInputChange}
                                    options={providerOptions}
                                    placeholder="Escribe el cliente"
                                    selected={proveedor}
                                    isLoading={isLoadingProviders}
                                    minLength={1}
                                    clearButton
                                />
                            </Form.Group>
                            {/* Tabla para mostrar y editar productos */}
                            <Form.Group className="mb-3">
                                <Form.Label>Productos</Form.Label>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Valor Unitario</th>
                                            <th>Subtotal</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productos.map((detail, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Typeahead
                                                        id={`producto-typeahead-modal-${index}`}
                                                        labelKey="name"
                                                        onChange={(selected) => handleProductChange(index, 'product', selected[0] || null)}
                                                        onInputChange={handleProductInputChange}
                                                        options={productOptions}
                                                        selected={detail.product ? [detail.product] : []}
                                                        placeholder="Selecciona un producto"
                                                        isLoading={isLoadingProducts}
                                                        minLength={1}
                                                        clearButton
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        value={detail.quantity}
                                                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        value={detail.unit_value}
                                                        onChange={(e) => handleProductChange(index, 'unit_value', e.target.value)}
                                                    />
                                                </td>
                                                <td>{(detail.quantity * detail.unit_value).toFixed(2)}</td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => removeProduct(index)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Button variant="secondary" onClick={addNewProduct}>Agregar Producto</Button>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Método de Pago</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={paymentMethod?.value || ''}
                                    // onChange={(e) =>
                                    //     setEditPurchase({ ...editPurchase, payment_method: { value: e.target.value } })
                                    // }
                                    onChange={handlePaymentMethodChange}
                                >
                                    <option value="">Selecciona un método</option>
                                    {paymentMethods.map((method) => (
                                        <option key={method.value} value={method.value}>
                                            {method.label}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </CardBody>
                    <CardFooter>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Guardar Cambios
                        </Button>
                    </CardFooter>
                </Card>
            </Modal>
        </div>
    );
};

export default PurchasesList;

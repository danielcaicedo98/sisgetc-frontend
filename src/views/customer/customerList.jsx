import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Form, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/purchases/PurchasesList.scss';
import { fetchWithToken } from '../../api/fetchHelpers';

const customerList = () => {
    const [customers, setCustomers] = useState([
        { id: 1, name: 'Juan Pérez', email: 'juan.perez@mail.com' },
        { id: 2, name: 'Ana Gómez', email: 'ana.gomez@mail.com' },
        { id: 3, name: 'Carlos Rivera', email: 'carlos.rivera@mail.com' }
    ]);

    // Estado para los filtros
    const [filters, setFilters] = useState({
        month: '',
        customer: ''
    });

    const [select_identification, setSelecIdentification] = useState([]);
    const [select_city, setSelectCity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fillIdentification();
        fillCity();
    }, []);

    const fillIdentification = async () => {
        setLoading(true); // Indicamos que la carga está en proceso
        try {
            const res = await fetchWithToken('basics/identification_types/', null, 'GET');

            // Aquí suponemos que la respuesta es un array directo. Si es un objeto con una propiedad que contiene el array, ajusta esto.
            if (Array.isArray(res)) {
                setSelecIdentification(res); // Guardamos el array de unidades en el estado
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

    const fillCity = async () => {
        setLoading(true); // Indicamos que la carga está en proceso
        try {
            const res = await fetchWithToken('basics/cities/', null, 'GET');

            // Aquí suponemos que la respuesta es un array directo. Si es un objeto con una propiedad que contiene el array, ajusta esto.
            if (Array.isArray(res)) {
                setSelectCity(res); // Guardamos el array de unidades en el estado
            } else {
                // Si la respuesta es un objeto con una clave (ejemplo: { data: [...] })
                setSelectCity(res.data || []); // Ajusta según la estructura de la respuesta
            }

        } catch (error) {
            setError('Error fetching cities');

            console.error('Error fetching cities:', error);
        }
    };

    const fetchPurchases = async () => {
        
        try {
            const data = await fetchWithToken('customers/', null, 'GET');
            setCustomers(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching purchases:', error);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);

    // Función para abrir el modal y seleccionar el cliente actual
    const openModal = (customer) => {
        setCurrentCustomer(customer);
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCustomer(null);
    };    

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        // Si el campo es un select (y está manejando objetos con `value` y `label`),
        // debemos actualizar el estado con el valor completo, no solo el valor simple
        if (type === 'select-one') {
            setCurrentCustomer({
                ...currentCustomer,
                [name]: { value, label: e.target.selectedOptions[0].text } // Guardamos tanto `value` como `label`
            });
        } else {
            setCurrentCustomer({
                ...currentCustomer,
                [name]: value
            });
        }
    };

    const handleUpdateCustomer = (updatedCustomer) => {
        console.log(updatedCustomer)
        const updatedCustomers = customers.map(p => (p.id === updatedCustomer.id ? updatedCustomer : p));
        setCustomers(updatedCustomers);
    };

    // Función para manejar el envío del formulario en el modal
    const handleSubmit = async () => {

        const updateCustomer = {
            name: currentCustomer.name,
            identification_type: typeof currentCustomer.identification_type == "object" ? currentCustomer.identification_type.value : currentCustomer.identification_type,
            identification_number: currentCustomer.identification_number,
            cell_phone: currentCustomer.cell_phone,
            email: currentCustomer.email,
            birth_date: currentCustomer.birth_date,
            residential_address: currentCustomer.residential_address,
            is_active: currentCustomer.is_active,
            city: typeof currentCustomer.city == 'object' ? currentCustomer.city.value : currentCustomer.city
        }

        try {
            const response = await fetchWithToken(`customers/${currentCustomer.id}/`, updateCustomer, 'PUT');
            // 
            if (response.updated) {
                alert('Cliente actualizado exitosamente.');
                updateCustomer.id = currentCustomer.id
                handleUpdateCustomer(updateCustomer)
            } else {
                alert(`Error en campos: ${Object.keys(response)}\nDescripción: ${Object.values(response).flat()[0]}`);
            }

            closeModal();
        } catch (error) {
            console.error('Error al actualizar la compra:', error);
            // alert('Hubo un problema al actualizar la compra. Por favor, inténtalo nuevamente.');
        }
    };

    // Función para manejar los cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };
    
    const filteredCustomers = customers.filter((customer) => {
        const matchesMonth =
            filters.month === '' ||
            (customer.birth_date && new Date(customer.birth_date).getMonth() + 1 === parseInt(filters.month));
        const matchesCustomer =
            filters.customer === '' ||
            customer.name.toLowerCase().includes(filters.customer.toLowerCase()) ||
            customer.email.toLowerCase().includes(filters.customer.toLowerCase());

        return matchesMonth && matchesCustomer;
    });

    return (
        <div className="customer-list-container">
            <h2>Lista de Clientes</h2>
            {/* Filtros */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group controlId="filterMonth">
                        <Form.Label>Mes de Nacimiento:</Form.Label>
                        <Form.Control
                            as="select"
                            name="month"
                            value={filters.month}
                            onChange={handleFilterChange}
                        >
                            <option value="">Selecciona el mes</option>
                            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((month, index) => (
                                <option key={index} value={index + 1}>{month}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="filterProvider">
                        <Form.Label>Cliente:</Form.Label>
                        <Form.Control
                            type="text"
                            name="customer"
                            value={filters.customer}
                            onChange={handleFilterChange}
                            placeholder="Cliente"
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Fecha de nacimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.birth_date}</td>
                            <td>
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => openModal(customer)}
                                    className="me-2"
                                >
                                    Editar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* Modal para editar cliente */}
            {currentCustomer && (
                <Modal show={isModalOpen} onHide={closeModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Cliente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="formName">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={currentCustomer.name}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formIdentificationType">
                                        <Form.Label>Tipo de Identificación</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="identification_type"
                                            value={currentCustomer.identification_type.value || ''}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecciona</option>
                                            {select_identification.map(item => (
                                                <option key={item.value} value={item.value}>
                                                    {item.label}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="formIdentificationNumber">
                                        <Form.Label>Número de Identificación</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="identification_number"
                                            value={currentCustomer.identification_number || ''}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formCellPhone">
                                        <Form.Label>Teléfono Celular</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cell_phone"
                                            value={currentCustomer.cell_phone || ''}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Correo Electrónico</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={currentCustomer.email}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formBirthDate">
                                        <Form.Label>Fecha de Nacimiento</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="birth_date"
                                            value={currentCustomer.birth_date || ''}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group controlId="formResidentialAddress">
                                <Form.Label>Dirección Residencial</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="residential_address"
                                    value={currentCustomer.residential_address || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCityId">
                                <Form.Label>Ciudad</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="city"
                                    value={currentCustomer.city.value || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona la ciudad</option>
                                    {select_city.map(item => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formIsActive">
                                <Form.Label>Cliente Activo</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    name="is_active"
                                    checked={currentCustomer.is_active || false}
                                    onChange={(e) =>
                                        setCurrentCustomer({
                                            ...currentCustomer,
                                            is_active: e.target.checked,
                                        })
                                    }
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between mt-4">
                                <Button variant="secondary" onClick={closeModal}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={() => handleSubmit()}>
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default customerList;

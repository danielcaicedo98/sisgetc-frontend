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
        date: '',
        customer: ''
    });

    const fetchPurchases = async () => {
        // setLoading(true);

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

    // Función para manejar el cambio en los campos del modal
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentCustomer({
            ...currentCustomer,
            [name]: value,
        });
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

    return (
        <div className="customer-list-container">
            <h2>Lista de Clientes</h2>
            {/* Filtros */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group controlId="filterDate">
                        <Form.Label>Fecha:</Form.Label>
                        <Form.Control
                            type="date"
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                        />
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
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
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
                                            value={currentCustomer.identification_type || ''}
                                            onChange={handleChange}
                                        >
                                            <option value="CC">Cédula</option>
                                            <option value="TI">Tarjeta de Identidad</option>
                                            <option value="CE">Cédula de Extranjería</option>
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
                                    name="city_id"
                                    value={currentCustomer.city_id || ''}
                                    onChange={handleChange}
                                >
                                    <option value="1">Cali</option>
                                    <option value="2">Ciudad 2</option>
                                    <option value="3">Ciudad 3</option>
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

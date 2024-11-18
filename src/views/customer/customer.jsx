// src/views/purchases/Purchases.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../../assets/scss/purchases/Purchases.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithToken } from '../../api/fetchHelpers';

const Customer = () => {
    const [customer, setCustomer] = useState({
        name: '',
        identification_type: '',
        identification_number: '',
        cell_phone: '',
        email: '',
        birth_date: '',
        residential_address: '',
        city_id: '',
        is_active: false,
    });
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCustomer({
            ...customer,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Lógica para guardar el cliente
        const cliente = {
            name: customer.name,
            identification_type: customer.identification_type,
            identification_number: customer.identification_number,
            cell_phone: customer.cell_phone,
            email: customer.email,
            birth_date: customer.birth_date,
            residential_address: customer.residential_address,
            city: customer.city_id
        }
        try {
            const response = await fetchWithToken('customers/', cliente, 'POST'); // Llamar a fetchWithToken
            if (response.created) {
                alert('Cliente guardado exitosamente.');
                handleClear()
            } else {
                alert(`Error en campos: ${Object.keys(response)}\nDescripción: ${Object.values(response).flat()[0]}`);
            }
        } catch (error) {
            console.error('Error al guardar la compra:', error);
            alert('Hubo un problema al guardar la compra. Por favor, inténtalo nuevamente.');
        }
        // console.log(customer);
    };

    const handleClear = () => {
        setCustomer({
            name: '',
            identification_type: '',
            identification_number: '',
            cell_phone: '',
            email: '',
            birth_date: '',
            residential_address: '',
            city_id: '',
            is_active: false,
        });
    };
    return (
        <React.Fragment>
            <Card.Body>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <h2>Agregar Cliente</h2>
                        <div className="static-fields">
                            <div className="left-column">
                                <div className="campo">

                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={customer.name}
                                        onChange={handleChange}
                                        placeholder="Escribe el nombre"
                                    />

                                    <label>Tipo de Identificación</label>
                                    <select
                                        name="identification_type"
                                        value={customer.identification_type}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona el tipo</option>
                                        {select_identification.map(item => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>

                                    <label>Número de Identificación</label>
                                    <input
                                        type="text"
                                        name="identification_number"
                                        value={customer.identification_number}
                                        onChange={handleChange}
                                        placeholder="Escribe el número de identificación"
                                    />

                                    <label>Teléfono Celular</label>
                                    <input
                                        type="text"
                                        name="cell_phone"
                                        value={customer.cell_phone}
                                        onChange={handleChange}
                                        placeholder="Escribe el número de celular"
                                    />

                                    <label>Correo Electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={customer.email}
                                        onChange={handleChange}
                                        placeholder="Escribe el correo electrónico"
                                    />

                                    <label>Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        value={customer.birth_date}
                                        onChange={handleChange}
                                    />

                                    <label>Dirección Residencial</label>
                                    <input
                                        type="text"
                                        name="residential_address"
                                        value={customer.residential_address}
                                        onChange={handleChange}
                                        placeholder="Escribe la dirección residencial"
                                    />

                                    <label>Ciudad</label>
                                    <select
                                        name="city_id"
                                        value={customer.city_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona la ciudad</option>
                                        {select_city.map(item => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/*
                        <label className="switch-label">Cliente Activo</label>
                         <div className="switch-container">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={customer.is_active}
                                onChange={handleChange}
                                id="is_active"
                            />
                            <label htmlFor="is_active" className="switch"></label>
                        </div> */}
                        <div className="buttons-group">
                            <button type="button" className="clear-all" onClick={handleClear}>
                                Limpiar Todo
                            </button>
                            <button type="submit" className="submit-button">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </Card.Body>
        </React.Fragment>


    );
};

export default Customer;

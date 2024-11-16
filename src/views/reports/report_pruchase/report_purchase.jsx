import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import '../../../assets/scss/purchases/reportPurchase.scss';
import '../../../assets/scss/purchases/Purchases.scss';

const articles = [
    { article_id: '001', name: 'Artículo A', description: 'Descripción del Artículo A', supplier: 'Proveedor A' },
    { article_id: '002', name: 'Artículo B', description: 'Descripción del Artículo B', supplier: 'Proveedor B' },
    // Agrega más artículos según sea necesario
];

const PurchaseReport = () => {
    const [reportType, setReportType] = useState('');
    const [date, setDate] = useState('');
    const [reports, setReports] = useState([]);
    const [alert, setAlert] = useState('');

    const handleGenerateReport = () => {
        if (!reportType || !date) {
            setAlert('Por favor, selecciona el tipo de informe y la fecha.');
            return;
        }

        // Simula generación de informe con referencia a artículos
        const newReports = [
            { article_id: '001', quantity: 10, unit_value: 5.0, subtotal: 50.0 },
            { article_id: '002', quantity: 5, unit_value: 20.0, subtotal: 100.0 },
        ];
        setReports(newReports);
        setAlert('Informe generado correctamente.');
    };

    // Función para obtener detalles del artículo a partir de article_id
    const getArticleDetails = (article_id) => {
        return articles.find(article => article.article_id === article_id) || {};
    };

    return (

        <React.Fragment>
            <Card.Body>
                <div className="purchase-report">
                    <h2>Informe de Compras</h2>
                    <div className="filters">
                        <label>Fecha:</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                        <label>Tipo de Informe:</label>
                        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                            <option value="">Seleccionar</option>
                            <option value="daily">Diario</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensual</option>
                        </select>

                        <button onClick={handleGenerateReport}>Generar Informe</button>
                    </div>

                    {alert && <div className="alert">{alert}</div>}

                    {reports.length > 0 && (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Article ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Proveedor</th>
                                    <th>Cantidad</th>
                                    <th>Valor Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report, index) => {
                                    const articleDetails = getArticleDetails(report.article_id);
                                    return (
                                        <tr key={index}>
                                            <td>{report.article_id}</td>
                                            <td>{articleDetails.name}</td>
                                            <td>{articleDetails.description}</td>
                                            <td>{articleDetails.supplier}</td>
                                            <td>{report.quantity}</td>
                                            <td>{report.unit_value}</td>
                                            <td>{report.subtotal}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    <div className="export-buttons">
                        <button>Exportar a PDF</button>
                        <button>Exportar a Excel</button>
                    </div>
                </div>

            </Card.Body>
        </React.Fragment>
    );
};

export default PurchaseReport;
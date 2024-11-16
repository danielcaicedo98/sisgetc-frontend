// SalesReport.js
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import SalesTable from "./SalesTable"; // Tabla para mostrar los datos

const SalesReport = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [salesData, setSalesData] = useState([]); // Datos de ventas obtenidos de la API

    const handleGenerateReport = async () => {
        const isDailyReport = startDate === endDate;
        const data = isDailyReport
            ? [
                { id: 1, date: startDate, product: "Pan", quantity: 15, total: 3000 },
                { id: 2, date: startDate, product: "Torta", quantity: 5, total: 7500 },
            ]
            : [
                { id: 1, date: "2024-11-10", product: "Pan", quantity: 20, total: 5000 },
                { id: 2, date: "2024-11-11", product: "Torta", quantity: 10, total: 15000 },
            ];

        setSalesData(data);
    };

    const handleExportPDF = () => {
        console.log("Generando reporte en PDF...");
    };

    const handleExportCSV = () => {
        console.log("Generando reporte en CSV...");
    };

    return (
        <Container>
            <Card className="mt-4">
                <Card.Body>
                    <h2>Reporte de Ventas</h2>
                    <Form>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="startDate">
                                    <Form.Label>Fecha de inicio</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="endDate">
                                    <Form.Label>Fecha de fin</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button className="mb-3" variant="primary" onClick={handleGenerateReport}>
                            Generar Reporte
                        </Button>
                    </Form>


                    <SalesTable salesData={salesData} />
                    <div className="d-flex justify-content-center mt-3">
                        <Button variant="success" onClick={handleExportPDF} className="me-2">
                            Exportar a PDF
                        </Button>
                        <Button  variant="info" onClick={handleExportCSV}>
                            Exportar a CSV
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SalesReport;

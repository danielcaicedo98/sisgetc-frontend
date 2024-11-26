import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import PurchaseTable from "./PurchaseTable";

const articles = [
    { article_id: "1", name: "Artículo A", description: "Descripción del Artículo A", supplier: "Proveedor A" },
    { article_id: "2", name: "Artículo B", description: "Descripción del Artículo B", supplier: "Proveedor B" },
];

const PurchaseReport = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reports, setReports] = useState([]);
    const [alert, setAlert] = useState("");

    const handleGenerateReport = () => {
        if (!startDate || !endDate) {
            setAlert("Por favor, selecciona ambas fechas.");
            return;
        }

        const newReports = [
            { article_id: "1", quantity: 10, unit_value: 5.0, subtotal: 50.0 },
            { article_id: "2", quantity: 5, unit_value: 20.0, subtotal: 100.0 },
        ];

        setReports(newReports);
        setAlert("Informe generado correctamente.");
    };

    const handleExportPDF = () => {
        console.log("Generando reporte en PDF...");
    };

    const handleExportExcel = () => {
        console.log("Generando reporte en Excel...");
    };

    const getArticleDetails = (article_id) => {
        return articles.find((article) => article.article_id === article_id) || {};
    };

    return (
        <Container>
            <Card className="mt-4">
                <Card.Body>
                    <h2>Reporte de Compras</h2>
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
                        <Button variant="primary" onClick={handleGenerateReport}>
                            Generar Informe
                        </Button>
                    </Form>

                    {alert && <div className="alert alert-warning mt-3">{alert}</div>}

                    <PurchaseTable reports={reports} getArticleDetails={getArticleDetails} />

                    <div className="d-flex justify-content-center mt-3">
                        <Button variant="success" onClick={handleExportPDF} className="me-2">
                            Exportar a PDF
                        </Button>
                        <Button variant="info" onClick={handleExportExcel}>
                            Exportar a Excel
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PurchaseReport;

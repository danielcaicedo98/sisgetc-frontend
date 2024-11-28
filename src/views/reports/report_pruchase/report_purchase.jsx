import { fetchWithToken, fetchWithTokenBlob } from "api/fetchHelpers";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Table } from "react-bootstrap";

const articles = [
    { article_id: "001", name: "Artículo A", description: "Descripción del Artículo A", supplier: "Proveedor A" },
    { article_id: "002", name: "Artículo B", description: "Descripción del Artículo B", supplier: "Proveedor B" },
    // Agrega más artículos según sea necesario
];

const PurchaseReport = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reports, setReports] = useState([]);
    const [alert, setAlert] = useState("");

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            setAlert("Por favor, selecciona ambas fechas.");
            return;
        }

        // Simula generación de informe con referencia a artículos
        const res = await fetchWithToken(`reports/purchases/general/?start_date=${startDate}&end_date=${endDate}&type_report=GENERAL&response_format=JSON`, null, 'GET');
        console.log(res)
        const newReports = res.map(purchase => ({
            article_id: purchase.id,
            proveedor: purchase.proveedor,
            fecha: purchase.fecha,
            article: purchase.articulo,
            quantity: purchase.cantidad,
            subtotal: purchase.subtotal,

        }))

        setReports(newReports);
        setAlert("Informe generado correctamente.");
    };

    const handleExportPDF = () => {
        console.log("Generando reporte en PDF...");
    };

    const handleExportExcel = async () => {
        if (!startDate || !endDate) {
            setAlert("Por favor, selecciona ambas fechas.");
            return;
        }
        const downloadFile = (blob, filename) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            setAlert("Archivo descargado, revisa en tu dispositivo");
        }

        // Llamada a la función fetchWithToken
        const blob = await fetchWithTokenBlob(`reports/purchases/general/?start_date=${startDate}&end_date=${endDate}&type_report=GENERAL&response_format=EXCEL`, null, 'GET');

        // Luego, puedes usar la función de descarga si el archivo es un blob
        if (blob) {
            // alert('Se ha descargado el archivo, revisa las descargas de tu dispositivo')
            downloadFile(blob, 'reporte_general_de_compras_proveedores.xlsx');

        }
    };

    // Función para obtener detalles del artículo a partir de article_id
    const getArticleDetails = (article_id) => {
        return articles.find((article) => article.article_id === article_id) || {};
    };

    return (
        <Container>
            <Card className="mt-4">
                <Card.Body>
                    <h2>Informe de Compras</h2>
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
                        <Button
                            className="mb-3 me-3 "
                            variant="primary"
                            onClick={handleGenerateReport}
                        >
                            Generar Informe
                        </Button>
                        <Button
                            className="mb-3"
                            variant="info"
                            onClick={handleExportExcel}>
                            Exportar a Excel
                        </Button>
                    </Form>

                    {alert && <div className="alert alert-warning">{alert}</div>}

                    {reports.length > 0 && (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Fecha</th>
                                    <th>Proveedor</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report, index) => {
                                    const articleDetails = getArticleDetails(report.article_id);
                                    return (
                                        <tr key={index}>
                                            <td>{report.article_id}</td>
                                            <td>{report.article}</td>
                                            <td>{report.fecha}</td>
                                            <td>{report.proveedor}</td>
                                            <td>{report.quantity}</td>
                                            <td>{report.subtotal}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}

                    {/* <div className="d-flex justify-content-center mt-3">
                         <Button variant="success" onClick={handleExportPDF} className="me-2">
                            Exportar a PDF
                        </Button> 
                        
                    </div> */}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PurchaseReport;
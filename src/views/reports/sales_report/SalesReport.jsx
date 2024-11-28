// SalesReport.js
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import SalesTable from "./SalesTable"; // Tabla para mostrar los datos
import { fetchWithToken, fetchWithTokenBlob } from "api/fetchHelpers";

const SalesReport = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [salesData, setSalesData] = useState([]); // Datos de ventas obtenidos de la API

    const handleGenerateReport = async () => {
        if (!startDate) {
            alert('Por favor ingrese el rango de fechas')
        }
        const res = await fetchWithToken(`reports/sales/general/?start_date=${startDate}&end_date=${endDate}&type_report=GENERAL&response_format=JSON`, null, 'GET');
        if(res.detail){
            alert('No se ha encontrado ningun dato para estas fechas')
            return
        }
        const data = res.map(sale => ({
            id: sale.id,
            cliente: sale.cliente,
            date: sale.fecha,
            product: sale.producto,
            quantity: sale.cantidad,
            total: sale.subtotal
        }));

        setSalesData(data);
    };

    const handleExportPDF = () => {
        console.log("Generando reporte en PDF...");
    };

    const handleExportCSV = async () => {
        if (!startDate) {
            alert('Por favor ingrese el rango de fechas')
        }
        const downloadFile = (blob, filename) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }

        // Llamada a la función fetchWithToken
        const blob = await fetchWithTokenBlob(`reports/sales/general/?start_date=${startDate}&end_date=${endDate}&type_report=GENERAL&response_format=EXCEL`, null, 'GET');

        // Luego, puedes usar la función de descarga si el archivo es un blob
        if (blob) {
            alert('Se ha descargado el archivo, revisa las descargas de tu dispositivo')
            downloadFile(blob, 'reporte_general_de_ventas.xlsx');
        }
    };

    return (
        <Container>
            <Card className="mt-4">
                <Card.Body>
                    <h2>Informe de Ventas</h2>
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
                        <Button className="mb-3 me-3" variant="primary" onClick={handleGenerateReport}>
                            Generar Reporte
                        </Button>
                        <Button className="mb-3" variant="info" onClick={handleExportCSV}>
                            Exportar a Excel
                        </Button>
                    </Form>
                    <SalesTable salesData={salesData} />                   
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SalesReport;

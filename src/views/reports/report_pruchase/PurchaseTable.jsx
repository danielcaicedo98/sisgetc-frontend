import React from "react";
import { Table } from "react-bootstrap";

const PurchaseTable = ({ reports, getArticleDetails }) => {
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID Artículo</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Proveedor</th>
                        <th>Cantidad</th>
                        <th>Valor Unitario</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">No hay datos</td>
                        </tr>
                    ) : (
                        reports.map((report, index) => {
                            const { name, description, supplier } = getArticleDetails(report.article_id);
                            return (
                                <tr key={index}>
                                    <td>{report.article_id}</td>
                                    <td>{name || "N/A"}</td>
                                    <td>{description || "N/A"}</td>
                                    <td>{supplier || "N/A"}</td>
                                    <td>{report.quantity}</td>
                                    <td>{report.unit_value}</td>
                                    <td>{report.subtotal}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default PurchaseTable;

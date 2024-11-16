// SalesTable.js
import React from "react";
import { Table } from "react-bootstrap";

const SalesTable = ({ salesData }) => {
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {salesData.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No hay datos</td>
            </tr>
          ) : (
            salesData.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{sale.date}</td>
                <td>{sale.product}</td>
                <td>{sale.quantity}</td>
                <td>{sale.total}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SalesTable;

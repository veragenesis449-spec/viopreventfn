import React from "react";
import "../App.css";
import "../styles/Orientadores.css";

function DataTable({ title, data, columns }) {
  return (
    <div className="content-area">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>{title}</h1>

        <div>
          <button className="btn-agregar">+ Agregar</button>
          <button className="btn-eliminar">Eliminar</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col.toUpperCase()}</th>
            ))}
            <th>ACCIONES</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>{item[col]}</td>
                ))}
                <td>
                  <button className="btn-editar">Editar</button>
                  <button className="btn-eliminar-tabla">Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1}>No hay datos registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Gestion({ tipo, orientadores, responsables }) {
  switch (tipo) {
    case "Orientadores":
      return (
        <DataTable
          title="Gestión de Orientadores"
          data={orientadores}
          columns={["nombre", "correo", "telefono"]}
        />
      );

    case "Responsables":
      return (
        <DataTable
          title="Gestión de Responsables"
          data={responsables}
          columns={["nombre", "correo", "telefono"]}
        />
      );

    default:
      return <h2>Seleccione una opción válida</h2>;
  }
}

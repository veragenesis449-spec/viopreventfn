import React, { useEffect, useState } from 'react';
import '../styles/Respuestas.css';

function Respuestas() {
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost/VioPrevent/api/obtener_respuestas.php')
      .then(res => {
        if (!res.ok) throw new Error('Error en la respuesta de la API');
        return res.json();
      })
      .then(data => {
        setRespuestas(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando respuestas...</div>;
  if (error) return <div>Error: {error}</div>;

  // Agrupar por id_reporte para mostrar encabezado por cada reporte
  const agrupados = respuestas.reduce((acc, item) => {
    const id = item.id_reporte;
    if (!acc[id]) acc[id] = { meta: { id: item.id_reporte, iniciales: item.iniciales, grupo: item.grupo, edad: item.edad, genero: item.genero, gravedad: item.nivel_gravedad }, respuestas: [] };
    acc[id].respuestas.push({ id_respuesta: item.id_respuesta, pregunta: item.pregunta, respuesta: item.respuesta });
    return acc;
  }, {});

  const lista = Object.values(agrupados);

  return (
    <div className="respuestas-page">
      <h2>Respuestas registradas</h2>
      {lista.length === 0 && <div>No se encontraron respuestas.</div>}
      {lista.map(rep => (
        <div key={rep.meta.id} className="reporte-block">
          <h3>Reporte #{rep.meta.id} - {rep.meta.iniciales} (Grupo {rep.meta.grupo})</h3>
          <div>Edad: {rep.meta.edad} | Género: {rep.meta.genero} | Gravedad: {rep.meta.gravedad}</div>
          <table className="respuestas-table">
            <thead>
              <tr><th>Pregunta</th><th>Respuesta</th></tr>
            </thead>
            <tbody>
              {rep.respuestas.map(r => (
                <tr key={r.id_respuesta}>
                  <td data-label="Pregunta">{r.pregunta}</td>
                  <td data-label="Respuesta">{r.respuesta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default Respuestas;

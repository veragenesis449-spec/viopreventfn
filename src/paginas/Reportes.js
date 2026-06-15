import React, { useState } from 'react';
import '../styles/Reportes.css';
import '../App.css';

function Reportes() {
  const [salonSeleccionado, setSalonSeleccionado] = useState(null);
  const [openSemester, setOpenSemester] = useState(null);

  const semestres = [
    {
      nombre: 'Primer Semestre',
      matutino: ['101', '102', '103', '104', '105', '106'],
      vespertino: ['107', '108', '109', '110', '111', '112'],
    },
    {
      nombre: 'Tercer Semestre',
      matutino: ['301', '302', '303', '304', '305', '306'],
      vespertino: ['307', '308', '309', '310', '311', '312'],
    },
    {
      nombre: 'Quinto Semestre',
      matutino: ['501', '502', '503', '504', '505', '506'],
      vespertino: ['507', '508', '509', '510', '511', '512'],
    },
  ];

  const toggleSemester = (nombre) => {
    setOpenSemester(openSemester === nombre ? null : nombre);
  };

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h2>Gestión de Violencia Escolar</h2>
        <p className="reportes-subtitle">Plataforma para el registro y seguimiento de incidentes.</p>
      </div>

      {!salonSeleccionado ? (
        <>
          <div className="semestres-container">
            {semestres.map((semestre) => (
              <div
                key={semestre.nombre}
                className={`semestre-card ${openSemester === semestre.nombre ? 'selected' : ''}`}
              >
                <h3>{semestre.nombre}</h3>
                <button className="btn-toggle" onClick={() => toggleSemester(semestre.nombre)}>
                  {openSemester === semestre.nombre ? 'Ocultar salones' : 'Ver salones'}
                </button>
              </div>
            ))}
          </div>

          {openSemester ? (
            <div className="semestre-detail">
              {semestres
                .filter((semestre) => semestre.nombre === openSemester)
                .map((semestre) => (
                  <div key={semestre.nombre} className="semestre-detail-card">
                    <div className="semestre-detail-header">
                      <div>
                        <span className="badge">Semestre activo</span>
                        <h3>{semestre.nombre}</h3>
                      </div>
                      <button className="btn-toggle btn-toggle-secondary" onClick={() => toggleSemester(semestre.nombre)}>
                        Cerrar
                      </button>
                    </div>

                    <div className="turno-title">☀️ Turno Matutino</div>
                    <div className="salones-row">
                      {semestre.matutino.map((salon) => (
                        <div key={salon} className="salon-card">
                          <div className="salon-info">
                            <h4>Salón {salon}</h4>
                            <p>{semestre.nombre} • Matutino</p>
                          </div>
                          <button className="btn-acceder" onClick={() => setSalonSeleccionado(salon)}>
                            Acceder
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="turno-title">🌙 Turno Vespertino</div>
                    <div className="salones-row">
                      {semestre.vespertino.map((salon) => (
                        <div key={salon} className="salon-card">
                          <div className="salon-info">
                            <h4>Salón {salon}</h4>
                            <p>{semestre.nombre} • Vespertino</p>
                          </div>
                          <button className="btn-acceder" onClick={() => setSalonSeleccionado(salon)}>
                            Acceder
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="semestre-placeholder">Selecciona un semestre para ver sus salones.</div>
          )}
        </>
      ) : (
        <div className="salon-detail">
          <button className="btn-regresar" onClick={() => setSalonSeleccionado(null)}>
            ← Regresar
          </button>

          <div className="salon-banner">
            <h2>Salón {salonSeleccionado}</h2>
            <p>Sistema de Registro de Violencia Escolar</p>
          </div>

          <div className="alerta-violencia">⚠️ Registro confidencial de incidentes.</div>

          <div className="reporte-box">
            <h3>Registrar Incidente</h3>
            <div className="form-group">
              <label>Nombre del alumno</label>
              <input type="text" placeholder="Nombre del alumno" />
            </div>

            <div className="form-group">
              <label>Tipo de incidente</label>
              <select>
                <option>Violencia verbal</option>
                <option>Violencia física</option>
                <option>Acoso digital</option>
                <option>Discriminación</option>
                <option>Amenazas</option>
                <option>Daño a pertenencias</option>
                <option>Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea rows="6" placeholder="Describe detalladamente el incidente..."></textarea>
            </div>

            <button className="guardar-reporte">Guardar Reporte</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reportes;

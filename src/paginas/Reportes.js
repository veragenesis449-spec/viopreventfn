import React, { useState } from 'react';
import '../styles/Reportes.css';
import '../App.css';

function Reportes({ userRole = 'orientador' }) {
  const [salonSeleccionado, setSalonSeleccionado] = useState(null);
  const [openSemester, setOpenSemester] = useState(null);
  const [victima, setVictima] = useState('');
  const [victimario, setVictimario] = useState('');
  const [tipo, setTipo] = useState('Violencia verbal');
  const [descripcion, setDescripcion] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [victimasList, setVictimasList] = useState([]);
  const [loadingVictimas, setLoadingVictimas] = useState(false);

  // Cargar víctimas asociadas al salón seleccionado
  React.useEffect(() => {
    const loadVictimas = async () => {
      if (!salonSeleccionado) return;
      setLoadingVictimas(true);
      setVictimasList([]);
      try {
        // Enviamos el número de salón como 'grupo' (ej: 101)
        const grupoParam = encodeURIComponent(String(salonSeleccionado));
        const resp = await fetch(`http://localhost/VioPrevent/api/obtener_victimas.php?grupo=${grupoParam}`);
        if (!resp.ok) {
          setVictimasList([]);
          setLoadingVictimas(false);
          return;
        }
        const data = await resp.json();
        setVictimasList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando víctimas:', err);
        setVictimasList([]);
      } finally {
        setLoadingVictimas(false);
      }
    };

    loadVictimas();
  }, [salonSeleccionado]);

  // Función para guardar una víctima (orientador)
  const saveVictima = async () => {
    if (!victima || !tipo) {
      setSaveMessage('Completa el nombre de la víctima y el tipo.');
      return;
    }
    setLoadingSave(true);
    setSaveMessage(null);
    try {
      const payload = {
        victima: victima,
        victimario: victimario,
        tipo_violencia: tipo,
        descripcion: descripcion,
        grupo: salonSeleccionado
      };

      const resp = await fetch('http://localhost/VioPrevent/api/guardar_victima.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (data && data.ok) {
        setSaveMessage('Reporte guardado correctamente.');
        // Limpiar formulario
        setVictima('');
        setVictimario('');
        setTipo('Violencia verbal');
        setDescripcion('');
        // Refrescar lista de víctimas
        setSalonSeleccionado(salonSeleccionado); // trigger useEffect
      } else {
        setSaveMessage(data && data.error ? String(data.error) : 'Error al guardar.');
      }
    } catch (err) {
      console.error('Error guardando víctima:', err);
      setSaveMessage('Error de conexión al guardar.');
    } finally {
      setLoadingSave(false);
    }
  };

  const semestres = [
    {
      nombre: 'Primer Semestre',
      matutino: ['101', '102', '103', '104', '105', '106'],
      vespertino: ['107', '108', '109', '110', '111', '112'],
    },
    {
      nombre: 'Segundo Semestre',
      matutino: ['301', '302', '303', '304', '305', '306'],
      vespertino: ['307', '308', '309', '310', '311', '312'],
    },
    {
      nombre: 'Tercer Semestre',
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

          {/* Si el usuario es orientador mostramos el formulario para crear reportes y la lista */}
          {userRole === 'orientador' ? (
            <>
              <div className="orientador-form">
                <h4>Registrar reporte (Orientador)</h4>
                <label>Nombre víctima</label>
                <input value={victima} onChange={(e) => setVictima(e.target.value)} />
                <label>Nombre victimario</label>
                <input value={victimario} onChange={(e) => setVictimario(e.target.value)} />
                <label>Tipo de violencia</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option>Violencia verbal</option>
                  <option>Violencia física</option>
                  <option>Psicológica</option>
                  <option>Ciberacoso</option>
                </select>
                <label>Descripción</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                <div className="form-actions">
                  <button className="btn-primary" onClick={saveVictima} disabled={loadingSave}>
                    {loadingSave ? 'Guardando...' : 'Guardar reporte'}
                  </button>
                  <span className="save-message">{saveMessage}</span>
                </div>
              </div>

              <div className="victimas-section">
                <h4>Reportes registrados en este salón</h4>
                {loadingVictimas ? (
                  <div>Cargando reportes...</div>
                ) : (
                  <div className="victimas-list">
                    {victimasList.length === 0 ? (
                      <div>No hay reportes registrados por orientadores para este salón.</div>
                    ) : (
                      victimasList.map((v) => (
                        <div key={v.id_victima || v.id} className="victima-card">
                          <strong>{v.nombre || v.victima || 'Sin nombre'}</strong>
                          <div>Victimario: {v.victimario || v.victimario_nombre || '—'}</div>
                          <div>Tipo: {v.tipo_violencia || v.tipo || '—'}</div>
                          <div className="descripcion">{v.descripcion || v.detalle || ''}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Para directivos mostramos el panel de solo lectura (cards) */
            <div className="orientador-reports-panel">
              <p className="panel-desc">Panel de orientación — aquí puedes ver todos los reportes que han registrado los orientadores para este salón.</p>
              {loadingVictimas ? (
                <div>Cargando reportes...</div>
              ) : (
                <div className="reports-grid">
                  {victimasList.length === 0 ? (
                    <div className="no-reports">No hay reportes registrados por orientadores para este salón.</div>
                  ) : (
                    victimasList.map((v) => (
                      <article key={v.id_victima || v.id} className="report-card">
                        <header className="report-card-header">
                          <h3 className="report-victim">{v.nombre || v.victima || 'Sin nombre'}</h3>
                          <time className="report-time">{v.created_at || v.fecha || ''}</time>
                        </header>
                        <div className="report-body">
                          <p><strong>Victimario:</strong> {v.victimario || v.victimario_nombre || '—'}</p>
                          <p><strong>Tipo:</strong> {v.tipo_violencia || v.tipo || '—'}</p>
                          <p className="report-desc">{v.descripcion || v.detalle || ''}</p>
                        </div>
                        <footer className="report-card-footer">
                          <small>ID: {v.id_victima || v.id || '—'}</small>
                        </footer>
                      </article>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reportes;

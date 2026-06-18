import React, { useState } from 'react';
import '../styles/Alumnos.css';
import AddStudentModal from '../componentes/AddStudentModal'; // Importamos el modal

function Alumnos({ salones }) {
  // Base URL de la API: puede sobrescribirse con REACT_APP_API_URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost/VioPrevent/api';
  console.log('API_BASE:', API_BASE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Si no se pasa `salones` como prop, creamos los grupos por defecto
  const defaultSalones = [
    // Turno Matutino: 101-106
    { id: 101, grupo: 101, semestre: 1, turno: 'Matutino' },
    { id: 102, grupo: 102, semestre: 1, turno: 'Matutino' },
    { id: 103, grupo: 103, semestre: 1, turno: 'Matutino' },
    { id: 104, grupo: 104, semestre: 1, turno: 'Matutino' },
    { id: 105, grupo: 105, semestre: 1, turno: 'Matutino' },
    { id: 106, grupo: 106, semestre: 1, turno: 'Matutino' },
    // Turno Vespertino: 107-112
    { id: 107, grupo: 107, semestre: 1, turno: 'Vespertino' },
    { id: 108, grupo: 108, semestre: 1, turno: 'Vespertino' },
    { id: 109, grupo: 109, semestre: 1, turno: 'Vespertino' },
    { id: 110, grupo: 110, semestre: 1, turno: 'Vespertino' },
    { id: 111, grupo: 111, semestre: 1, turno: 'Vespertino' },
    { id: 112, grupo: 112, semestre: 1, turno: 'Vespertino' },
    // Segundo Semestre - Turno Matutino: 301-306
    { id: 301, grupo: 301, semestre: 2, turno: 'Matutino' },
    { id: 302, grupo: 302, semestre: 2, turno: 'Matutino' },
    { id: 303, grupo: 303, semestre: 2, turno: 'Matutino' },
    { id: 304, grupo: 304, semestre: 2, turno: 'Matutino' },
    { id: 305, grupo: 305, semestre: 2, turno: 'Matutino' },
    { id: 306, grupo: 306, semestre: 2, turno: 'Matutino' },
    // Segundo Semestre - Turno Vespertino: 307-312
    { id: 307, grupo: 307, semestre: 2, turno: 'Vespertino' },
    { id: 308, grupo: 308, semestre: 2, turno: 'Vespertino' },
    { id: 309, grupo: 309, semestre: 2, turno: 'Vespertino' },
    { id: 310, grupo: 310, semestre: 2, turno: 'Vespertino' },
    { id: 311, grupo: 311, semestre: 2, turno: 'Vespertino' },
    { id: 312, grupo: 312, semestre: 2, turno: 'Vespertino' },
  // Tercer Semestre - Turno Matutino: 501-506
  { id: 501, grupo: 501, semestre: 3, turno: 'Matutino' },
  { id: 502, grupo: 502, semestre: 3, turno: 'Matutino' },
  { id: 503, grupo: 503, semestre: 3, turno: 'Matutino' },
  { id: 504, grupo: 504, semestre: 3, turno: 'Matutino' },
  { id: 505, grupo: 505, semestre: 3, turno: 'Matutino' },
  { id: 506, grupo: 506, semestre: 3, turno: 'Matutino' },
  // Tercer Semestre - Turno Vespertino: 507-512
  { id: 507, grupo: 507, semestre: 3, turno: 'Vespertino' },
  { id: 508, grupo: 508, semestre: 3, turno: 'Vespertino' },
  { id: 509, grupo: 509, semestre: 3, turno: 'Vespertino' },
  { id: 510, grupo: 510, semestre: 3, turno: 'Vespertino' },
  { id: 511, grupo: 511, semestre: 3, turno: 'Vespertino' },
  { id: 512, grupo: 512, semestre: 3, turno: 'Vespertino' },
  ];

  const effectiveSalones = Array.isArray(salones) && salones.length ? salones : defaultSalones;
  const [showPrimer, setShowPrimer] = useState(true);
  const [showSegundo, setShowSegundo] = useState(true);
  const [showTercer, setShowTercer] = useState(true);
  const [activeSemestre, setActiveSemestre] = useState(null);

  // Normaliza un id de salón a la forma que espera la API: 'grupo_XXX'
  const toApiGrupoId = (salonId) => {
    if (!salonId && salonId !== 0) return salonId;
    const s = String(salonId);
    return s.startsWith('grupo_') ? s : `grupo_${s}`;
  };

  const handleAddStudent = (newStudent, grupoId) => {
    const apiId = toApiGrupoId(grupoId);
  fetch(`${API_BASE}/alumnos.php/${apiId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    })
    .then(res => res.json())
    .then(addedStudent => {
      console.log('POST addedStudent:', addedStudent, 'grupoId passed:', grupoId, 'apiId:', apiId);
      // recargamos la lista del grupo para asegurar consistencia
      handleGrupoClick(grupoId);
    })
    .catch(err => { console.error("Error al añadir alumno:", err); throw err; });
  };

  const handleUpdateStudent = (updatedStudent) => {
    const { id, nombre, apellido_paterno, apellido_materno, matricula } = updatedStudent;
  console.log('PUT updating student', id, 'selectedGrupo:', selectedGrupo);
  fetch(`${API_BASE}/alumnos.php/${selectedGrupo}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido_paterno, apellido_materno, matricula }),
    })
    .then(res => res.json())
    .then(result => {
      console.log('PUT result:', result);
      // recargamos la lista del grupo
      handleGrupoClick(selectedGrupo && String(selectedGrupo).startsWith('grupo_') ? Number(String(selectedGrupo).replace('grupo_', '')) : selectedGrupo);
    })
    .catch(err => { console.error("Error al actualizar alumno:", err); });
  };

  const handleDeleteStudent = (alumnoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este alumno?')) {
  fetch(`${API_BASE}/alumnos.php/${selectedGrupo}/${alumnoId}`, {
        method: 'DELETE',
      })
      .then(res => res.json())
      .then(result => {
        console.log('DELETE result:', result);
        // recargar desde el servidor para mantener consistencia
        if (selectedGrupo) {
          handleGrupoClick(selectedGrupo && String(selectedGrupo).startsWith('grupo_') ? Number(String(selectedGrupo).replace('grupo_', '')) : selectedGrupo);
        } else {
          setAlumnos(prev => prev.filter(s => s.id !== alumnoId));
        }
      })
      .catch(err => { console.error("Error al eliminar alumno:", err); });
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
  setIsViewing(false);
  setIsModalOpen(true);
  };

  const handleViewClick = (student) => {
    setEditingStudent(student);
  setIsViewing(true);
  setIsModalOpen(true);
  };
  
  const handleGrupoClick = (grupoId) => {
  const apiId = toApiGrupoId(grupoId);
  setSelectedGrupo(apiId);
  setIsLoading(true);
  setAlumnos([]);
  fetch(`${API_BASE}/alumnos.php/${apiId}`)
      .then(res => res.json())
      .then(data => {
          console.log('GET alumnos for', apiId, data);
          // El backend puede devolver objetos con { id, grupo_id, nombre, apellido_paterno, apellido_materno, matricula }
          // Normalizamos a la forma que usa la UI: { id, nombre: 'Nombre Apellidos', edad, promedio, matricula, grupo_id }
          const normalized = Array.isArray(data) ? data.map(a => ({
            id: a.id,
            nombre: `${a.nombre || ''} ${a.apellido_paterno || ''} ${a.apellido_materno || ''}`.trim(),
            edad: a.edad || '',
            promedio: a.promedio || '',
            matricula: a.matricula || '',
            grupo_id: a.grupo_id || null,
            // mantener la estructura por si viene en otro formato
            raw: a
          })) : [];
          setAlumnos(normalized);
          setIsLoading(false);
        })
      .catch(err => {
        console.error("Error al cargar alumnos del grupo:", err);
        setIsLoading(false);
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  setIsViewing(false);
  };

  return (
    <>
      <div className="alumnos-container">
        <div className="alumnos-header">
          <h2>Gestión de Alumnos</h2>
          {selectedGrupo && (
            <button
              className="add-student-button"
              onClick={() => setIsModalOpen(true)}
            >
              + Añadir Alumno
            </button>
          )}
        </div>

        {/* Secciones por semestre */}
        <div className="semestres-container">
          {[1, 2, 3].map((sem) => (
            <section className="semestre-section" key={sem}>
              <h3>
                {sem === 1 ? 'Primer Semestre' : sem === 2 ? 'Segundo Semestre' : 'Tercer Semestre'}
                {sem === 1 && (
                  <button
                    className="toggle-section-button"
                    onClick={() => setShowPrimer(prev => !prev)}
                    style={{ marginLeft: 12 }}
                  >
                    {showPrimer ? 'Ocultar' : 'Mostrar'}
                  </button>
                )}
                {sem === 2 && (
                  <button
                    className="toggle-section-button"
                    onClick={() => setShowSegundo(prev => !prev)}
                    style={{ marginLeft: 12 }}
                  >
                    {showSegundo ? 'Ocultar' : 'Mostrar'}
                  </button>
                )}
                {sem === 3 && (
                  <button
                    className="toggle-section-button"
                    onClick={() => setShowTercer(prev => !prev)}
                    style={{ marginLeft: 12 }}
                  >
                    {showTercer ? 'Ocultar' : 'Mostrar'}
                  </button>
                )}
              </h3>

              {sem === 1 && !showPrimer ? (
                <p className="section-collapsed">Sección oculta.</p>
              ) : sem === 2 && !showSegundo ? (
                <p className="section-collapsed">Sección oculta.</p>
              ) : sem === 3 && !showTercer ? (
                <p className="section-collapsed">Sección oculta.</p>
              ) : (
                <div className="grupos-container">
                  {/* Turno Matutino */}
                  <div className="turno-block">
                    <h4>Matutino</h4>
                    <div className="grupos-tabs">
                      {Array.isArray(effectiveSalones) && effectiveSalones.filter(salon => salon.semestre === sem && salon.turno === 'Matutino').length > 0 ? (
                        effectiveSalones
                          .filter(salon => salon.semestre === sem && salon.turno === 'Matutino')
                          .map(salon => (
                            <button 
                              key={salon.id} 
                              className={`grupo-tab ${selectedGrupo === toApiGrupoId(salon.id) ? 'active' : ''}`}
                              onClick={() => {
                                // establecer semestre activo en base al salón clickeado
                                setActiveSemestre(salon.semestre);
                                handleGrupoClick(salon.id);
                              }}
                            >
                              Grupo {salon.grupo}
                            </button>
                          ))
                      ) : (
                        <p className="no-groups">No hay grupos en este turno.</p>
                      )}
                    </div>
                  </div>

                  {/* Turno Vespertino */}
                  <div className="turno-block">
                    <h4>Vespertino</h4>
                    <div className="grupos-tabs">
                      {Array.isArray(effectiveSalones) && effectiveSalones.filter(salon => salon.semestre === sem && salon.turno === 'Vespertino').length > 0 ? (
                        effectiveSalones
                          .filter(salon => salon.semestre === sem && salon.turno === 'Vespertino')
                          .map(salon => (
                            <button 
                              key={salon.id} 
                              className={`grupo-tab ${selectedGrupo === toApiGrupoId(salon.id) ? 'active' : ''}`}
                              onClick={() => {
                                setActiveSemestre(salon.semestre);
                                handleGrupoClick(salon.id);
                              }}
                            >
                              Grupo {salon.grupo}
                            </button>
                          ))
                      ) : (
                        <p className="no-groups">No hay grupos en este turno.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {isLoading && <p>Cargando alumnos...</p>}

  {!isLoading && !selectedGrupo && <p>Por favor, selecciona un grupo para ver los alumnos.</p>}

        {!isLoading && selectedGrupo && alumnos.length === 0 && <p>No hay alumnos en este grupo.</p>}

        {!isLoading && alumnos.length > 0 && (
          <table className="alumnos-table">
            {/* ... el resto de la tabla sigue igual ... */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Matrícula</th>
                <th>Grupo (ID)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno) => (
                <tr key={alumno.id}>
                  <td>{alumno.id}</td>
                  <td>{alumno.nombre}</td>
                  <td>{alumno.matricula}</td>
                  <td>{alumno.grupo_id || alumno.raw?.grupo || selectedGrupo}</td>
                  <td className="actions-cell">
                    <button className="action-button view-button" onClick={() => handleViewClick(alumno)}>Ver</button>
                    <button 
                      className="action-button edit-button"
                      onClick={() => handleEditClick(alumno)}
                    >
                      Editar
                    </button>
                    <button 
                      className="action-button delete-button" 
                      onClick={() => handleDeleteStudent(alumno.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <AddStudentModal
          studentToEdit={editingStudent}
          onClose={handleCloseModal}
          onAddStudent={handleAddStudent}
          onUpdateStudent={handleUpdateStudent}
          salones={activeSemestre ? effectiveSalones.filter(s => s.semestre === activeSemestre) : effectiveSalones}
          selectedGrupo={selectedGrupo && String(selectedGrupo).startsWith('grupo_') ? Number(String(selectedGrupo).replace('grupo_', '')) : selectedGrupo}
          readOnly={isViewing}
        />
      )}
    </>
  );
}

export default Alumnos;
import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';
import '../App.css';

// El modal ahora es más inteligente: puede crear o editar.
function AddStudentModal({ onClose, onAddStudent, onUpdateStudent, studentToEdit, selectedGrupo, salones = [], readOnly = false }) {
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [matricula, setMatricula] = useState('');
  // Guardamos el id (número) del grupo seleccionado en el select
  const [selectedGrupoValue, setSelectedGrupoValue] = useState(selectedGrupo || '');

  useEffect(() => {
    if (studentToEdit) {
  // studentToEdit puede venir normalizado o en formato raw
  setNombre(studentToEdit.nombre || studentToEdit.raw?.nombre || '');
  setApellidoPaterno(studentToEdit.raw?.apellido_paterno || studentToEdit.apellido_paterno || '');
  setApellidoMaterno(studentToEdit.raw?.apellido_materno || studentToEdit.apellido_materno || '');
  setMatricula(studentToEdit.raw?.matricula || studentToEdit.matricula || '');
      // intentar extraer grupo
  const g = studentToEdit.grupo_id || studentToEdit.raw?.grupo_id || studentToEdit.raw?.grupo || selectedGrupo || '';
  setSelectedGrupoValue(g);
    } else {
      setNombre('');
  setApellidoPaterno('');
  setApellidoMaterno('');
  setMatricula('');
    }
  }, [studentToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre) {
      alert('Por favor, escribe el nombre del alumno.');
      return;
    }

  if (!studentToEdit && !selectedGrupoValue) {
      alert('Por favor, selecciona un grupo para el alumno.');
      return;
    }

    const payload = {
      nombre,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      matricula,
  // enviar el número de grupo (p. ej. 101)
  grupo: Number(selectedGrupoValue),
    };

    if (studentToEdit) {
      const updatedStudent = { ...studentToEdit, ...payload };
      onUpdateStudent(updatedStudent);
    } else {
  // si el usuario seleccionó un grupo en el select, usarlo; si no, usar el selectedGrupo (prop)
  const grupoParaEnviar = selectedGrupoValue ? Number(selectedGrupoValue) : selectedGrupo;
  onAddStudent(payload, grupoParaEnviar);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{studentToEdit ? 'Editar Alumno' : 'Añadir Nuevo Alumno'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="grupoSelect">Grupo</label>
            {!studentToEdit ? (
              <select id="grupoSelect" value={selectedGrupoValue} onChange={(e) => setSelectedGrupoValue(e.target.value)}>
                <option value="">-- Selecciona un grupo --</option>
                {salones.map(s => (
                  <option key={s.id} value={s.grupo}>{`Grupo ${s.grupo} (${s.turno || ''})`}</option>
                ))}
              </select>
            ) : (
              <input type="text" value={selectedGrupoValue ? `Grupo ${selectedGrupoValue}` : ''} disabled />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="apellidoPaterno">Apellido Paterno</label>
            <input type="text" id="apellidoPaterno" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="apellidoMaterno">Apellido Materno</label>
            <input type="text" id="apellidoMaterno" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="matricula">Matrícula</label>
            <input type="text" id="matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" className="button-secondary" onClick={onClose}>{readOnly ? 'Cerrar' : 'Cancelar'}</button>
            {!readOnly && (
              <button type="submit" className="button-primary">
                {studentToEdit ? 'Guardar Cambios' : 'Guardar Alumno'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudentModal;
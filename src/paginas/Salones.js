import React, { useState } from 'react';
import '../styles/Salones.css';
import AddStudentModal from '../componentes/AddStudentModal';

const semestres = [
  {
    id: 's100',
    title: '1er Semestre',
    matutino: ['101', '102', '103', '104', '105', '106'],
    vespertino: ['107', '108', '109', '110', '111', '112'],
  },
  {
    id: 's400',
    title: '2do Semestre',
    matutino: ['401', '402', '403', '404', '405', '406'],
    vespertino: ['407', '408', '409', '410', '411', '412'],
  },
  {
    id: 's600',
    title: '3er Semestre',
    matutino: ['601', '602', '603', '604', '605', '606'],
    vespertino: ['607', '608', '609', '610', '611', '612'],
  },
];

const salonStudents = {
  '101': [
    { id: '101-1', nombre: 'Ana Pérez', edad: '14', promedio: '8.9' },
    { id: '101-2', nombre: 'Diego Gómez', edad: '15', promedio: '9.1' },
    { id: '101-3', nombre: 'Lucía Sánchez', edad: '14', promedio: '9.4' },
  ],
  '102': [
    { id: '102-1', nombre: 'Camila Rojas', edad: '15', promedio: '8.7' },
    { id: '102-2', nombre: 'Mateo Torres', edad: '14', promedio: '8.5' },
    { id: '102-3', nombre: 'Paula Díaz', edad: '15', promedio: '9.0' },
  ],
};

function Salones({ selectedStudent: selectedStudentProp, onSelectStudent }) {
  const [openSection, setOpenSection] = useState(null);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const currentSelectedStudent = selectedStudentProp || selectedStudent;

  const mostrar = (id) => {
    const nextId = openSection === id ? null : id;
    setOpenSection(nextId);
    if (nextId !== openSection) {
      setSelectedSalon(null);
      setStudents([]);
      setStudentToEdit(null);
      setIsModalOpen(false);
      if (onSelectStudent) onSelectStudent(null);
    }
  };

  const handleSalonSelect = (salon) => {
    setSelectedSalon(salon);
    setStudentToEdit(null);
    setIsModalOpen(false);
    if (onSelectStudent) onSelectStudent(null);
    setStudents(salonStudents[salon] || [
      { id: `${salon}-1`, nombre: `Alumno ${salon} A`, edad: '14', promedio: '8.8' },
      { id: `${salon}-2`, nombre: `Alumno ${salon} B`, edad: '15', promedio: '8.5' },
      { id: `${salon}-3`, nombre: `Alumno ${salon} C`, edad: '14', promedio: '9.2' },
    ]);
  };

  const handleAddStudent = (newStudent) => {
    const nextId = `${selectedSalon}-${students.length + 1}`;
    const studentToAdd = {
      id: nextId,
      ...newStudent,
    };
    setStudents((prev) => [...prev, studentToAdd]);
  };

  const handleEditClick = (student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleUpdateStudent = (updatedStudent) => {
    setStudents((prev) => prev.map((student) => student.id === updatedStudent.id ? updatedStudent : student));
    if (selectedStudent?.id === updatedStudent.id) {
      if (onSelectStudent) onSelectStudent(updatedStudent);
    }
  };

  const handleSelectForReport = (student) => {
    setSelectedStudent(student);
    if (onSelectStudent) {
      onSelectStudent(student);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStudentToEdit(null);
  };

  const selectedSemester = semestres.find((semestre) => semestre.id === openSection);

  return (
    <div className="salones-page">
      <div className="container">
        <div className="page-header">
          <h1><i className="fa-solid fa-chalkboard-user" style={{ marginRight: '10px' }}></i>Salones</h1>
          <div className="semestres-list">
            {semestres.map((semestre) => (
              <button
                key={semestre.id}
                className={`btn-semestre ${openSection === semestre.id ? 'active' : ''}`}
                onClick={() => mostrar(semestre.id)}
              >
                {semestre.title}
              </button>
            ))}
          </div>
        </div>

        {selectedSemester && (
          <div className="semestre-detalle">
            <h3>Turno Matutino</h3>
            <div className="lista-salones">
              {selectedSemester.matutino.map((salon) => (
                <div key={`${selectedSemester.id}-m-${salon}`}>
                  <div
                    className={`salon ${selectedSalon === salon ? 'selected' : ''}`}
                    onClick={() => handleSalonSelect(salon)}
                  >
                    {salon}
                  </div>
                  {selectedSalon === salon && (
                    <div className="detalle-salon">
                      <div className="detalle-salon-header">
                        <button className="btn-regresar" onClick={() => setSelectedSalon(null)}>
                          ← Cambiar selección
                        </button>
                        <button className="button-primary" onClick={() => {
                          setStudentToEdit(null);
                          setIsModalOpen(true);
                        }}>
                          + Añadir Alumno
                        </button>
                      </div>
                      <h2>Alumnos del salón {selectedSalon}</h2>

                      <table className="alumnos-table">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Promedio</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id} className={currentSelectedStudent?.id === student.id ? 'selected-row' : ''}>
                              <td>{student.nombre}</td>
                              <td>{student.edad}</td>
                              <td>{student.promedio}</td>
                              <td className="actions-cell">
                                <button className="action-button select-button" onClick={() => handleSelectForReport(student)}>
                                  Seleccionar
                                </button>
                                <button className="action-button edit-button" onClick={() => handleEditClick(student)}>
                                  Editar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {currentSelectedStudent && (
                        <div className="selected-student-card">
                          <h3>Alumno guardado para reporte</h3>
                          <p><strong>Nombre:</strong> {currentSelectedStudent.nombre}</p>
                          <p><strong>Edad:</strong> {currentSelectedStudent.edad}</p>
                          <p><strong>Promedio:</strong> {currentSelectedStudent.promedio}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <br />

            <h3>Turno Vespertino</h3>
            <div className="lista-salones">
              {selectedSemester.vespertino.map((salon) => (
                <div key={`${selectedSemester.id}-v-${salon}`}>
                  <div
                    className={`salon ${selectedSalon === salon ? 'selected' : ''}`}
                    onClick={() => handleSalonSelect(salon)}
                  >
                    {salon}
                  </div>
                  {selectedSalon === salon && (
                    <div className="detalle-salon">
                      <div className="detalle-salon-header">
                        <button className="btn-regresar" onClick={() => setSelectedSalon(null)}>
                          ← Cambiar selección
                        </button>
                        <button className="button-primary" onClick={() => {
                          setStudentToEdit(null);
                          setIsModalOpen(true);
                        }}>
                          + Añadir Alumno
                        </button>
                      </div>
                      <h2>Alumnos del salón {selectedSalon}</h2>

                      <table className="alumnos-table">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Promedio</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id} className={currentSelectedStudent?.id === student.id ? 'selected-row' : ''}>
                              <td>{student.nombre}</td>
                              <td>{student.edad}</td>
                              <td>{student.promedio}</td>
                              <td className="actions-cell">
                                <button className="action-button select-button" onClick={() => handleSelectForReport(student)}>
                                  Seleccionar
                                </button>
                                <button className="action-button edit-button" onClick={() => handleEditClick(student)}>
                                  Editar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {currentSelectedStudent && (
                        <div className="selected-student-card">
                          <h3>Alumno guardado para reporte</h3>
                          <p><strong>Nombre:</strong> {currentSelectedStudent.nombre}</p>
                          <p><strong>Edad:</strong> {currentSelectedStudent.edad}</p>
                          <p><strong>Promedio:</strong> {currentSelectedStudent.promedio}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isModalOpen && (
          <AddStudentModal
            onClose={handleCloseModal}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            studentToEdit={studentToEdit}
            selectedGrupo={selectedSalon}
          />
        )}
      </div>
    </div>
  );
}

export default Salones;

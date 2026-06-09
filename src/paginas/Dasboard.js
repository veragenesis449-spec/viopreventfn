import React, { useState, useEffect } from 'react';
import '../App.css'; // Estilos generales primero
import '../styles/Dasboard.css'; // Estilos específicos del componente después, para que tengan prioridad
import Alumnos from './Alumnos'; // Importamos el nuevo componente
import Reportes from './Reportes'; // Importamos el componente de Reportes
import Salones from './Salones'; // Importamos el componente de Salones
import Inicio from './Inicio'; // Importamos el nuevo componente de Inicio
import DataTable from './DataTable'; // Importamos el nuevo componente genérico

function Dashboard({ onLogout }) {
  // Estado para controlar la vista activa
  const [activeView, setActiveView] = useState('Inicio');
  // El estado ahora se inicializa como un array vacío.
  const [alumnos, setAlumnos] = useState([]);
  const [salones, setSalones] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [orientadores, setOrientadores] = useState([]);
  const [responsables, setResponsables] = useState([]);

  // useEffect para cargar los datos desde la API cuando el componente se monta.
  useEffect(() => {
    // Cargar alumnos
    fetch('http://localhost/VioPrevent/api/alumnos.php')
      .then(res => res.json())
      .then(data => setAlumnos(data))
      .catch(err => console.error("Error al cargar alumnos:", err));

    // Cargar salones
    fetch('http://localhost/VioPrevent/api/salones.php')
      .then(res => res.json())
      .then(data => setSalones(data))
      .catch(err => console.error("Error al cargar salones:", err));

    // --- DATOS FICTICIOS PARA REPORTES ---
    const fakeReports = [
      // Pendientes (4 total, 3 de tipo Física)
      { id: 1, tipo: 'Física', estado: 'Pendiente', fecha: '2026-06-03', alumno: 'Sofía Martínez', lugar: 'Patio' },
      { id: 2, tipo: 'Física', estado: 'Pendiente', fecha: '2026-06-02', alumno: 'Carlos Ramírez', lugar: 'Salón 3B' },
      { id: 3, tipo: 'Física', estado: 'Pendiente', fecha: '2026-05-30', alumno: 'Ana Torres', lugar: 'Gimnasio' },
      { id: 11, tipo: 'Ciberacoso', estado: 'Pendiente', fecha: '2026-06-04', alumno: 'Isabel Roca', lugar: 'Foro online' },

      // En revisión (2 total)
      { id: 4, tipo: 'Verbal', estado: 'En revisión', fecha: '2026-05-28', alumno: 'Luis Hernández', lugar: 'Cafetería' },
      { id: 5, tipo: 'Psicológica', estado: 'En revisión', fecha: '2026-05-25', alumno: 'María López', lugar: 'Online' },

      // Resueltos (6 este mes - Junio)
      { id: 6, tipo: 'Ciberacoso', estado: 'Resuelto', fecha: '2026-06-01', alumno: 'Elena Gómez', lugar: 'Redes Sociales' },
      { id: 7, tipo: 'Discriminación', estado: 'Resuelto', fecha: '2026-06-02', alumno: 'Jorge Nuñez', lugar: 'Biblioteca' },
      { id: 12, tipo: 'Verbal', estado: 'Resuelto', fecha: '2026-06-03', alumno: 'Laura Pons', lugar: 'Salón 2A' },
      { id: 13, tipo: 'Física', estado: 'Resuelto', fecha: '2026-06-03', alumno: 'Marcos Vera', lugar: 'Patio' },
      { id: 14, tipo: 'Psicológica', estado: 'Resuelto', fecha: '2026-06-04', alumno: 'Daniela Schmidt', lugar: 'Salón 1C' },
      { id: 15, tipo: 'Verbal', estado: 'Resuelto', fecha: '2026-06-04', alumno: 'Adrián Soler', lugar: 'Comedor' },

      // Resueltos (meses anteriores)
      { id: 8, tipo: 'Física', estado: 'Resuelto', fecha: '2026-05-15', alumno: 'Pedro Jiménez', lugar: 'Canchas' },
      { id: 9, tipo: 'Verbal', estado: 'Resuelto', fecha: '2026-05-12', alumno: 'Lucía Fernández', lugar: 'Pasillo' },
      { id: 10, tipo: 'Psicológica', estado: 'Resuelto', fecha: '2026-04-20', alumno: 'Miguel Ángel', lugar: 'Salón 1A' },
    ];
    setReportes(fakeReports);
    // --- FIN DE DATOS FICTICIOS ---

    /* Carga original de reportes desde la API (comentado)
    fetch('http://localhost/VioPrevent/api/reportes.php')
      .then(res => res.json())
      .then(data => setReportes(data))
      .catch(err => console.error("Error al cargar reportes:", err));
    */

    // Cargar nuevas secciones
    fetch('http://localhost/VioPrevent/api/orientadores.php').then(res => res.json()).then(data => setOrientadores(data)).catch(err => console.error("Error al cargar orientadores:", err));
    fetch('http://localhost/VioPrevent/api/responsables.php').then(res => res.json()).then(data => setResponsables(data)).catch(err => console.error("Error al cargar responsables:", err));
  }, []); // El array vacío asegura que esto se ejecute solo una vez.

  // Funciones para modificar los salones
  const handleAddSalon = (newSalon) => {
    setSalones([...salones, newSalon]);
  };

  const handleDeleteSalon = (salonId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este salón?')) {
      setSalones(salones.filter(salon => salon.id !== salonId));
    }
  };

  const handleUpdateSalon = (updatedSalon) => {
    setSalones(salones.map(salon => 
      salon.id === updatedSalon.id ? updatedSalon : salon
    ));
  };

  // Funciones para modificar los reportes
  const handleAddReport = (newReport) => {
    setReportes([...reportes, newReport]);
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      setReportes(reportes.filter(reporte => reporte.id !== reportId));
    }
  };

  // Función para renderizar el contenido principal según la vista activa
  const renderContent = () => {
    switch (activeView) {
      case 'Alumnos':
        // Pasamos la lista y las funciones como props al componente Alumnos
        return <Alumnos 
          salones={salones}
        />;
      case 'Reportes':
        // Ahora pasamos la lista de reportes y las funciones
        return <Reportes 
          alumnos={alumnos}
          reportes={reportes}
          onAddReport={handleAddReport}
          onDeleteReport={handleDeleteReport}
        />;
      case 'Salones':
        return <Salones />;
      case 'Orientadores':
        return <DataTable title="Gestión de Orientadores" data={orientadores} />;
      case 'Responsables':
        return <DataTable title="Gestión de Responsables" data={responsables} />;
      case 'Inicio':
      default:
        // Pasamos los datos directamente al componente Inicio
        return <Inicio 
          alumnos={alumnos}
          salones={salones}
          reportes={reportes}
        />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Barra Lateral de Navegación con ID para máxima prioridad */}
      <aside id="dashboard-sidebar" className="sidebar">
        <div className="sidebar-header">
          <h2>VioPrevent</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeView === 'Inicio' ? 'active' : ''}>
              <a href="#" onClick={() => setActiveView('Inicio')}>Inicio</a>
            </li>
            <li className={activeView === 'Alumnos' ? 'active' : ''}>
              <a href="#" onClick={() => setActiveView('Alumnos')}>Alumnos</a>
            </li>
            <li className={activeView === 'Reportes' ? 'active' : ''}>
              <a href="#" onClick={() => setActiveView('Reportes')}>Reportes</a>
            </li>
            <li className={activeView === 'Salones' ? 'active' : ''}>
              <a href="#" onClick={() => setActiveView('Salones')}>Salones</a>
            </li>
            <li className={activeView === 'Orientadores' ? 'active' : ''}>
              <a href="#" onClick={() => setActiveView('Orientadores')}>Orientadores</a>
            </li>
            <li className={activeView === 'Responsables' ? 'active' : ''}>
              <a href="#" onClick={() => setActiveView('Responsables')}>Responsables</a>
            </li>
            {/* Añade aquí más elementos de menú en el futuro */}
            <li><a href="#" onClick={() => setActiveView('Ajustes')}>Ajustes</a></li>
          </ul>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="main-content-dashboard">
        <header className="main-header">
          <div className="header-search">
            <input type="search" placeholder="Buscar alumnos, reportes..." />
          </div>
          <div className="header-user">
            <span>Juan Pérez (Director)</span>
            <button className="logout-button" onClick={onLogout}>Cerrar Sesión</button>
          </div>
        </header>

        {renderContent()} {/* Aquí se renderiza el contenido dinámico */}

      </main>
    </div>
  );
}

export default Dashboard;
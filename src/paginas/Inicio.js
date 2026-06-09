import React, { useEffect } from 'react';
import '../App.css';
import '../styles/inicio.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat/dist/leaflet-heat.js';
import { FaUsers, FaSchool, FaFileLines, FaTriangleExclamation, FaBell, FaCircleCheck } from 'react-icons/fa6';
import UltimosReportes from './UltimosReportes'; // Importamos el nuevo componente

// El componente recibe todos los datos que necesita para los resúmenes
function Inicio({ alumnos, salones, reportes }) {
  // Calculamos los totales.
  const totalAlumnos = alumnos.length;
  const totalSalones = salones.length;
  const totalReportes = reportes.length;
  const reportesPendientes = reportes.filter(r => r.estado === 'Pendiente' || r.estado === 'En revisión').length;

  // Lógica para Alertas y Notificaciones
  const reportesFisicosPendientes = reportes.filter(r => r.tipo === 'Física' && r.estado === 'Pendiente').length;
  const reportesEnSeguimiento = reportes.filter(r => r.estado === 'En revisión').length;
  
  const hoy = new Date();
  const reportesResueltosMes = reportes.filter(r => {
    if (r.estado !== 'Resuelto' || !r.fecha) return false;
    const fechaReporte = new Date(r.fecha);
    return fechaReporte.getMonth() === hoy.getMonth() && fechaReporte.getFullYear() === hoy.getFullYear();
  }).length;

  useEffect(() => {
    // Variable para guardar la instancia del mapa
    let map;

    // Asegurarse de que el contenedor del mapa esté vacío antes de inicializar
    const mapContainer = document.getElementById('map');
    if (mapContainer && mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    // Coordenadas aproximadas para centrar el mapa
    map = L.map('map').setView([19.6729569, -99.0870913], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Datos © OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    // Zonas de calor (datos de ejemplo)
    var reportesHeat = [
      [19.67295, -99.08709, 0.9], // Baños
      [19.67297, -99.08712, 0.8], // Pasillos
      [19.67293, -99.08705, 0.7], // Patio
      [19.67299, -99.08700, 0.6], // Cafetería
      [19.67300, -99.08710, 0.4], // Biblioteca
      [19.67292, -99.08708, 0.3], // Cancha
      [19.67288, -99.08715, 0.5], // Estacionamiento
      [19.67290, -99.08702, 0.6], // Entrada principal
      [19.67302, -99.08705, 0.7], // Laboratorio
      [19.67304, -99.08712, 0.8], // Dirección
      [19.67286, -99.08710, 0.5]  // Talleres
    ];

    L.heatLayer(reportesHeat, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.3: 'lime', 0.6: 'yellow', 0.9: 'red' }
    }).addTo(map);

    // Función de limpieza que se ejecuta cuando el componente se desmonta
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez.

  return (
    <>
      {/* El contenido existente de 'content-area' se coloca aquí dentro */}
      <section className="content-area">
        <h1>Bienvenido al Panel de Control</h1>
        <p>Desde aquí podrás administrar la información clave de la institución.</p>

        {/* Contenedor para las tarjetas de estadísticas (código existente) */}
        <div className="stats-cards-container">
          <div className="stat-card">
            <FaUsers className="stat-card-icon" />
            <div className="stat-card-info">
              <span className="stat-card-title">Total de Alumnos</span>
              <span className="stat-card-value">{totalAlumnos}</span>
              <span className="stat-card-subtitle">Alumnos registrados</span>
            </div>
          </div>
          <div className="stat-card">
            <FaSchool className="stat-card-icon" />
            <div className="stat-card-info">
              <span className="stat-card-title">Total de Salones</span>
              <span className="stat-card-value">{totalSalones}</span>
              <span className="stat-card-subtitle">Salones activos</span>
            </div>
          </div>
          <div className="stat-card">
            <FaFileLines className="stat-card-icon" />
            <div className="stat-card-info">
              <span className="stat-card-title">Reportes Totales</span>
              <span className="stat-card-value">{totalReportes}</span>
              <span className="stat-card-subtitle">En todos los periodos</span>
            </div>
          </div>
          <div className="stat-card">
            <FaTriangleExclamation className="stat-card-icon" />
            <div className="stat-card-info">
              <span className="stat-card-title">Reportes Pendientes</span>
              <span className="stat-card-value">{reportesPendientes}</span>
              <span className="stat-card-subtitle">Requieren atención</span>
            </div>
          </div>
        </div>

        {/* MAPA DE CALOR */}
        <div className="map-container">
          <h3 style={{ textAlign: 'center', color: '#032b2b' }}>Mapa de Calor de Incidencias</h3>
          <div id="map" style={{ height: '400px' }}></div>
        </div>

        {/* Contenedor principal para alinear gráficos y alertas (código existente) */}
        <div className="main-content-container">
          <div className="charts-container">
            {/* Próximamente: Gráficos */}
          </div>
          <div className="alerts-notifications-container">
            <h2>Alertas y notificaciones</h2>
            <button className="notification-card alert-red">
              <FaBell />
              <div className="notification-info">
                <span className="notification-main-text"><b>{`${reportesFisicosPendientes} reportes`}</b> de violencia física</span>
                <span className="notification-sub-text">pendientes de atención.</span>
              </div>
              <span className="notification-arrow">&gt;</span>
            </button>
            <button className="notification-card alert-yellow">
              <FaBell />
              <div className="notification-info">
                <span className="notification-main-text"><b>{`${reportesEnSeguimiento} reportes`}</b> en seguimiento</span>
                <span className="notification-sub-text">requieren actualización.</span>
              </div>
              <span className="notification-arrow">&gt;</span>
            </button>
            <button className="notification-card alert-green">
              <FaCircleCheck />
              <div className="notification-info">
                <span className="notification-main-text"><b>{`${reportesResueltosMes} reportes`}</b> han sido</span>
                <span className="notification-sub-text">resueltos este mes.</span>
              </div>
              <span className="notification-arrow">&gt;</span>
            </button>
          </div>
        </div>

        {/* Tabla de Últimos Reportes (código existente) */}
        <UltimosReportes reportes={reportes} />
      </section>
    </>
  );
}

export default Inicio;
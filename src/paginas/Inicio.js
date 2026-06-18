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
    let map;
    let animationFrameId;

    const initHeatmap = () => {
      const mapContainer = document.getElementById('map');
      
      if (!mapContainer) {
        animationFrameId = requestAnimationFrame(initHeatmap);
        return;
      }

      const width = mapContainer.clientWidth;
      const height = mapContainer.clientHeight;

      // Reintentar si el contenedor aún no tiene dimensiones
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(initHeatmap);
        return;
      }

      // Limpiar ID de Leaflet si existe
      if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
      }

      // Coordenadas aproximadas para centrar el mapa
      map = L.map('map').setView([19.6729569, -99.0870913], 17);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Datos © OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      // Mapear áreas a coordenadas fijas (ajusta según el plano real)
      const areaCoords = {
        cafeteria: [19.67299, -99.08700],
        direccion: [19.67304, -99.08712],
        edificio_1: [19.67295, -99.08709],
        edificio_2: [19.67297, -99.08712],
        canchas_estacionamiento: [19.67292, -99.08708],
        taller_electricidad: [19.67286, -99.08710]
      };

      // Calcular intensidad por área contando reportes
      const areaCounts = {};
      (Array.isArray(reportes) ? reportes : []).forEach(r => {
        const a = (r.area || r.area || '').toString().trim().toLowerCase();
        if (!a) return;
        // Normalizar algunos nombres comunes
        const key = a.replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        areaCounts[key] = (areaCounts[key] || 0) + 1;
      });

      const reportesHeat = [];
      Object.keys(areaCounts).forEach(key => {
        if (areaCoords[key]) {
          // intensidad entre 0.2 y 1.0 según conteo (puedes ajustar)
          const intensity = Math.min(1, 0.2 + areaCounts[key] * 0.2);
          reportesHeat.push([areaCoords[key][0], areaCoords[key][1], intensity]);
        }
      });

      // Si no hay datos reales, usar puntos de ejemplo
      if (reportesHeat.length === 0) {
        reportesHeat.push([19.67295, -99.08709, 0.3]);
        reportesHeat.push([19.67299, -99.08700, 0.4]);
      }

      L.heatLayer(reportesHeat, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: { 0.3: 'lime', 0.6: 'yellow', 0.9: 'red' }
      }).addTo(map);
    };

    // Iniciar el proceso de inicialización
    animationFrameId = requestAnimationFrame(initHeatmap);

    // Función de limpieza
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (map) {
        map.remove();
      }
    };
  }, [reportes]); // Recalcular el mapa cuando cambien los reportes.

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
              <span className="stat-card-title"> Reportes Pendientes</span>
              <span className="stat-card-value">{reportesPendientes}</span>
              <span className="stat-card-subtitle"> Requieren atención</span>
            </div>
          </div>
        </div>

        {/* MAPA DE CALOR */}
        <div className="map-container">
          <h3>Mapa de Calor de Incidencias</h3>
          <div id="map"></div>
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
                <span className="notification-sub-text">   pendientes de atención.</span>
              </div>
              <span className="notification-arrow">&gt;</span>
            </button>
            <button className="notification-card alert-yellow">
              <FaBell />
              <div className="notification-info">
                <span className="notification-main-text"><b>{`${reportesEnSeguimiento} reportes`}</b> en seguimiento</span>
                <span className="notification-sub-text">   requieren actualización.</span>
              </div>
              <span className="notification-arrow">&gt;</span>
            </button>
            <button className="notification-card alert-green">
              <FaCircleCheck />
              <div className="notification-info">
                <span className="notification-main-text"><b>{`${reportesResueltosMes} reportes`}</b> han sido</span>
                <span className="notification-sub-text">   resueltos este mes.</span>
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
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Registrar los componentes necesarios para la gráfica de pastel
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

function GraficaGravedad({ reportes }) {
  // Contar el número de reportes por nivel de gravedad
  const conteoPorGravedad = reportes.reduce((acc, reporte) => {
    const gravedad = reporte.nivel_gravedad ? reporte.nivel_gravedad.toLowerCase() : 'desconocida';
    acc[gravedad] = (acc[gravedad] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: ['Baja', 'Media', 'Alta'],
    datasets: [
      {
        label: 'Número de Reportes',
        data: [
          conteoPorGravedad['baja'] || 0,
          conteoPorGravedad['media'] || 0,
          conteoPorGravedad['alta'] || 0,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Verde para 'Baja'
          'rgba(255, 206, 86, 0.6)', // Amarillo para 'Media'
          'rgba(255, 99, 132, 0.6)',  // Rojo para 'Alta'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribución de Reportes por Nivel de Gravedad',
      },
    },
  };

  return <Pie data={data} options={options} />;
}

export default GraficaGravedad;
import React, { useState } from 'react';
import '../App.css'; // Usaremos los estilos existentes por ahora

function Formulario() {
  const [formData, setFormData] = useState({
    iniciales: '',
    grupo: '',
    edad: '',
  area: '',
    genero: '',
    gravedad: '', // Nuevo campo para la gravedad
    descripcion: '',
    evidencia: {
      fotos: false,
      videos: false,
      documentos: false,
      testigos: false,
    },
  });

  // Nuevo estado para las respuestas a las preguntas dinámicas
  const [respuestasDinamicas, setRespuestasDinamicas] = useState({});

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name.startsWith('evidencia.')) {
      const field = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        evidencia: {
          ...prevData.evidencia,
          [field]: checked,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleRespuestaDinamicaChange = (e) => {
    const { name, value } = e.target;
    setRespuestasDinamicas((prevRespuestas) => ({
      ...prevRespuestas,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mapear las respuestas dinámicas para incluir la pregunta y la respuesta
    const respuestasConPreguntas = formData.gravedad && preguntasPorGravedad[formData.gravedad]
      ? preguntasPorGravedad[formData.gravedad].map((pregunta, index) => ({
          pregunta: pregunta,
          respuesta: respuestasDinamicas[`pregunta-${index}`] || '',
        }))
      : [];

    const finalData = {
      ...formData,
      respuestasDinamicas: respuestasConPreguntas, // Enviar el array de objetos
    };

    try {
  console.log('Enviando reporte (finalData):', finalData);
  const response = await fetch('http://localhost/VioPrevent/api/guardar_reporte.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();
  console.log('Respuesta guardar_reporte:', result, 'status:', response.status);

      if (response.ok) {
        alert('Gracias por enviar tu reporte. Ha sido registrado.');
        // Opcional: Limpiar el formulario después de un envío exitoso
        setFormData({
          iniciales: '',
          grupo: '',
          edad: '',
          genero: '',
          gravedad: '',
          descripcion: '',
          evidencia: {
            fotos: false,
            videos: false,
            documentos: false,
            testigos: false,
          },
        });
        setRespuestasDinamicas({});
      } else {
        alert(`Error: ${result.mensaje || 'No se pudo guardar el reporte.'}`);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('Hubo un problema de conexión. Por favor, intenta de nuevo más tarde.');
    }
  };

  // Preguntas basadas en la gravedad
  const preguntasPorGravedad = {
    baja: [
      "¿Has sido excluido(a) de actividades, equipos o grupos?",
      "¿Crees que las agresiones son intencionales?",
      "¿Te han ignorado o dejado de hablar de manera repetida?",
      "¿Te has sentido incómodo(a) por comentarios o bromas sobre ti?",
    ],
    media: [
      "¿Han difundido rumores o mentiras sobre ti?",
      "¿Las agresiones son realizadas por la misma persona o grupo?",
      "¿Has recibido insultos o apodos ofensivos de forma repetida?",
      "¿Alguien ha intentado humillarte frente a otras personas?",
    ],
    alta: [
      "¿Has recibido mensajes ofensivos por internet o redes sociales?",
      "¿Han compartido fotos o información tuya sin permiso?",
      "¿Has recibido amenazas o intimidaciones directas?",
      "¿Alguien te ha empujado, golpeado o causado daño físico?",
    ],
  };

  return (
    <div className="cuestionario-container">
      <div className="cuestionario-header">
        <h2>Cuestionario de Reporte</h2>
        <p>Por favor, llena los siguientes campos con la mayor sinceridad posible.</p>
      </div>
      <form onSubmit={handleSubmit} className="cuestionario-form">
        <div className="form-group">
          <label>Iniciales</label>
          <input
            type="text"
            name="iniciales"
            value={formData.iniciales}
            onChange={handleChange}
            placeholder="Ej: J.P."
            maxLength="5"
            required
          />
        </div>
        <div className="form-group">
          <label>Grupo</label>
          <input
            type="text"
            name="grupo"
            value={formData.grupo}
            onChange={handleChange}
            placeholder="Ej: 402"
            required
          />
        </div>
        <div className="form-group">
          <label>Edad</label>
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            placeholder="Tu edad"
          />
        </div>
        <div className="form-group">
          <label>Área donde ocurrió el suceso</label>
          <select name="area" value={formData.area} onChange={handleChange} required>
            <option value="">Selecciona un área</option>
            <option value="cafeteria">Cafetería</option>
            <option value="direccion">Dirección</option>
            <option value="edificio_1">Edificio 1</option>
            <option value="edificio_2">Edificio 2</option>
            <option value="canchas_estacionamiento">Canchas</option>
            <option value="taller_electricidad">Taller de Electricidad</option>
          </select>
        </div>
        <div className="form-group">
          <label>Género</label>
          <select name="genero" value={formData.genero} onChange={handleChange}>
            <option value="">Selecciona una opción</option>
            <option value="femenino">Femenino</option>
            <option value="masculino">Masculino</option>
            <option value="otro">Otro</option>
            <option value="prefiero-no-decir">Prefiero no decir</option>
          </select>
        </div>
        <div className="form-group">
          <label>Nivel de Gravedad</label>
          <select name="gravedad" value={formData.gravedad} onChange={handleChange} required>
            <option value="">Selecciona una opción</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        {/* Renderizado condicional de preguntas */}
        {formData.gravedad && preguntasPorGravedad[formData.gravedad] && (
          <div className="dynamic-questions">
            <h4>Preguntas Adicionales</h4>
            {preguntasPorGravedad[formData.gravedad].map((pregunta, index) => (
              <div className="form-group" key={index}>
                <label>{pregunta}</label>
                <input
                  type="text"
                  name={`pregunta-${index}`}
                  value={respuestasDinamicas[`pregunta-${index}`] || ''}
                  onChange={handleRespuestaDinamicaChange}
                  required
                />
              </div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label>Describe la situación</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe detalladamente lo ocurrido..."
            required
          />
        </div>

        <h4>Tipo de Evidencia (si aplica)</h4>
        <div className="evidence-group">
          <div className="form-check">
            <input type="checkbox" name="evidencia.fotos" id="fotos" checked={formData.evidencia.fotos} onChange={handleChange} />
            <label htmlFor="fotos">Fotos</label>
          </div>
          <div className="form-check">
            <input type="checkbox" name="evidencia.videos" id="videos" checked={formData.evidencia.videos} onChange={handleChange} />
            <label htmlFor="videos">Videos</label>
          </div>
          <div className="form-check">
            <input type="checkbox" name="evidencia.documentos" id="documentos" checked={formData.evidencia.documentos} onChange={handleChange} />
            <label htmlFor="documentos">Documentos</label>
          </div>
          <div className="form-check">
            <input type="checkbox" name="evidencia.testigos" id="testigos" checked={formData.evidencia.testigos} onChange={handleChange} />
            <label htmlFor="testigos">Testigos</label>
          </div>
        </div>

        <button type="submit" className="button-primary">Enviar Reporte</button>
      </form>
    </div>
  );
}

export default Formulario;

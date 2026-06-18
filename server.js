// ----------------- Backend (Servidor) -----------------
// Este archivo NO es parte de la aplicación de React.
// Es un servidor independiente que se ejecutará con Node.js.

// 1. Importar las librerías necesarias
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Necesario para permitir la comunicación entre el frontend y el backend

// 2. Configuración del servidor
const app = express();
const port = 3001; // Usamos un puerto diferente al de React (que suele ser 3000)

// 3. Middlewares
// Habilita CORS para permitir peticiones desde el frontend (localhost:3000 y desde el host)
app.use(cors({
  origin: function(origin, callback){
    // permitir llamadas desde el navegador (localhost:3000) y desde el servidor local
    if(!origin) return callback(null, true);
    if(origin.indexOf('localhost') !== -1) return callback(null, true);
    return callback(null, true);
  }
}));
app.use(express.json()); // Permite al servidor entender datos en formato JSON

// 4. Configuración de la conexión a la base de datos
// Usa las credenciales que me proporcionaste.
const db = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "viopreventfnn"
});

// 5. Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado exitosamente a la base de datos MySQL "viopreventfn"');
});

// 6. Definición de las rutas de la API (los "endpoints")

// --- API para Alumnos ---
// GET: Obtener todos los alumnos (de todas las tablas de grupos) - ESTA RUTA YA NO ES IDEAL, PERO LA MANTENEMOS POR AHORA
app.get('/api/alumnos', (req, res) => {
  // ... (el código existente se mantiene pero no lo usaremos)
  res.json([]); // Devolvemos un array vacío para no cargar todo por defecto
});

// NUEVA RUTA - GET: Obtener los alumnos de UN grupo específico
app.get('/api/alumnos/:grupoId', (req, res) => {
  const grupoId = req.params.grupoId;
  // Validamos el nombre de la tabla para evitar inyección SQL
  // Si viene en el formato 'grupo_XXX' intentamos leer esa tabla.
  if (grupoId.startsWith('grupo_')) {
    const sql = `SELECT * FROM \`${grupoId}\``; // Intentamos leer la tabla específica
    db.query(sql, (err, results) => {
      if (err) {
        // Si la tabla no existe, hacemos fallback a la tabla central `alumnos`
        // donde guardamos todos los alumnos en una columna `grupo_id` (si aplica).
        console.warn(`No se pudo leer tabla ${grupoId}, intentando tabla central 'alumnos':`, err.code || err);
        const numericPart = grupoId.replace(/^grupo_/, '');
        // Intentamos encontrar por grupo_id (si usan ids internos) o por matricula
        const fallbackSql = `SELECT * FROM alumnos WHERE grupo_id = ? OR matricula LIKE ?`;
        db.query(fallbackSql, [numericPart, `%${numericPart}%`], (err2, results2) => {
          if (err2) {
            console.error('Error al obtener alumnos desde tabla central:', err2);
            return res.status(500).send(`Error al obtener los datos del grupo ${grupoId}`);
          }
          return res.json(results2);
        });
        return;
      }
      return res.json(results);
    });
    return;
  }

  // Si no viene con prefijo 'grupo_', asumimos que es un id numérico de grupo y buscamos en la tabla `alumnos`.
  const numericId = grupoId;
  const sql2 = `SELECT * FROM alumnos WHERE grupo_id = ?`;
  db.query(sql2, [numericId], (err, results) => {
    if (err) {
      console.error('Error al obtener alumnos por grupo desde tabla central:', err);
      return res.status(500).send(`Error al obtener los datos del grupo ${grupoId}`);
    }
    res.json(results);
  });
});

// POST: Añadir un nuevo alumno a un grupo específico
app.post('/api/alumnos/:grupoId', (req, res) => {
  const { grupoId } = req.params;
  const studentData = req.body;

  // Validamos el nombre de la tabla para evitar inyección SQL
  // Si viene en formato grupo_XXX intentamos insertar en esa tabla
  if (grupoId.startsWith('grupo_')) {
    const sql = `INSERT INTO \`${grupoId}\` (nombre, edad, promedio) VALUES (?, ?, ?)`;
    db.query(sql, [studentData.nombre, studentData.edad || null, studentData.promedio || null], (err, result) => {
      if (err) {
        // Si la tabla no existe, hacemos fallback a insertar en la tabla central `alumnos`
        console.warn(`No se pudo insertar en tabla ${grupoId}, intentando tabla central 'alumnos':`, err.code || err);
        const numericPart = grupoId.replace(/^grupo_/, '');
        const fallbackSql = `INSERT INTO alumnos (nombre, apellido_paterno, apellido_materno, matricula, grupo_id) VALUES (?, ?, ?, ?, ?)`;
        db.query(fallbackSql, [studentData.nombre, studentData.apellido_paterno || null, studentData.apellido_materno || null, studentData.matricula || null, numericPart], (err2, result2) => {
          if (err2) {
            console.error('Error al insertar alumno en tabla central:', err2);
            return res.status(500).send(`Error al guardar el alumno en el grupo ${grupoId}`);
          }
          return res.status(201).json({ id: result2.insertId, nombre: studentData.nombre, apellido_paterno: studentData.apellido_paterno, apellido_materno: studentData.apellido_materno, matricula: studentData.matricula, grupo_id: numericPart });
        });
        return;
      }
      return res.status(201).json({ id: result.insertId, nombre: studentData.nombre, edad: studentData.edad, promedio: studentData.promedio });
    });
    return;
  }

  // Si no viene con prefijo 'grupo_', insertamos en la tabla central `alumnos` con grupo_id
  const numericId = grupoId;
  const sql2 = `INSERT INTO alumnos (nombre, apellido_paterno, apellido_materno, matricula, grupo_id) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql2, [studentData.nombre, studentData.apellido_paterno || null, studentData.apellido_materno || null, studentData.matricula || null, numericId], (err, result) => {
    if (err) {
      console.error('Error al insertar alumno en tabla central:', err);
      return res.status(500).send('Error al guardar el alumno.');
    }
    res.status(201).json({ id: result.insertId, nombre: studentData.nombre, apellido_paterno: studentData.apellido_paterno, apellido_materno: studentData.apellido_materno, matricula: studentData.matricula, grupo_id: numericId });
  });
});

// PUT: Actualizar un alumno existente
app.put('/api/alumnos/:grupoId/:alumnoId', (req, res) => {
  const { grupoId, alumnoId } = req.params;
  const { nombre, edad, promedio } = req.body;

  if (!grupoId.startsWith('grupo_')) {
    return res.status(400).send('Nombre de grupo no válido.');
  }
  // Intentamos actualizar la tabla específica del grupo. Si falla (por ejemplo no existe), actualizamos la tabla central `alumnos`.
  const sql = `UPDATE \`${grupoId}\` SET nombre = ? WHERE id = ?`;

  db.query(sql, [nombre, alumnoId], (err, result) => {
    if (err) {
      console.warn(`No se pudo actualizar tabla ${grupoId}, intentando tabla central 'alumnos':`, err.code || err);
      // fallback: actualizar registro en tabla central `alumnos`
      const sql2 = `UPDATE alumnos SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, matricula = ? WHERE id = ?`;
      const { apellido_paterno, apellido_materno, matricula } = req.body;
      db.query(sql2, [nombre, apellido_paterno || null, apellido_materno || null, matricula || null, alumnoId], (err2, result2) => {
        if (err2) {
          console.error('Error al actualizar alumno en tabla central:', err2);
          return res.status(500).send('Error al actualizar el alumno.');
        }
        if (result2.affectedRows === 0) {
          return res.status(404).send('Alumno no encontrado.');
        }
        return res.json({ message: 'Alumno actualizado correctamente (central)' });
      });
      return;
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Alumno no encontrado.');
    }
    res.json({ message: 'Alumno actualizado correctamente' });
  });
});

// DELETE: Eliminar un alumno
app.delete('/api/alumnos/:grupoId/:alumnoId', (req, res) => {
  const { grupoId, alumnoId } = req.params;

  if (!grupoId.startsWith('grupo_')) {
    return res.status(400).send('Nombre de grupo no válido.');
  }
  // Intentamos eliminar de la tabla del grupo; si falla, intentamos eliminar de la tabla central `alumnos`.
  const sql = `DELETE FROM \`${grupoId}\` WHERE id = ?`;

  db.query(sql, [alumnoId], (err, result) => {
    if (err) {
      console.warn(`No se pudo eliminar de tabla ${grupoId}, intentando tabla central 'alumnos':`, err.code || err);
      const sql2 = `DELETE FROM alumnos WHERE id = ?`;
      db.query(sql2, [alumnoId], (err2, result2) => {
        if (err2) {
          console.error('Error al eliminar alumno en tabla central:', err2);
          return res.status(500).send('Error al eliminar el alumno.');
        }
        if (result2.affectedRows === 0) {
          return res.status(404).send('Alumno no encontrado.');
        }
        return res.json({ message: 'Alumno eliminado correctamente (central)' });
      });
      return;
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Alumno no encontrado.');
    }
    res.json({ message: 'Alumno eliminado correctamente' });
  });
});


// --- API para Salones ---
// GET: Obtener todos los salones (basado en las tablas existentes)
app.get('/api/salones', (req, res) => {
  const sql = "SHOW TABLES LIKE 'grupo_%'";
  db.query(sql, (err, tables) => {
    if (err) {
      return res.status(500).send('Error al obtener la lista de grupos');
    }

    if (tables.length === 0) {
      return res.json([]);
    }

    const tableNames = tables.map(row => Object.values(row)[0]);

    const countQueries = tableNames.map(tableName => {
      return `SELECT '${tableName}' AS grupoId, COUNT(*) AS numAlumnos FROM \`${tableName}\``;
    });

    const finalSql = countQueries.join(' UNION ALL ');

    db.query(finalSql, (err, results) => {
      if (err) {
        return res.status(500).send('Error al contar los alumnos');
      }
      
      const salones = results.map(row => ({
          id: row.grupoId,
          grupo: row.grupoId.replace('grupo_', ''),
          alumnos: row.numAlumnos
      }));

      res.json(salones);
    });
  });
});

// POST: Crear un nuevo salón (grupo)
app.post('/api/salones', (req, res) => {
  const { grupo } = req.body;

  if (!grupo) {
    return res.status(400).send('El nombre del grupo es requerido.');
  }

  // Limpiamos y formateamos el nombre del grupo para que sea un nombre de tabla válido
  const nombreTabla = `grupo_${grupo.trim().replace(/\s+/g, '_')}`;

  // Creamos la nueva tabla para el grupo
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS \`${nombreTabla}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      edad INT,
      promedio DECIMAL(5, 2)
      // Puedes añadir más campos aquí si lo necesitas
    );
  `;

  db.query(createTableSql, (err, result) => {
    if (err) {
      console.error("Error al crear la tabla del grupo:", err);
      return res.status(500).send('Error al crear el nuevo grupo.');
    }
    res.status(201).json({ message: `Grupo '${grupo}' creado exitosamente como tabla '${nombreTabla}'.` });
  });
});


// --- API para Reportes ---
// GET: Obtener todos los reportes
app.get('/api/reportes', (req, res) => {
  const sql = "SELECT * FROM reportes";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los reportes');
      return;
    }
    res.json(results);
  });
});

// Nuevas rutas para obtener datos relacionados con un reporte específico
app.get('/api/reportes/:id/testigos', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM testigos WHERE id_reporte = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los testigos del reporte');
      return;
    }
    res.json(results);
  });
});

app.get('/api/reportes/:id/victimas', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM victimas WHERE id_reporte = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener las víctimas del reporte');
      return;
    }
    res.json(results);
  });
});

app.get('/api/reportes/:id/victimarios', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM victimarios WHERE id_reporte = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los victimarios del reporte');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener orientadores
app.get('/api/orientadores', (req, res) => {
  const sql = "SELECT * FROM orientadores";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los orientadores');
      return;
    }
    res.json(results);
  });
});

// --- API para Responsables ---
app.get('/api/responsables', (req, res) => {
  const sql = "SELECT * FROM responsables";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los responsables');
      return;
    }
    res.json(results);
  });
});

// --- API para Testigos ---
app.get('/api/testigos', (req, res) => {
  const sql = "SELECT * FROM testigos";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los testigos');
      return;
    }
    res.json(results);
  });
});

// --- API para Victimarios ---
app.get('/api/victimarios', (req, res) => {
  const sql = "SELECT * FROM victimarios";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los victimarios');
      return;
    }
    res.json(results);
  });
});

// --- API para Victimas ---
app.get('/api/victimas', (req, res) => {
  const sql = "SELECT * FROM victimas";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener las víctimas');
      return;
    }
    res.json(results);
  });
});

// --- API para Reportes Detallados ---
app.get('/api/reportes-detallados', (req, res) => {
  const sql = `
    SELECT 
      r.id_reporte, r.fecha, r.hora, r.lugar, r.descripcion, r.id_orientador,
      v.nombre AS nombre_victima, v.grado AS grado_victima, v.grupo AS grupo_victima,
      vm.nombre AS nombre_victimario, vm.grado AS grado_victimario, vm.grupo AS grupo_victimario,
      t.nombre AS nombre_testigo, t.grado AS grado_testigo, t.grupo AS grupo_testigo
    FROM reportes r
    LEFT JOIN victimas v ON r.id_victima = v.id_victima
    LEFT JOIN victimarios vm ON r.id_victimario = vm.id_victimario
    LEFT JOIN testigos t ON r.id_testigo = t.id_testigo
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener los reportes detallados:", err);
      res.status(500).send('Error al obtener los reportes detallados');
      return;
    }
    res.json(results);
  });
});


// 7. Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port} (aceptando conexiones locales)`);
});
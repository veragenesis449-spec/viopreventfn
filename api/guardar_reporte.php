<?php
// Permitir solicitudes desde el origen de desarrollo de React
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar la solicitud de pre-vuelo (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Las cabeceras CORS ahora se manejan en el archivo .htaccess

// Conexión a la base de datos
$servername = "localhost";
$username = "root"; // Cambia esto si tu usuario de MySQL es diferente
$password = ""; // Cambia esto si tienes una contraseña para MySQL
$dbname = "viopreventfnn";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener los datos del cuerpo de la petición (enviados como JSON desde React)
$data = json_decode(file_get_contents("php://input"), true);

// Validar que los datos necesarios están presentes
if (
    !isset($data['iniciales']) ||
    !isset($data['grupo']) ||
    !isset($data['gravedad']) ||
    !isset($data['descripcion'])
) {
    http_response_code(400); // Bad Request
    echo json_encode(["mensaje" => "Datos incompletos. Por favor, llena todos los campos obligatorios."]);
    exit();
}

// Asignar datos a variables
$iniciales = $data['iniciales'];
$grupo = $data['grupo'];
$edad = isset($data['edad']) ? $data['edad'] : null;
$genero = isset($data['genero']) ? $data['genero'] : '';
$nivel_gravedad = $data['gravedad'];
$descripcion = $data['descripcion'];
$fecha_reporte = date('Y-m-d H:i:s'); // Fecha y hora actual

// Preparar la sentencia SQL para insertar en la tabla 'reportes'
$stmt = $conn->prepare("INSERT INTO reportes (iniciales, grupo, edad, genero, nivel_gravedad, descripcion, fecha_reporte) VALUES (?, ?, ?, ?, ?, ?, ?)");

if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error al preparar la consulta: " . $conn->error]);
    exit();
}

// Vincular parámetros
// 'ssissss' significa: string, string, integer, string, string, string, string
$stmt->bind_param("ssissss", $iniciales, $grupo, $edad, $genero, $nivel_gravedad, $descripcion, $fecha_reporte);

// Ejecutar la sentencia
if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(["mensaje" => "Reporte guardado exitosamente."]);
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(["mensaje" => "Error al guardar el reporte: " . $stmt->error]);
}

// Cerrar la sentencia y la conexión
$stmt->close();
$conn->close();
?>
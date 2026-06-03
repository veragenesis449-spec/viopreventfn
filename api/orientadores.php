<?php
// Cabeceras CORS más específicas y robustas
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Manejar la solicitud de pre-vuelo (preflight) de OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = ""; // Tu contraseña de MySQL si la tienes
$dbname = "viopreventfnn";

// Crear conexión
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error de conexión a la base de datos: " . $e->getMessage()]);
    exit();
}

// Consulta SQL para obtener todos los orientadores
$sql = "SELECT * FROM orientadores";
$result = $conn->query($sql);

if ($result) {
    $orientadores = array();
    while($row = $result->fetch_assoc()) {
        $orientadores[] = $row;
    }
    http_response_code(200);
    echo json_encode($orientadores);
} else {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error al ejecutar la consulta: " . $conn->error]);
}

// Cerrar la conexión
$conn->close();
?>
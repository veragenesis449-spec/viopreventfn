<?php
// Cabeceras CORS CORRECTAS
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar la solicitud de pre-vuelo (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
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

// Consulta SQL para obtener los nombres de las tablas de grupos
$sql = "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME LIKE 'grupo_%'";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $dbname);
$stmt->execute();
$result = $stmt->get_result();

if ($result) {
    $grupos = array();
    while($row = $result->fetch_assoc()) {
        $grupos[] = $row;
    }
    http_response_code(200);
    echo json_encode($grupos);
} else {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error al ejecutar la consulta para contar los grupos."]);
}

// Cerrar la sentencia y la conexión
$stmt->close();
$conn->close();
?>
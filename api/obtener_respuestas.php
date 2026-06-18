<?php
// Devuelve las respuestas de los cuestionarios con datos del reporte
header("Content-Type: application/json; charset=UTF-8");
// Permitir CORS (usar misma lista que otros endpoints)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "viopreventfnn";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error de conexión a la base de datos: " . $e->getMessage()]);
    exit();
}

// Hacer JOIN para traer respuestas con información del reporte
$sql = "SELECT r.id_reporte AS id_reporte, r.iniciales, r.grupo, r.edad, r.genero, r.nivel_gravedad, rr.id_respuesta AS id_respuesta, rr.pregunta, rr.respuesta
    FROM reportes r
    JOIN respuestas_reporte rr ON rr.id_reporte = r.id_reporte
    ORDER BY r.id_reporte DESC, rr.id_respuesta ASC";

try {
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error al obtener respuestas: " . $e->getMessage()]);
} finally {
    $conn->close();
}

?>

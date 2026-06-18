<?php
// Permitir solicitudes desde el origen de desarrollo de React
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "viopreventfnn";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta para obtener todos los reportes, incluyendo el nivel de gravedad y área si existe
$areaCol = '';
$resCols = $conn->query("SHOW COLUMNS FROM reportes LIKE 'area'");
if ($resCols && $resCols->num_rows > 0) {
    $areaCol = ', area';
}
$sql = "SELECT id_reporte, descripcion, fecha_reporte, nivel_gravedad" . $areaCol . " FROM reportes ORDER BY fecha_reporte DESC";
$result = $conn->query($sql);

$reportes = [];

if ($result->num_rows > 0) {
    // Guardar cada fila en el array de reportes
    while($row = $result->fetch_assoc()) {
        $reportes[] = $row;
    }
}

// Devolver los reportes en formato JSON
header('Content-Type: application/json');
echo json_encode($reportes);

$conn->close();
?>
<?php
header('Content-Type: application/json');
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "viopreventfnn";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8mb4');
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}

$result = $conn->query('SHOW COLUMNS FROM respuestas_reporte');
$cols = [];
while ($r = $result->fetch_assoc()) $cols[] = $r;
echo json_encode($cols);
$conn->close();
?>

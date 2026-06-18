<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'viopreventfnn';

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(['error' => 'Error de conexión a la base de datos']);
  exit;
}
$conn->set_charset('utf8mb4');

$grupo = isset($_GET['grupo']) ? trim($_GET['grupo']) : '';

// Revisar si la columna 'grupo' existe en victimas
$resCols = $conn->query("SHOW COLUMNS FROM victimas LIKE 'grupo'");
$hasGrupoCol = ($resCols && $resCols->num_rows > 0);

try {
  if ($grupo !== '' && $hasGrupoCol) {
    $stmt = $conn->prepare('SELECT * FROM victimas WHERE grupo = ? ORDER BY id_victima DESC');
    $stmt->bind_param('s', $grupo);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    echo json_encode($rows);
    $conn->close();
    exit;
  }

  // Fallback: devolver todas las víctimas
  $result = $conn->query('SELECT * FROM victimas ORDER BY id_victima DESC');
  $rows = [];
  if ($result) {
    while ($r = $result->fetch_assoc()) $rows[] = $r;
  }
  echo json_encode($rows);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
} finally {
  $conn->close();
}

?>

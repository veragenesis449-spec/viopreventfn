<?php
// Guardar una víctima reportada por orientador
header('Content-Type: application/json; charset=UTF-8');
// Permitir desde el front-end local
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['error' => 'JSON inválido']);
  exit;
}

$victima = trim($data['victima'] ?? '');
$victimario = trim($data['victimario'] ?? '');
$tipo = trim($data['tipo_violencia'] ?? '');
$descripcion = trim($data['descripcion'] ?? '');
$grupo = trim($data['grupo'] ?? '');

if ($victima === '') {
  http_response_code(400);
  echo json_encode(['error' => 'El nombre de la víctima es obligatorio']);
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

try {
  // Detectar columnas existentes en la tabla `victimas`
  $colsRes = $conn->query("SHOW COLUMNS FROM victimas");
  $cols = [];
  if ($colsRes) {
    while ($r = $colsRes->fetch_assoc()) {
      $cols[] = $r['Field'];
    }
  }

  $col_nombre = in_array('nombre', $cols) ? 'nombre' : (in_array('victima', $cols) ? 'victima' : null);
  $col_victimario = in_array('victimario', $cols) ? 'victimario' : (in_array('victimario_nombre', $cols) ? 'victimario_nombre' : null);
  $col_tipo = in_array('tipo_violencia', $cols) ? 'tipo_violencia' : (in_array('tipo', $cols) ? 'tipo' : null);
  $col_descripcion = in_array('descripcion', $cols) ? 'descripcion' : (in_array('detalle', $cols) ? 'detalle' : null);
  $col_grupo = in_array('grupo', $cols) ? 'grupo' : null;

  $insertCols = [];
  $placeholders = [];
  $values = [];
  $types = '';

  if ($col_nombre) { $insertCols[] = $col_nombre; $placeholders[] = '?'; $values[] = $victima; $types .= 's'; }
  if ($col_victimario) { $insertCols[] = $col_victimario; $placeholders[] = '?'; $values[] = $victimario; $types .= 's'; }
  if ($col_tipo) { $insertCols[] = $col_tipo; $placeholders[] = '?'; $values[] = $tipo; $types .= 's'; }
  if ($col_descripcion) { $insertCols[] = $col_descripcion; $placeholders[] = '?'; $values[] = $descripcion; $types .= 's'; }
  if ($col_grupo && $grupo !== '') { $insertCols[] = $col_grupo; $placeholders[] = '?'; $values[] = $grupo; $types .= 's'; }

  if (count($insertCols) === 0) {
    throw new Exception('No hay columnas válidas en la tabla victimas para insertar.');
  }

  $sql = 'INSERT INTO victimas (' . implode(', ', $insertCols) . ') VALUES (' . implode(', ', $placeholders) . ')';
  $stmt = $conn->prepare($sql);
  if ($stmt === false) throw new Exception($conn->error);

  $bindParams = [];
  $bindParams[] = $types;
  for ($i = 0; $i < count($values); $i++) {
    $bindParams[] = &$values[$i];
  }
  call_user_func_array([$stmt, 'bind_param'], $bindParams);
  $stmt->execute();
  $insertId = $stmt->insert_id;
  $stmt->close();
  echo json_encode(['ok' => true, 'id_victima' => $insertId]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Error al guardar la víctima: ' . $e->getMessage()]);
} finally {
  $conn->close();
}

?>

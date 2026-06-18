<?php
// CORS: lista blanca de orígenes (incluye entornos de desarrollo)
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
// Asegurarse de eliminar cualquier header previo que pudiera haber sido agregado
header_remove('Access-Control-Allow-Origin');
header_remove('Access-Control-Allow-Credentials');
if ($origin && in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: " . $origin, true);
    header("Access-Control-Allow-Credentials: true", true);
} else {
    header("Access-Control-Allow-Origin: *", true);
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Responder preflight
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

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["mensaje" => "JSON inválido o no enviado."]);
    $conn->close();
    exit();
}

$iniciales = trim($data['iniciales'] ?? '');
$grupo = trim($data['grupo'] ?? '');
$edad = isset($data['edad']) && $data['edad'] !== '' ? (int) $data['edad'] : null;
$genero = trim($data['genero'] ?? '');
$nivel_gravedad = trim($data['gravedad'] ?? '');
$descripcion = trim($data['descripcion'] ?? '');
$area = trim($data['area'] ?? '');
$evidencia = $data['evidencia'] ?? [];
$respuestas = $data['respuestasDinamicas'] ?? [];

if ($iniciales === '' || $grupo === '' || $nivel_gravedad === '' || $descripcion === '') {
    http_response_code(400);
    echo json_encode(["mensaje" => "Campos obligatorios faltantes."]);
    $conn->close();
    exit();
}

$fecha_reporte = date('Y-m-d H:i:s');

$evidenciasSeleccionadas = [];
foreach (['fotos' => 'Fotos', 'videos' => 'Videos', 'documentos' => 'Documentos', 'testigos' => 'Testigos'] as $clave => $etiqueta) {
    if (!empty($evidencia[$clave])) $evidenciasSeleccionadas[] = $etiqueta;
}

$descripcion_ampliada = $descripcion . "\nEvidencia: " . (!empty($evidenciasSeleccionadas) ? implode(', ', $evidenciasSeleccionadas) : 'Ninguna');

try {
    $conn->begin_transaction();

    // Insertar reporte
    // Comprobar si la columna 'area' existe en la tabla 'reportes'
    $colExists = false;
    $resCols = $conn->query("SHOW COLUMNS FROM reportes LIKE 'area'");
    if ($resCols && $resCols->num_rows > 0) {
        $colExists = true;
    } else {
        // Intentar crear la columna 'area' si no existe (operación segura si no existe)
        try {
            $conn->query("ALTER TABLE reportes ADD COLUMN area VARCHAR(255) DEFAULT NULL");
            $colExists = true;
        } catch (Exception $ex) {
            // No se pudo crear la columna: continuamos sin ella (el valor no se guardará)
            $colExists = false;
        }
    }

    if ($colExists) {
        $stmt = $conn->prepare("INSERT INTO reportes (iniciales, grupo, edad, genero, nivel_gravedad, descripcion, fecha_reporte, area) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        if ($stmt === false) throw new Exception($conn->error);
        // bind (edad puede ser NULL)
        $stmt->bind_param('ssisssss', $iniciales, $grupo, $edad, $genero, $nivel_gravedad, $descripcion_ampliada, $fecha_reporte, $area);
    } else {
        $stmt = $conn->prepare("INSERT INTO reportes (iniciales, grupo, edad, genero, nivel_gravedad, descripcion, fecha_reporte) VALUES (?, ?, ?, ?, ?, ?, ?)");
        if ($stmt === false) throw new Exception($conn->error);
        // bind (edad puede ser NULL)
        $stmt->bind_param('ssissss', $iniciales, $grupo, $edad, $genero, $nivel_gravedad, $descripcion_ampliada, $fecha_reporte);
    }
    $stmt->execute();
    $reporte_id = $stmt->insert_id;
    $stmt->close();

    // Insertar respuestas dinámicas
    if (is_array($respuestas) && count($respuestas) > 0) {
        $stmt_r = $conn->prepare("INSERT INTO respuestas_reporte (id_reporte, pregunta, respuesta) VALUES (?, ?, ?)");
        if ($stmt_r === false) throw new Exception($conn->error);

        foreach ($respuestas as $item) {
            $preg = isset($item['pregunta']) ? $item['pregunta'] : (isset($item[0]) ? $item[0] : '');
            $resp = isset($item['respuesta']) ? $item['respuesta'] : (isset($item[1]) ? $item[1] : '');
            $preg = trim((string)$preg);
            $resp = trim((string)$resp);
            if ($preg === '' && $resp === '') continue;
            $stmt_r->bind_param('iss', $reporte_id, $preg, $resp);
            $stmt_r->execute();
        }
        $stmt_r->close();
    }

    $conn->commit();
    http_response_code(201);
    // Respuesta de depuración: indicar si se guardó el área
    echo json_encode(["mensaje" => "Reporte guardado exitosamente.", "id_reporte" => $reporte_id, "area_recibida" => $area, "area_columna_creada" => $colExists]);

} catch (Exception $e) {
    if ($conn->in_transaction) $conn->rollback();
    http_response_code(500);
    echo json_encode(["mensaje" => "Error al guardar el reporte: " . $e->getMessage()]);
} finally {
    $conn->close();
}

?>

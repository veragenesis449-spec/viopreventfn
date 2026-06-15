<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "vioprevent";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error de conexión a la base de datos: " . $e->getMessage()]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (
    !is_array($data) ||
    empty(trim($data['iniciales'] ?? '')) ||
    empty(trim($data['grupo'] ?? '')) ||
    empty(trim($data['gravedad'] ?? '')) ||
    empty(trim($data['descripcion'] ?? ''))
) {
    http_response_code(400);
    echo json_encode(["mensaje" => "Datos incompletos. Por favor, llena todos los campos obligatorios."]);
    exit();
}

$iniciales = trim($data['iniciales']);
$grupo = trim($data['grupo']);
$edad = isset($data['edad']) && $data['edad'] !== '' ? (int) $data['edad'] : null;
$genero = trim($data['genero'] ?? '');
$gravedad = strtolower(trim($data['gravedad']));
$descripcionUsuario = trim($data['descripcion']);
$evidencia = $data['evidencia'] ?? [];
$respuestasDinamicas = $data['respuestasDinamicas'] ?? [];

$mapaTipos = [
    'baja' => 'Bullying',
    'media' => 'Acoso escolar',
    'alta' => 'Violencia grave'
];

$tipoViolencia = $mapaTipos[$gravedad] ?? 'Acoso escolar';
$fecha = date('Y-m-d');
$estado = 'Pendiente';

$evidenciasSeleccionadas = [];
foreach (['fotos' => 'Fotos', 'videos' => 'Videos', 'documentos' => 'Documentos', 'testigos' => 'Testigos'] as $clave => $etiqueta) {
    if (!empty($evidencia[$clave])) {
        $evidenciasSeleccionadas[] = $etiqueta;
    }
}

$lineasDescripcion = [
    "Iniciales: {$iniciales}",
    "Grupo: {$grupo}",
    "Edad: " . ($edad !== null ? $edad : 'No especificada'),
    "Género: " . ($genero !== '' ? $genero : 'No especificado'),
    "Nivel de gravedad: {$gravedad}",
    "Descripción del cuestionario: {$descripcionUsuario}",
    "Evidencia: " . (!empty($evidenciasSeleccionadas) ? implode(', ', $evidenciasSeleccionadas) : 'Sin evidencia seleccionada')
];

if (is_array($respuestasDinamicas) && !empty($respuestasDinamicas)) {
    $lineasDescripcion[] = "Respuestas adicionales:";
    foreach ($respuestasDinamicas as $pregunta => $respuesta) {
        $preguntaLimpia = str_replace('-', ' ', $pregunta);
        $lineasDescripcion[] = "- {$preguntaLimpia}: " . trim((string) $respuesta);
    }
}

$descripcionCompleta = implode("\n", $lineasDescripcion);

try {
    $stmt = $conn->prepare("
        INSERT INTO reportes (
            fecha,
            tipo_violencia,
            descripcion,
            estado,
            id_victima,
            id_victimario,
            id_testigo,
            id_responsable,
            id_orientador
        ) VALUES (?, ?, ?, ?, NULL, NULL, NULL, NULL, NULL)
    ");

    $stmt->bind_param("ssss", $fecha, $tipoViolencia, $descripcionCompleta, $estado);
    $stmt->execute();

    http_response_code(201);
    echo json_encode([
        "mensaje" => "Reporte guardado exitosamente en la tabla reportes.",
        "id_reporte" => $stmt->insert_id
    ]);

    $stmt->close();
    $conn->close();
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error al guardar el reporte: " . $e->getMessage()]);
}
?>

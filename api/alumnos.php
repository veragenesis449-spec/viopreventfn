<?php
// Limpiar cualquier salida de error o espacio en blanco anterior.
ob_clean();

// Cabeceras CORS - permitir orígenes locales (dev)
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if ($origin && preg_match('/localhost|127\.0\.0\.1/', $origin)) {
    header("Access-Control-Allow-Origin: " . $origin);
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

// (No mostrar errores en producción)

// Crear conexión
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset("utf8mb4");

    // Determinar qué tabla usar: preferir alumnos_gestionar si existe
    $table = 'alumnos';
    $chk = $conn->prepare("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? LIMIT 1");
    $tblName = 'alumnos_gestionar';
    $chk->bind_param('ss', $dbname, $tblName);
    $chk->execute();
    $tres = $chk->get_result();
    if ($tres && $tres->fetch_assoc()) {
        $table = 'alumnos_gestionar';
    }
    $chk->close();
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error de conexión a la base de datos: " . $e->getMessage()]);
    exit();
}

// Determinar ruta / parámetros desde PATH_INFO o REQUEST_URI
$path = '';
if (!empty($_SERVER['PATH_INFO'])) {
    $path = trim($_SERVER['PATH_INFO'], '/');
} else {
    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $scriptName = $_SERVER['SCRIPT_NAME'];
    if (strpos($requestUri, $scriptName) === 0) {
        $path = trim(substr($requestUri, strlen($scriptName)), '/');
    } else {
        // manejo cuando se llama como /api/alumnos/ (sin .php)
        $scriptBase = dirname($scriptName) . '/' . basename($scriptName, '.php');
        if (strpos($requestUri, $scriptBase) === 0) {
            $path = trim(substr($requestUri, strlen($scriptBase)), '/');
        }
    }
}

$segments = $path === '' ? [] : explode('/', $path);
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        if (count($segments) >= 1 && preg_match('/^grupo_/', $segments[0])) {
            // GET /api/alumnos/grupo_XXX -> devolver alumnos de ese grupo
            $grupoName = preg_replace('/^grupo_/', '', $segments[0]);
            // buscar el id real en la tabla grupos (columna nombre almacena '101','102',...)
            $gstmt = $conn->prepare("SELECT id FROM grupos WHERE nombre = ? LIMIT 1");
            $gstmt->bind_param("s", $grupoName);
            $gstmt->execute();
            $gres = $gstmt->get_result();
            if ($grow = $gres->fetch_assoc()) {
                $grupoFk = intval($grow['id']);
                $selSql = sprintf("SELECT * FROM `%s` WHERE grupo_id = ?", $conn->real_escape_string($table));
                $stmt = $conn->prepare($selSql);
                $stmt->bind_param("i", $grupoFk);
                $stmt->execute();
                $result = $stmt->get_result();
                $alumnos = array();
                while ($row = $result->fetch_assoc()) { $alumnos[] = $row; }
                http_response_code(200);
                echo json_encode($alumnos);
                $stmt->close();
            } else {
                // Si el grupo no existe, devolver array vacío
                http_response_code(200);
                echo json_encode([]);
            }
            $gstmt->close();
        } else {
            // GET /api/alumnos or unknown -> devolver todos (tabla preferida)
            $sqlAll = sprintf("SELECT * FROM `%s`", $conn->real_escape_string($table));
            $result = $conn->query($sqlAll);
            $alumnos = array();
            while($row = $result->fetch_assoc()) { $alumnos[] = $row; }
            http_response_code(200);
            echo json_encode($alumnos);
        }
    } elseif ($method === 'POST') {
        // POST /api/alumnos/grupo_XXX -> insertar alumno
        if (count($segments) >= 1 && preg_match('/^grupo_/', $segments[0])) {
            $grupoName = preg_replace('/^grupo_/', '', $segments[0]);
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) { http_response_code(400); echo json_encode(["mensaje" => "JSON inválido o vacío"]); exit; }

            $nombre = isset($input['nombre']) ? $input['nombre'] : '';
            $apellido_paterno = isset($input['apellido_paterno']) ? $input['apellido_paterno'] : '';
            $apellido_materno = isset($input['apellido_materno']) ? $input['apellido_materno'] : '';
            $matricula = isset($input['matricula']) ? $input['matricula'] : '';

            // buscar id real del grupo
            $gstmt = $conn->prepare("SELECT id FROM grupos WHERE nombre = ? LIMIT 1");
            $gstmt->bind_param("s", $grupoName);
            $gstmt->execute();
            $gres = $gstmt->get_result();
            if ($grow = $gres->fetch_assoc()) {
                $grupoFk = intval($grow['id']);
                $insSql = sprintf("INSERT INTO `%s` (grupo_id, nombre, apellido_paterno, apellido_materno, matricula) VALUES (?, ?, ?, ?, ?)", $conn->real_escape_string($table));
                $stmt = $conn->prepare($insSql);
                $stmt->bind_param("issss", $grupoFk, $nombre, $apellido_paterno, $apellido_materno, $matricula);
                $ok = $stmt->execute();
                if ($ok) {
                    $newId = $conn->insert_id;
                    http_response_code(201);
                    echo json_encode(["mensaje" => "Alumno creado", "id" => $newId]);
                } else {
                    http_response_code(500);
                    echo json_encode(["mensaje" => "Error al insertar: " . $stmt->error]);
                }
                $stmt->close();
            } else {
                http_response_code(400);
                echo json_encode(["mensaje" => "Grupo no encontrado: " . $grupoName]);
            }
            $gstmt->close();
        } else {
            http_response_code(400);
            echo json_encode(["mensaje" => "Ruta inválida para POST, se requiere /grupo_XXX"]);
        }
    } elseif ($method === 'PUT') {
        // PUT /api/alumnos/grupo_XXX/{id} -> actualizar alumno
        if (count($segments) >= 2 && preg_match('/^grupo_/', $segments[0]) && is_numeric($segments[1])) {
            $id = intval($segments[1]);
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) { http_response_code(400); echo json_encode(["mensaje" => "JSON inválido o vacío"]); exit; }

            $nombre = isset($input['nombre']) ? $input['nombre'] : '';
            $apellido_paterno = isset($input['apellido_paterno']) ? $input['apellido_paterno'] : '';
            $apellido_materno = isset($input['apellido_materno']) ? $input['apellido_materno'] : '';
            $matricula = isset($input['matricula']) ? $input['matricula'] : '';

            $updSql = sprintf("UPDATE `%s` SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, matricula = ? WHERE id = ?", $conn->real_escape_string($table));
            $stmt = $conn->prepare($updSql);
            $stmt->bind_param("ssssi", $nombre, $apellido_paterno, $apellido_materno, $matricula, $id);
            $ok = $stmt->execute();
            if ($ok) {
                http_response_code(200);
                echo json_encode(["mensaje" => "Alumno actualizado"]);
            } else {
                http_response_code(500);
                echo json_encode(["mensaje" => "Error al actualizar: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(["mensaje" => "Ruta inválida para PUT, se requiere /grupo_XXX/{id}"]);
        }
    } elseif ($method === 'DELETE') {
        // DELETE /api/alumnos/grupo_XXX/{id} -> eliminar alumno
        if (count($segments) >= 2 && preg_match('/^grupo_/', $segments[0]) && is_numeric($segments[1])) {
            $id = intval($segments[1]);
            $delSql = sprintf("DELETE FROM `%s` WHERE id = ?", $conn->real_escape_string($table));
            $stmt = $conn->prepare($delSql);
            $stmt->bind_param("i", $id);
            $ok = $stmt->execute();
            if ($ok) {
                http_response_code(200);
                echo json_encode(["mensaje" => "Alumno eliminado"]);
            } else {
                http_response_code(500);
                echo json_encode(["mensaje" => "Error al eliminar: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(["mensaje" => "Ruta inválida para DELETE, se requiere /grupo_XXX/{id}"]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["mensaje" => "Método no permitido"]);
    }
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error de base de datos: " . $e->getMessage()]);
}

// Cerrar la conexión
$conn->close();
?>
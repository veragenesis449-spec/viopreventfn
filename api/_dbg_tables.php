<?php
header('Content-Type: application/json; charset=UTF-8');
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "viopreventfnn";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) { echo json_encode(['error' => 'conn: '.$conn->connect_error]); exit; }
$res = [];
$tables = ['alumnos', 'grupos', 'alumnos_gestionar'];
foreach ($tables as $t) {
  $r = $conn->query("SHOW TABLES LIKE '". $conn->real_escape_string($t) ."'");
  if ($r && $r->num_rows > 0) {
    $desc = $conn->query("DESCRIBE `".$t."`");
    $cols = [];
    while($row = $desc->fetch_assoc()) { $cols[] = $row; }
    $rows = [];
    $qr = $conn->query("SELECT * FROM `".$t."` LIMIT 10");
    while($rr = $qr->fetch_assoc()) { $rows[] = $rr; }
    $res[$t] = ['exists' => true, 'structure' => $cols, 'rows_sample' => $rows];
  } else {
    $res[$t] = ['exists' => false];
  }
}
echo json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
$conn->close();
?>

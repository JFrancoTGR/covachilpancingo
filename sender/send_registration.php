<?php
// sender/send_registration.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// Helper para responder
function respond($code, $payload) {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  exit;
}

// === Leer JSON del body ===
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

// Validar JSON recibido
if (!is_array($data)) {
  respond(400, [
    'status' => 'error',
    'stage' => 'input',
    'message' => 'El cuerpo de la solicitud no es un JSON válido.',
    'raw' => $raw
  ]);
}

// Sanitización
$name          = trim($data['name'] ?? '');
$email         = trim($data['email'] ?? '');
$phoneIncoming = trim($data['phone'] ?? '');
$contactMethod = trim($data['contact_method'] ?? '');
$typeOfClient  = trim($data['type_of_client'] ?? '');
$lang          = trim($data['current_language'] ?? 'en');

// Validaciones mínimas
if ($name === '' || $email === '' || $phoneIncoming === '') {
  respond(422, [
    'status' => 'error',
    'stage' => 'validation',
    'message' => 'Faltan campos obligatorios: nombre, correo o teléfono.',
    'received' => compact('name', 'email', 'phoneIncoming')
  ]);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  respond(422, [
    'status' => 'error',
    'stage' => 'validation',
    'message' => 'El email proporcionado no es válido.',
    'received_email' => $email
  ]);
}

// Normalizar teléfono (solo dígitos)
$phone = preg_replace('/[^\d+]/', '', $phoneIncoming);

// Configuración API externo
$API_URL    = 'API_ENDPOINT';
$BEARER     = getenv('CAPISOFT_BEARER') ?: 'BEARER';
$PROJECT_ID = getenv('CAPISOFT_PROJECT_ID') ?: '5';
$PLATFORM   = 'web';
$createTime = 'NOW()';

// Payload principal
$payload = [
  'fullname'    => $name,
  'email'       => $email,
  'phone'       => $phone,
  'project'     => $PROJECT_ID,
  'create_time' => $createTime,
  'platform'    => $PLATFORM,
];

// Puedes agregar metadata si el API lo acepta
// $payload['notes'] = "type_of_client=$typeOfClient | contact_method=$contactMethod | lang=$lang";

// === Enviar con cURL ===
$ch = curl_init($API_URL);
curl_setopt_array($ch, [
  CURLOPT_POST           => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER     => [
    'Accept: application/json',
    'Content-Type: application/json',
    "Authorization: Bearer {$BEARER}",
  ],
  CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
  CURLOPT_TIMEOUT        => 15,
]);

$responseBody = curl_exec($ch);
$curlErr      = curl_error($ch);
$httpCode     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Error de transporte
if ($responseBody === false) {
  respond(502, [
    'status' => 'error',
    'stage' => 'transport',
    'message' => 'Fallo al conectar con el API externo.',
    'curl_error' => $curlErr
  ]);
}

// Intentar parsear respuesta
$apiJson = json_decode($responseBody, true);

// Respuesta exitosa
if ($httpCode >= 200 && $httpCode < 300) {
  respond(200, [
    'status' => 'success',
    'stage' => 'completed',
    'message' => 'Registro enviado correctamente al API externo.',
    'upstream' => [
      'http_code' => $httpCode,
      'body'      => $apiJson ?? $responseBody,
    ],
    'sent_payload' => $payload
  ]);
}

// Error desde el API externo
respond(502, [
  'status' => 'error',
  'stage' => 'upstream',
  'message' => 'El API externo devolvió un código no exitoso.',
  'http_code' => $httpCode,
  'response'  => $apiJson ?? $responseBody,
  'sent_payload' => $payload
]);

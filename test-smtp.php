<?php

echo "=== Testing SMTP Connection ===\n\n";

// Test port 587 (TLS)
echo "1. Testing port 587 (TLS):\n";
$fp587 = @fsockopen('smtp.gmail.com', 587, $errno, $errstr, 30);
if ($fp587) {
    echo "   ✅ Port 587 connected!\n";
    fclose($fp587);
} else {
    echo "   ❌ Port 587 failed: $errstr ($errno)\n";
}

echo "\n";

// Test port 465 (SSL)
echo "2. Testing port 465 (SSL):\n";
$fp465 = @fsockopen('ssl://smtp.gmail.com', 465, $errno, $errstr, 30);
if ($fp465) {
    echo "   ✅ Port 465 connected!\n";
    fclose($fp465);
} else {
    echo "   ❌ Port 465 failed: $errstr ($errno)\n";
}

echo "\n";

// Test dengan Swift Mailer (yang dipakai Laravel)
echo "3. Testing with stream_socket_client (seperti Laravel):\n";

$context = stream_context_create([
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true,
    ]
]);

$socket = @stream_socket_client(
    'smtp.gmail.com:587',
    $errno,
    $errstr,
    30,
    STREAM_CLIENT_CONNECT,
    $context
);

if ($socket) {
    echo "   ✅ stream_socket_client connected to port 587!\n";
    fclose($socket);
} else {
    echo "   ❌ stream_socket_client failed: $errstr ($errno)\n";
}

echo "\n";

// Test SSL socket
echo "4. Testing SSL socket (port 465):\n";
$socketSSL = @stream_socket_client(
    'ssl://smtp.gmail.com:465',
    $errno,
    $errstr,
    30,
    STREAM_CLIENT_CONNECT,
    $context
);

if ($socketSSL) {
    echo "   ✅ SSL socket connected to port 465!\n";
    fclose($socketSSL);
} else {
    echo "   ❌ SSL socket failed: $errstr ($errno)\n";
}

echo "\n";
echo "=== Stream Transports Available ===\n";
print_r(stream_get_transports());

echo "\n=== OpenSSL Info ===\n";
echo "OpenSSL loaded: " . (extension_loaded('openssl') ? 'YES ✅' : 'NO ❌') . "\n";
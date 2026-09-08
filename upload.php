<?php

if (!isset($_FILES['file'])) {
    die("No file uploaded.");
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    die("Upload failed.");
}

$destination = __DIR__ . "/uploads/" . basename($file['name']);

if (move_uploaded_file($file['tmp_name'], $destination)) {
    echo "Uploaded successfully.<br>";
    echo "File: " . htmlspecialchars($file['name']);
} else {
    echo "Could not save file.";
}

?>

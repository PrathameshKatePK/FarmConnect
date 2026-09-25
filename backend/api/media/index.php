<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once "../../config/database.php";
if ($_SERVER["REQUEST_METHOD"] === "GET" && !empty($_GET["id"])) {
    $media_id = $_GET["id"];
    $stmt = $conn->prepare(
        "SELECT
            id,
            user_id,
            product_id,
            file_name,
            file_path,
            file_type,
            mime_type,
            file_size,
            alt_text,
            created_at,
            updated_at
         FROM fc_media
         WHERE id = ?"
    );
    $stmt->bind_param("i", $media_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Media not found"
        ]);
        exit;
    }
    $media = $result->fetch_assoc();
    echo json_encode([
        "success" => true,
        "data" => $media
    ]);
    exit;
}
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $sql = "SELECT
                id,
                user_id,
                product_id,
                file_name,
                file_path,
                file_type,
                mime_type,
                file_size,
                alt_text,
                created_at,
                updated_at
            FROM fc_media
            ORDER BY id DESC";
    $result = $conn->query($sql);
    if (!$result) {
        echo json_encode([
            "success" => false,
            "message" => "Failed to fetch media",
            "error" => $conn->error
        ]);
        exit;
    }
    $media = [];
    while ($row = $result->fetch_assoc()) {
        $media[] = $row;
    }
    echo json_encode([
        "success" => true,
        "data" => $media
    ]);
    exit;
}
if (
    $_SERVER["REQUEST_METHOD"] === "POST" &&
    isset($_GET["action"]) &&
    $_GET["action"] === "upload"
) {
    if (!isset($_FILES["file"])) {
        echo json_encode([
            "success" => false,
            "message" => "File is required"
        ]);
        exit;
    }
    $file = $_FILES["file"];
    if ($file["error"] !== UPLOAD_ERR_OK) {
        echo json_encode([
            "success" => false,
            "message" => "File upload failed",
            "error_code" => $file["error"]
        ]);
        exit;
    }
    $max_size = 5 * 1024 * 1024; // 5 MB
    if ($file["size"] > $max_size) {
        echo json_encode([
            "success" => false,
            "message" => "File size must be less than 5 MB"
        ]);
        exit;
    }
    $allowed_types = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file(
        $finfo,
        $file["tmp_name"]
    );
    finfo_close($finfo);
    if (!in_array($mime_type, $allowed_types)) {
        echo json_encode([
            "success" => false,
            "message" => "Only JPG, PNG and WEBP images are allowed"
        ]);
        exit;
    }
    $extensions = [
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "image/webp" => "webp"
    ];
    $extension = $extensions[$mime_type];
    $file_name = uniqid("media_", true) . "." . $extension;
    $upload_directory =
        __DIR__ . "/../../uploads/media/";
    if (!is_dir($upload_directory)) {
        if (!mkdir($upload_directory, 0755, true)) {
            echo json_encode([
                "success" => false,
                "message" => "Failed to create upload directory"
            ]);
            exit;
        }
    }
    $destination =
        $upload_directory . $file_name;
    if (!move_uploaded_file(
        $file["tmp_name"],
        $destination
    )) {
        echo json_encode([
            "success" => false,
            "message" => "Failed to save uploaded file"
        ]);
        exit;
    }
    $file_path =
        "uploads/media/" . $file_name;
    $user_id = $_POST["user_id"] ?? null;
    $product_id = $_POST["product_id"] ?? null;
    $alt_text = $_POST["alt_text"] ?? null;
    $stmt = $conn->prepare(
        "INSERT INTO fc_media
        (
            user_id,
            product_id,
            file_name,
            file_path,
            file_type,
            mime_type,
            file_size,
            alt_text
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $file_type = "image";
    $file_size = $file["size"];
    $stmt->bind_param(
        "iissssis",
        $user_id,
        $product_id,
        $file_name,
        $file_path,
        $file_type,
        $mime_type,
        $file_size,
        $alt_text
    );
    if (!$stmt->execute()) {
        // Remove uploaded file if DB insert fails
        if (file_exists($destination)) {
            unlink($destination);
        }
        echo json_encode([
            "success" => false,
            "message" => "Failed to save media information",
            "error" => $stmt->error
        ]);
        exit;
    }
    echo json_encode([
        "success" => true,
        "message" => "File uploaded successfully",
        "media_id" => $stmt->insert_id,
        "file_name" => $file_name,
        "file_path" => $file_path,
        "mime_type" => $mime_type,
        "file_size" => $file_size
    ]);
    exit;
}
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(
        file_get_contents("php://input"),
        true
    );
    $user_id = $data["user_id"] ?? null;
    $product_id = $data["product_id"] ?? null;
    $file_name = $data["file_name"] ?? null;
    $file_path = $data["file_path"] ?? null;
    $file_type = $data["file_type"] ?? null;
    $mime_type = $data["mime_type"] ?? null;
    $file_size = $data["file_size"] ?? null;
    $alt_text = $data["alt_text"] ?? null;
    if (!$file_name || !$file_path) {
        echo json_encode([
            "success" => false,
            "message" => "File name and file path are required"
        ]);
        exit;
    }
    if ($user_id !== null) {
        $userCheck = $conn->prepare(
            "SELECT id
             FROM fc_users
             WHERE id = ?"
        );
        $userCheck->bind_param(
            "i",
            $user_id
        );
        $userCheck->execute();
        $userResult = $userCheck->get_result();
        if ($userResult->num_rows === 0) {
            echo json_encode([
                "success" => false,
                "message" => "User not found"
            ]);
            exit;
        }
    }
    if ($product_id !== null) {
        $productCheck = $conn->prepare(
            "SELECT id
             FROM fc_products
             WHERE id = ?"
        );
        $productCheck->bind_param(
            "i",
            $product_id
        );
        $productCheck->execute();
        $productResult = $productCheck->get_result();
        if ($productResult->num_rows === 0) {
            echo json_encode([
                "success" => false,
                "message" => "Product not found"
            ]);
            exit;
        }
    }
    $stmt = $conn->prepare(
        "INSERT INTO fc_media
        (
            user_id,
            product_id,
            file_name,
            file_path,
            file_type,
            mime_type,
            file_size,
            alt_text
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
        "iissssis",
        $user_id,
        $product_id,
        $file_name,
        $file_path,
        $file_type,
        $mime_type,
        $file_size,
        $alt_text
    );
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Media created successfully",
            "media_id" => $stmt->insert_id
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to create media",
            "error" => $stmt->error
        ]);
    }
    exit;
}
if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $media_id = $_GET["id"] ?? null;
    if (!$media_id) {
        echo json_encode([
            "success" => false,
            "message" => "Media ID is required"
        ]);
        exit;
    }
    $mediaCheck = $conn->prepare(
        "SELECT id
         FROM fc_media
         WHERE id = ?"
    );
    $mediaCheck->bind_param(
        "i",
        $media_id
    );
    $mediaCheck->execute();
    $mediaResult = $mediaCheck->get_result();
    if ($mediaResult->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Media not found"
        ]);
        exit;
    }
    $data = json_decode(
        file_get_contents("php://input"),
        true
    );
    $user_id = $data["user_id"] ?? null;
    $product_id = $data["product_id"] ?? null;
    $file_name = $data["file_name"] ?? null;
    $file_path = $data["file_path"] ?? null;
    $file_type = $data["file_type"] ?? null;
    $mime_type = $data["mime_type"] ?? null;
    $file_size = $data["file_size"] ?? null;
    $alt_text = $data["alt_text"] ?? null;
    if (!$file_name || !$file_path) {
        echo json_encode([
            "success" => false,
            "message" => "File name and file path are required"
        ]);
        exit;
    }
    if ($user_id !== null) {
        $userCheck = $conn->prepare(
            "SELECT id
             FROM fc_users
             WHERE id = ?"
        );
        $userCheck->bind_param(
            "i",
            $user_id
        );
        $userCheck->execute();
        $userResult = $userCheck->get_result();
        if ($userResult->num_rows === 0) {
            echo json_encode([
                "success" => false,
                "message" => "User not found"
            ]);
            exit;
        }
    }
    if ($product_id !== null) {
        $productCheck = $conn->prepare(
            "SELECT id
             FROM fc_products
             WHERE id = ?"
        );
        $productCheck->bind_param(
            "i",
            $product_id
        );
        $productCheck->execute();
        $productResult = $productCheck->get_result();
        if ($productResult->num_rows === 0) {
            echo json_encode([
                "success" => false,
                "message" => "Product not found"
            ]);
            exit;
        }
    }
    $stmt = $conn->prepare(
        "UPDATE fc_media
         SET
            user_id = ?,
            product_id = ?,
            file_name = ?,
            file_path = ?,
            file_type = ?,
            mime_type = ?,
            file_size = ?,
            alt_text = ?
         WHERE id = ?"
    );
    $stmt->bind_param(
        "iissssisi",
        $user_id,
        $product_id,
        $file_name,
        $file_path,
        $file_type,
        $mime_type,
        $file_size,
        $alt_text,
        $media_id
    );
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Media updated successfully",
            "media_id" => $media_id
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to update media",
            "error" => $stmt->error
        ]);
    }
    exit;
}
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $media_id = $_GET["id"] ?? null;
    if (!$media_id) {
        echo json_encode([
            "success" => false,
            "message" => "Media ID is required"
        ]);
        exit;
    }
    $mediaCheck = $conn->prepare(
        "SELECT
            id,
            file_path
         FROM fc_media
         WHERE id = ?"
    );
    $mediaCheck->bind_param(
        "i",
        $media_id
    );
    $mediaCheck->execute();
    $mediaResult = $mediaCheck->get_result();
    if ($mediaResult->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Media not found"
        ]);
        exit;
    }
    $media = $mediaResult->fetch_assoc();
    $file_path = $media["file_path"];
    $physical_path =
        __DIR__ . "/../../" . $file_path;
    $conn->begin_transaction();
    try {
        $stmt = $conn->prepare(
            "DELETE FROM fc_media
             WHERE id = ?"
        );
        $stmt->bind_param(
            "i",
            $media_id
        );
        if (!$stmt->execute()) {
            throw new Exception(
                "Failed to delete media record"
            );
        }
        if (file_exists($physical_path)) {
            if (!unlink($physical_path)) {
                throw new Exception(
                    "Failed to delete physical file"
                );
            }
        }
        $conn->commit();
        echo json_encode([
            "success" => true,
            "message" => "Media and physical file deleted successfully",
            "media_id" => $media_id
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            "success" => false,
            "message" => $e->getMessage()
        ]);
    }
    exit;
}
echo json_encode([
    "success" => false,
    "message" => "Method not allowed"
]);
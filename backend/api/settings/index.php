<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";


/*
|--------------------------------------------------------------------------
| GET SETTINGS
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $id = isset($_GET["id"]) ? intval($_GET["id"]) : null;

    if ($id) {

        $stmt = $conn->prepare("
            SELECT
                id,
                setting_key,
                setting_value,
                setting_type,
                description,
                updated_at
            FROM fc_settings
            WHERE id = ?
        ");

        $stmt->bind_param("i", $id);
        $stmt->execute();

        $result = $stmt->get_result();
        $setting = $result->fetch_assoc();

        if (!$setting) {
            http_response_code(404);

            echo json_encode([
                "success" => false,
                "message" => "Setting not found"
            ]);

            exit;
        }

        echo json_encode([
            "success" => true,
            "data" => $setting
        ]);

        exit;
    }


    $result = $conn->query("
        SELECT
            id,
            setting_key,
            setting_value,
            setting_type,
            description,
            updated_at
        FROM fc_settings
        ORDER BY id ASC
    ");

    $settings = [];

    while ($row = $result->fetch_assoc()) {
        $settings[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $settings
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| CREATE SETTING
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $settingKey = trim($data["setting_key"] ?? "");
    $settingValue = $data["setting_value"] ?? null;
    $settingType = $data["setting_type"] ?? "TEXT";
    $description = $data["description"] ?? null;

    if ($settingKey === "") {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Setting key is required"
        ]);

        exit;
    }

    $allowedTypes = [
        "TEXT",
        "NUMBER",
        "BOOLEAN",
        "JSON"
    ];

    if (!in_array($settingType, $allowedTypes, true)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Invalid setting type"
        ]);

        exit;
    }


    $stmt = $conn->prepare("
        INSERT INTO fc_settings
        (
            setting_key,
            setting_value,
            setting_type,
            description
        )
        VALUES (?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "ssss",
        $settingKey,
        $settingValue,
        $settingType,
        $description
    );


    if (!$stmt->execute()) {

        if ($conn->errno === 1062) {
            http_response_code(409);

            echo json_encode([
                "success" => false,
                "message" => "Setting key already exists"
            ]);

            exit;
        }

        throw new Exception($stmt->error);
    }

    echo json_encode([
        "success" => true,
        "message" => "Setting created successfully",
        "setting_id" => $stmt->insert_id
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| UPDATE SETTING
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "PUT") {

    $id = isset($_GET["id"]) ? intval($_GET["id"]) : 0;

    if (!$id) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Setting ID is required"
        ]);

        exit;
    }


    $data = json_decode(file_get_contents("php://input"), true);

    $settingKey = trim($data["setting_key"] ?? "");
    $settingValue = $data["setting_value"] ?? null;
    $settingType = $data["setting_type"] ?? "TEXT";
    $description = $data["description"] ?? null;


    if ($settingKey === "") {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Setting key is required"
        ]);

        exit;
    }


    $allowedTypes = [
        "TEXT",
        "NUMBER",
        "BOOLEAN",
        "JSON"
    ];

    if (!in_array($settingType, $allowedTypes, true)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Invalid setting type"
        ]);

        exit;
    }


    $stmt = $conn->prepare("
        UPDATE fc_settings
        SET
            setting_key = ?,
            setting_value = ?,
            setting_type = ?,
            description = ?
        WHERE id = ?
    ");

    $stmt->bind_param(
        "ssssi",
        $settingKey,
        $settingValue,
        $settingType,
        $description,
        $id
    );


    if (!$stmt->execute()) {

        if ($conn->errno === 1062) {
            http_response_code(409);

            echo json_encode([
                "success" => false,
                "message" => "Setting key already exists"
            ]);

            exit;
        }

        throw new Exception($stmt->error);
    }


    if ($stmt->affected_rows === 0) {

        $check = $conn->prepare(
            "SELECT id FROM fc_settings WHERE id = ?"
        );

        $check->bind_param("i", $id);
        $check->execute();

        if (!$check->get_result()->fetch_assoc()) {

            http_response_code(404);

            echo json_encode([
                "success" => false,
                "message" => "Setting not found"
            ]);

            exit;
        }
    }


    echo json_encode([
        "success" => true,
        "message" => "Setting updated successfully",
        "setting_id" => $id
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| DELETE SETTING
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {

    $id = isset($_GET["id"]) ? intval($_GET["id"]) : 0;

    if (!$id) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Setting ID is required"
        ]);

        exit;
    }


    $stmt = $conn->prepare("
        DELETE FROM fc_settings
        WHERE id = ?
    ");

    $stmt->bind_param("i", $id);

    $stmt->execute();


    if ($stmt->affected_rows === 0) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Setting not found"
        ]);

        exit;
    }


    echo json_encode([
        "success" => true,
        "message" => "Setting deleted successfully",
        "setting_id" => $id
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| METHOD NOT ALLOWED
|--------------------------------------------------------------------------
*/

http_response_code(405);

echo json_encode([
    "success" => false,
    "message" => "Method not allowed"
]);
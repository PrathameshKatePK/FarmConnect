<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";


// =========================
// GET SINGLE LOCATION
// =========================

if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["id"])) {

    $location_id = $_GET["id"];

    $stmt = $conn->prepare(
        "SELECT
            id,
            state,
            district,
            taluka,
            village,
            pincode,
            latitude,
            longitude,
            status,
            created_at,
            updated_at
        FROM fc_locations
        WHERE id = ?"
    );

    $stmt->bind_param("i", $location_id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Location not found"
        ]);

        exit;
    }

    $location = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "data" => $location
    ]);

    exit;
}


// =========================
// GET ALL LOCATIONS
// =========================

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $sql = "SELECT
                id,
                state,
                district,
                taluka,
                village,
                pincode,
                latitude,
                longitude,
                status,
                created_at,
                updated_at
            FROM fc_locations
            ORDER BY id DESC";

    $result = $conn->query($sql);

    if (!$result) {

        echo json_encode([
            "success" => false,
            "message" => "Failed to fetch locations",
            "error" => $conn->error
        ]);

        exit;
    }

    $locations = [];

    while ($row = $result->fetch_assoc()) {
        $locations[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $locations
    ]);

    exit;
}


// =========================
// CREATE LOCATION
// =========================

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $state = $data["state"] ?? null;
    $district = $data["district"] ?? null;
    $taluka = $data["taluka"] ?? null;
    $village = $data["village"] ?? null;
    $pincode = $data["pincode"] ?? null;
    $latitude = $data["latitude"] ?? null;
    $longitude = $data["longitude"] ?? null;
    $status = $data["status"] ?? "ACTIVE";

    if (!$state || !$district || !$taluka || !$village) {

        echo json_encode([
            "success" => false,
            "message" => "State, district, taluka and village are required"
        ]);

        exit;
    }

    $stmt = $conn->prepare(
        "INSERT INTO fc_locations
        (
            state,
            district,
            taluka,
            village,
            pincode,
            latitude,
            longitude,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "sssssdds",
        $state,
        $district,
        $taluka,
        $village,
        $pincode,
        $latitude,
        $longitude,
        $status
    );

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Location created successfully",
            "location_id" => $stmt->insert_id
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to create location",
            "error" => $stmt->error
        ]);
    }

    exit;
}


// =========================
// UPDATE LOCATION
// =========================

if ($_SERVER["REQUEST_METHOD"] === "PUT") {

    $location_id = $_GET["id"] ?? null;

    if (!$location_id) {
        echo json_encode([
            "success" => false,
            "message" => "Location ID is required"
        ]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $state = $data["state"] ?? null;
    $district = $data["district"] ?? null;
    $taluka = $data["taluka"] ?? null;
    $village = $data["village"] ?? null;
    $pincode = $data["pincode"] ?? null;
    $latitude = $data["latitude"] ?? null;
    $longitude = $data["longitude"] ?? null;
    $status = $data["status"] ?? null;

    if (!$state || !$district || !$taluka || !$village || !$status) {
        echo json_encode([
            "success" => false,
            "message" => "State, district, taluka, village and status are required"
        ]);
        exit;
    }

    // Check location exists
    $locationCheck = $conn->prepare(
        "SELECT id FROM fc_locations WHERE id = ?"
    );

    $locationCheck->bind_param("i", $location_id);
    $locationCheck->execute();

    $locationResult = $locationCheck->get_result();

    if ($locationResult->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Location not found"
        ]);
        exit;
    }

    // Update location
    $stmt = $conn->prepare(
        "UPDATE fc_locations
         SET state = ?,
             district = ?,
             taluka = ?,
             village = ?,
             pincode = ?,
             latitude = ?,
             longitude = ?,
             status = ?
         WHERE id = ?"
    );

    $stmt->bind_param(
        "sssssddsi",
        $state,
        $district,
        $taluka,
        $village,
        $pincode,
        $latitude,
        $longitude,
        $status,
        $location_id
    );

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Location updated successfully"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to update location",
            "error" => $stmt->error
        ]);
    }

    exit;
}

// =========================
// DELETE LOCATION
// =========================

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {

    $location_id = $_GET["id"] ?? null;

    if (!$location_id) {
        echo json_encode([
            "success" => false,
            "message" => "Location ID is required"
        ]);
        exit;
    }

    // Check location exists
    $locationCheck = $conn->prepare(
        "SELECT id FROM fc_locations WHERE id = ?"
    );

    $locationCheck->bind_param("i", $location_id);
    $locationCheck->execute();

    $locationResult = $locationCheck->get_result();

    if ($locationResult->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Location not found"
        ]);
        exit;
    }

    // Delete location
    $stmt = $conn->prepare(
        "DELETE FROM fc_locations WHERE id = ?"
    );

    $stmt->bind_param("i", $location_id);

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Location deleted successfully"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to delete location",
            "error" => $stmt->error
        ]);
    }

    exit;
}

// =========================
// METHOD NOT ALLOWED
// =========================

echo json_encode([
    "success" => false,
    "message" => "Method not allowed"
]);
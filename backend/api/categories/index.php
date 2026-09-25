<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once "../../config/database.php";


// =========================
// GET ALL CATEGORIES
// =========================

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $sql = "SELECT
                id,
                name,
                slug,
                description,
                parent_id,
                type,
                status,
                created_at,
                updated_at
            FROM fc_categories
            ORDER BY id DESC";

    $result = $conn->query($sql);

    if (!$result) {

        echo json_encode([
            "success" => false,
            "message" => "Failed to fetch categories",
            "error" => $conn->error
        ]);

        exit;
    }

    $categories = [];

    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $categories
    ]);

    exit;
}

// =========================
// CREATE CATEGORY
// =========================

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $name = $data["name"] ?? null;
    $slug = $data["slug"] ?? null;
    $description = $data["description"] ?? null;
    $parent_id = $data["parent_id"] ?? null;
    $type = $data["type"] ?? null;
    $status = $data["status"] ?? "ACTIVE";

    // Required fields
    if (!$name || !$slug || !$type) {

        echo json_encode([
            "success" => false,
            "message" => "Name, slug and type are required"
        ]);

        exit;
    }

    $stmt = $conn->prepare(
        "INSERT INTO fc_categories
        (name, slug, description, parent_id, type, status)
        VALUES (?, ?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "sssiss",
        $name,
        $slug,
        $description,
        $parent_id,
        $type,
        $status
    );

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Category created successfully",
            "category_id" => $stmt->insert_id
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to create category",
            "error" => $stmt->error
        ]);
    }

    exit;
}

// =========================
// UPDATE CATEGORY
// =========================

if ($_SERVER["REQUEST_METHOD"] === "PUT") {

    $category_id = $_GET["id"] ?? null;

    if (!$category_id) {
        echo json_encode([
            "success" => false,
            "message" => "Category ID is required"
        ]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $name = $data["name"] ?? null;
    $slug = $data["slug"] ?? null;
    $description = $data["description"] ?? null;
    $parent_id = $data["parent_id"] ?? null;
    $type = $data["type"] ?? null;
    $status = $data["status"] ?? null;

    if (!$name || !$slug || !$type || !$status) {
        echo json_encode([
            "success" => false,
            "message" => "Name, slug, type and status are required"
        ]);
        exit;
    }

    // Check category exists
    $categoryCheck = $conn->prepare(
        "SELECT id FROM fc_categories WHERE id = ?"
    );

    $categoryCheck->bind_param("i", $category_id);
    $categoryCheck->execute();

    $categoryResult = $categoryCheck->get_result();

    if ($categoryResult->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Category not found"
        ]);
        exit;
    }

    // Update category
    $stmt = $conn->prepare(
        "UPDATE fc_categories
         SET name = ?,
             slug = ?,
             description = ?,
             parent_id = ?,
             type = ?,
             status = ?
         WHERE id = ?"
    );

    $stmt->bind_param(
        "sssissi",
        $name,
        $slug,
        $description,
        $parent_id,
        $type,
        $status,
        $category_id
    );

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Category updated successfully"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to update category",
            "error" => $stmt->error
        ]);
    }

    exit;
}

// =========================
// DELETE CATEGORY
// =========================

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {

    $category_id = $_GET["id"] ?? null;

    if (!$category_id) {
        echo json_encode([
            "success" => false,
            "message" => "Category ID is required"
        ]);
        exit;
    }

    // Check category exists
    $categoryCheck = $conn->prepare(
        "SELECT id FROM fc_categories WHERE id = ?"
    );

    $categoryCheck->bind_param("i", $category_id);
    $categoryCheck->execute();

    $categoryResult = $categoryCheck->get_result();

    if ($categoryResult->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Category not found"
        ]);
        exit;
    }

    // Delete category
    $stmt = $conn->prepare(
        "DELETE FROM fc_categories WHERE id = ?"
    );

    $stmt->bind_param("i", $category_id);

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Category deleted successfully"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to delete category",
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
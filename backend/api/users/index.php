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

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    // Get user ID from URL
    $requestUri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

    $basePath = "/FarmConnect/api/users/";

    if (strpos($requestUri, $basePath) === 0) {

        $userId = trim(substr($requestUri, strlen($basePath)));

        if ($userId !== "" && is_numeric($userId)) {

            $userId = (int) $userId;

            $sql = "SELECT id, username, email, first_name, last_name, phone, role, status, created_at
                    FROM fc_users
                    WHERE id = ?";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $userId);
            $stmt->execute();

            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                echo json_encode([
                    "success" => false,
                    "message" => "User not found"
                ]);
                exit;
            }

            $user = $result->fetch_assoc();

            echo json_encode([
                "success" => true,
                "data" => $user
            ]);

            exit;
        }
    }


    // Get all users

    $sql = "
    SELECT
        u.id,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.role,
        u.status,
        u.created_at,

        CASE
            WHEN EXISTS (
                SELECT 1
                FROM fc_orders o
                WHERE o.buyer_id = u.id
                   OR o.seller_id = u.id
            )
            OR EXISTS (
                SELECT 1
                FROM fc_products p
                WHERE p.seller_id = u.id
            )
            OR EXISTS (
                SELECT 1
                FROM fc_reviews r
                WHERE r.buyer_id = u.id
            )
            OR EXISTS (
                SELECT 1
                FROM fc_media m
                WHERE m.user_id = u.id
            )
            THEN 1
            ELSE 0
        END AS has_history

    FROM fc_users u

    ORDER BY u.id DESC
";
    $result = $conn->query($sql);

    $users = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }

    echo json_encode([
        "success" => true,
        "data" => $users
    ]);

    exit;
}


if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);
        exit;
    }

    $username   = trim($input["username"] ?? "");
    $email      = trim($input["email"] ?? "");
    $password   = $input["password"] ?? "";
    $first_name = trim($input["first_name"] ?? "");
    $last_name  = trim($input["last_name"] ?? "");
    $phone      = trim($input["phone"] ?? "");
    $role       = $input["role"] ?? "BUYER";


    // Validate required fields

    if (
        $username === "" ||
        $email === "" ||
        $password === "" ||
        $first_name === ""
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Username, email, password and first name are required"
        ]);
        exit;
    }


    // Validate email

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid email address"
        ]);
        exit;
    }


    // Validate role

    $allowedRoles = ["ADMIN", "FARMER", "BUYER", "SUPPLIER"];

    if (!in_array($role, $allowedRoles, true)) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid user role"
        ]);
        exit;
    }


    // Check username or email

    $checkSql = "SELECT id FROM fc_users WHERE username = ? OR email = ?";

    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("ss", $username, $email);
    $checkStmt->execute();

    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Username or email already exists"
        ]);
        exit;
    }


    // Hash password

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);


    // Insert user

    $sql = "INSERT INTO fc_users
            (username, email, password, first_name, last_name, phone, role, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "sssssss",
        $username,
        $email,
        $hashedPassword,
        $first_name,
        $last_name,
        $phone,
        $role
    );


    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "User created successfully",
            "user_id" => $stmt->insert_id
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to create user"
        ]);
    }

    exit;
}

// =========================
// UPDATE USER
// =========================

if ($_SERVER["REQUEST_METHOD"] === "PUT") {

    // Get user ID from URL
    $userId = $_GET["id"] ?? null;

    if (!$userId || !is_numeric($userId)) {

        echo json_encode([
            "success" => false,
            "message" => "Valid user ID is required"
        ]);

        exit;
    }

    $userId = (int) $userId;


    // =========================
    // Read JSON data
    // =========================

    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);

        exit;
    }


    // =========================
    // Get fields
    // =========================

    $username   = trim($input["username"] ?? "");
    $email      = trim($input["email"] ?? "");
    $first_name = trim($input["first_name"] ?? "");
    $last_name  = trim($input["last_name"] ?? "");
    $phone      = trim($input["phone"] ?? "");
    $role       = $input["role"] ?? "";
    $status     = $input["status"] ?? "";


    // =========================
    // Validate required fields
    // =========================

    if (
        $username === "" ||
        $email === "" ||
        $first_name === "" ||
        $role === "" ||
        $status === ""
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Username, email, first name, role and status are required"
        ]);

        exit;
    }


    // =========================
    // Validate email
    // =========================

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid email address"
        ]);

        exit;
    }


    // =========================
    // Validate role
    // =========================

    $allowedRoles = [
        "ADMIN",
        "FARMER",
        "BUYER",
        "SUPPLIER"
    ];

    if (!in_array($role, $allowedRoles, true)) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid user role"
        ]);

        exit;
    }


    // =========================
    // Validate status
    // =========================

    $allowedStatuses = [
        "ACTIVE",
        "INACTIVE",
        "BLOCKED"
    ];

    if (!in_array($status, $allowedStatuses, true)) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid user status"
        ]);

        exit;
    }


    // =========================
    // Check user exists
    // =========================

    $checkUserSql = "SELECT id FROM fc_users WHERE id = ?";

    $checkUserStmt = $conn->prepare($checkUserSql);
    $checkUserStmt->bind_param("i", $userId);
    $checkUserStmt->execute();

    $checkUserResult = $checkUserStmt->get_result();

    if ($checkUserResult->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);

        exit;
    }


    // =========================
    // Check duplicate username/email
    // =========================

    $duplicateSql = "
        SELECT id
        FROM fc_users
        WHERE (username = ? OR email = ?)
        AND id != ?
    ";

    $duplicateStmt = $conn->prepare($duplicateSql);

    $duplicateStmt->bind_param(
        "ssi",
        $username,
        $email,
        $userId
    );

    $duplicateStmt->execute();

    $duplicateResult = $duplicateStmt->get_result();

    if ($duplicateResult->num_rows > 0) {

        echo json_encode([
            "success" => false,
            "message" => "Username or email already exists"
        ]);

        exit;
    }


    // =========================
    // Update user
    // =========================

    $sql = "
        UPDATE fc_users
        SET
            username = ?,
            email = ?,
            first_name = ?,
            last_name = ?,
            phone = ?,
            role = ?,
            status = ?
        WHERE id = ?
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "sssssssi",
        $username,
        $email,
        $first_name,
        $last_name,
        $phone,
        $role,
        $status,
        $userId
    );


    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "User updated successfully",
            "user_id" => $userId
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to update user",
            "error" => $stmt->error
        ]);
    }

    exit;
}

// =========================
// DELETE USER
// =========================

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {

    $userId = $_GET["id"] ?? null;

    if (!$userId || !is_numeric($userId)) {

        echo json_encode([
            "success" => false,
            "message" => "Valid user ID is required"
        ]);

        exit;
    }

    $userId = (int) $userId;


    // =========================
    // Check if user exists
    // =========================

    $checkSql = "SELECT id FROM fc_users WHERE id = ?";

    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("i", $userId);
    $checkStmt->execute();

    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);

        exit;
    }


    // =========================
    // Check user history
    // =========================

    $historySql = "
        SELECT
            EXISTS (
                SELECT 1
                FROM fc_orders
                WHERE buyer_id = ? OR seller_id = ?
            ) AS order_history,

            EXISTS (
                SELECT 1
                FROM fc_products
                WHERE seller_id = ?
            ) AS product_history,

            EXISTS (
                SELECT 1
                FROM fc_reviews
                WHERE buyer_id = ?
            ) AS review_history,

            EXISTS (
                SELECT 1
                FROM fc_media
                WHERE user_id = ?
            ) AS media_history
    ";

    $historyStmt = $conn->prepare($historySql);

    $historyStmt->bind_param(
        "iiiii",
        $userId,
        $userId,
        $userId,
        $userId,
        $userId
    );

    $historyStmt->execute();

    $historyResult = $historyStmt->get_result();
    $history = $historyResult->fetch_assoc();


    // =========================
    // Prevent deletion if history exists
    // =========================

    if (
        $history["order_history"] ||
        $history["product_history"] ||
        $history["review_history"] ||
        $history["media_history"]
    ) {

        echo json_encode([
            "success" => false,
            "message" => "User has history and cannot be deleted"
        ]);

        exit;
    }


    // =========================
    // Delete user
    // =========================

    $sql = "DELETE FROM fc_users WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "User deleted successfully",
            "user_id" => $userId
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to delete user",
            "error" => $stmt->error
        ]);
    }

    exit;
}

echo json_encode([
    "success" => false,
    "message" => "Method not allowed"
]);
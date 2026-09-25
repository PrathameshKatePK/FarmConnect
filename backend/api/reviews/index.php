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


/*
|--------------------------------------------------------------------------
| GET SINGLE REVIEW
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "GET" && !empty($_GET["id"])) {

    $review_id = $_GET["id"];

    $stmt = $conn->prepare(
        "SELECT
            r.id,
            r.product_id,
            p.name AS product_name,
            r.buyer_id,
            CONCAT(
                u.first_name,
                ' ',
                COALESCE(u.last_name, '')
            ) AS buyer_name,
            u.email AS buyer_email,
            r.order_id,
            r.rating,
            r.review,
            r.status,
            r.admin_note,
            r.created_at,
            r.updated_at
         FROM fc_reviews r
         LEFT JOIN fc_products p
            ON r.product_id = p.id
         LEFT JOIN fc_users u
            ON r.buyer_id = u.id
         WHERE r.id = ?"
    );

    $stmt->bind_param("i", $review_id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Review not found"
        ]);

        exit;
    }

    $review = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "data" => $review
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| GET ALL REVIEWS
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $sql = "
        SELECT
            r.id,
            r.product_id,
            p.name AS product_name,
            r.buyer_id,
            CONCAT(
                u.first_name,
                ' ',
                COALESCE(u.last_name, '')
            ) AS buyer_name,
            u.email AS buyer_email,
            r.order_id,
            r.rating,
            r.review,
            r.status,
            r.admin_note,
            r.created_at,
            r.updated_at
        FROM fc_reviews r
        LEFT JOIN fc_products p
            ON r.product_id = p.id
        LEFT JOIN fc_users u
            ON r.buyer_id = u.id
        ORDER BY r.id DESC
    ";

    $result = $conn->query($sql);

    if (!$result) {

        echo json_encode([
            "success" => false,
            "message" => "Failed to fetch reviews",
            "error" => $conn->error
        ]);

        exit;
    }

    $reviews = [];

    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $reviews
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| CREATE REVIEW
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    $product_id = $data["product_id"] ?? null;
    $buyer_id = $data["buyer_id"] ?? null;
    $order_id = $data["order_id"] ?? null;
    $rating = $data["rating"] ?? null;
    $review = $data["review"] ?? null;
    $status = $data["status"] ?? "PENDING";
    $admin_note = $data["admin_note"] ?? null;


    /*
    |--------------------------------------------------------------------------
    | Required fields
    |--------------------------------------------------------------------------
    */

    if (!$product_id || !$buyer_id || !$rating) {

        echo json_encode([
            "success" => false,
            "message" => "Product, buyer and rating are required"
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Validate rating
    |--------------------------------------------------------------------------
    */

    if (!is_numeric($rating) || $rating < 1 || $rating > 5) {

        echo json_encode([
            "success" => false,
            "message" => "Rating must be between 1 and 5"
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Validate status
    |--------------------------------------------------------------------------
    */

    $allowed_statuses = [
        "PUBLISHED",
        "HIDDEN",
        "PENDING"
    ];

    if (!in_array($status, $allowed_statuses)) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid review status"
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Validate product
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Validate buyer
    |--------------------------------------------------------------------------
    */

    $buyerCheck = $conn->prepare(
        "SELECT id
         FROM fc_users
         WHERE id = ?
         AND role = 'BUYER'"
    );

    $buyerCheck->bind_param(
        "i",
        $buyer_id
    );

    $buyerCheck->execute();

    $buyerResult = $buyerCheck->get_result();

    if ($buyerResult->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Buyer not found"
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Validate order if provided
    |--------------------------------------------------------------------------
    */

    if ($order_id !== null) {

        $orderCheck = $conn->prepare(
            "SELECT id
             FROM fc_orders
             WHERE id = ?"
        );

        $orderCheck->bind_param(
            "i",
            $order_id
        );

        $orderCheck->execute();

        $orderResult = $orderCheck->get_result();

        if ($orderResult->num_rows === 0) {

            echo json_encode([
                "success" => false,
                "message" => "Order not found"
            ]);

            exit;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Insert review
    |--------------------------------------------------------------------------
    */

    $stmt = $conn->prepare(
        "INSERT INTO fc_reviews
        (
            product_id,
            buyer_id,
            order_id,
            rating,
            review,
            status,
            admin_note
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "iiissss",
        $product_id,
        $buyer_id,
        $order_id,
        $rating,
        $review,
        $status,
        $admin_note
    );

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Review created successfully",
            "review_id" => $stmt->insert_id
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to create review",
            "error" => $stmt->error
        ]);
    }

    exit;
}


/*
|--------------------------------------------------------------------------
| UPDATE REVIEW
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "PUT") {

    $review_id = $_GET["id"] ?? null;

    if (!$review_id) {

        echo json_encode([
            "success" => false,
            "message" => "Review ID is required"
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Check review
    |--------------------------------------------------------------------------
    */

    $reviewCheck = $conn->prepare(
        "SELECT id
         FROM fc_reviews
         WHERE id = ?"
    );

    $reviewCheck->bind_param(
        "i",
        $review_id
    );

    $reviewCheck->execute();

    $reviewResult = $reviewCheck->get_result();

    if ($reviewResult->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Review not found"
        ]);

        exit;
    }


    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    $product_id = $data["product_id"] ?? null;
    $buyer_id = $data["buyer_id"] ?? null;
    $order_id = $data["order_id"] ?? null;
    $rating = $data["rating"] ?? null;
    $review = $data["review"] ?? null;
    $status = $data["status"] ?? "PENDING";
    $admin_note = $data["admin_note"] ?? null;


    if (!$product_id || !$buyer_id || !$rating) {

        echo json_encode([
            "success" => false,
            "message" => "Product, buyer and rating are required"
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Validate rating
    |--------------------------------------------------------------------------
    */

    if (!is_numeric($rating) || $rating < 1 || $rating > 5) {

        echo json_encode([
            "success" => false,
            "message" => "Rating must be between 1 and 5"
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Validate status
    |--------------------------------------------------------------------------
    */

    $allowed_statuses = [
        "PUBLISHED",
        "HIDDEN",
        "PENDING"
    ];

    if (!in_array($status, $allowed_statuses)) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid review status"
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Validate product
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Validate buyer
    |--------------------------------------------------------------------------
    */

    $buyerCheck = $conn->prepare(
        "SELECT id
         FROM fc_users
         WHERE id = ?
         AND role = 'BUYER'"
    );

    $buyerCheck->bind_param(
        "i",
        $buyer_id
    );

    $buyerCheck->execute();

    $buyerResult = $buyerCheck->get_result();

    if ($buyerResult->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Buyer not found"
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | Validate order
    |--------------------------------------------------------------------------
    */

    if ($order_id !== null) {

        $orderCheck = $conn->prepare(
            "SELECT id
             FROM fc_orders
             WHERE id = ?"
        );

        $orderCheck->bind_param(
            "i",
            $order_id
        );

        $orderCheck->execute();

        $orderResult = $orderCheck->get_result();

        if ($orderResult->num_rows === 0) {

            echo json_encode([
                "success" => false,
                "message" => "Order not found"
            ]);

            exit;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Update review
    |--------------------------------------------------------------------------
    */

    $stmt = $conn->prepare(
        "UPDATE fc_reviews
         SET
            product_id = ?,
            buyer_id = ?,
            order_id = ?,
            rating = ?,
            review = ?,
            status = ?,
            admin_note = ?
         WHERE id = ?"
    );

    $stmt->bind_param(
        "iiiisssi",
        $product_id,
        $buyer_id,
        $order_id,
        $rating,
        $review,
        $status,
        $admin_note,
        $review_id
    );

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Review updated successfully",
            "review_id" => $review_id
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to update review",
            "error" => $stmt->error
        ]);
    }

    exit;
}


/*
|--------------------------------------------------------------------------
| DELETE REVIEW
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {

    $review_id = $_GET["id"] ?? null;

    if (!$review_id) {

        echo json_encode([
            "success" => false,
            "message" => "Review ID is required"
        ]);

        exit;
    }


    $reviewCheck = $conn->prepare(
        "SELECT id
         FROM fc_reviews
         WHERE id = ?"
    );

    $reviewCheck->bind_param(
        "i",
        $review_id
    );

    $reviewCheck->execute();

    $reviewResult = $reviewCheck->get_result();

    if ($reviewResult->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Review not found"
        ]);

        exit;
    }


    $stmt = $conn->prepare(
        "DELETE FROM fc_reviews
         WHERE id = ?"
    );

    $stmt->bind_param(
        "i",
        $review_id
    );

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Review deleted successfully",
            "review_id" => $review_id
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to delete review",
            "error" => $stmt->error
        ]);
    }

    exit;
}


/*
|--------------------------------------------------------------------------
| METHOD NOT ALLOWED
|--------------------------------------------------------------------------
*/

echo json_encode([
    "success" => false,
    "message" => "Method not allowed"
]);
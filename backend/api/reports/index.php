<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);

    exit;
}

try {

    /*
    |--------------------------------------------------------------------------
    | USER SUMMARY
    |--------------------------------------------------------------------------
    */

    $userQuery = "
        SELECT
            COUNT(*) AS total_users,
            SUM(role = 'ADMIN') AS total_admins,
            SUM(role = 'FARMER') AS total_farmers,
            SUM(role = 'BUYER') AS total_buyers,
            SUM(role = 'SUPPLIER') AS total_suppliers
        FROM fc_users
    ";

    $userResult = $conn->query($userQuery);
    $users = $userResult->fetch_assoc();


    /*
    |--------------------------------------------------------------------------
    | PRODUCT SUMMARY
    |--------------------------------------------------------------------------
    */

    $productQuery = "
        SELECT
            COUNT(*) AS total_products,
            SUM(product_type = 'PRODUCE') AS total_produce,
            SUM(product_type = 'AGRICULTURAL_SUPPLY') AS total_supplies
        FROM fc_products
    ";

    $productResult = $conn->query($productQuery);
    $products = $productResult->fetch_assoc();


    /*
    |--------------------------------------------------------------------------
    | ORDER SUMMARY
    |--------------------------------------------------------------------------
    */

    $orderQuery = "
        SELECT
            COUNT(*) AS total_orders,
            COALESCE(SUM(total_amount), 0) AS total_sales,
            SUM(order_status = 'PENDING') AS pending_orders,
            SUM(order_status = 'ACCEPTED') AS accepted_orders,
            SUM(order_status = 'PROCESSING') AS processing_orders,
            SUM(order_status = 'SHIPPED') AS shipped_orders,
            SUM(order_status = 'DELIVERED') AS delivered_orders,
            SUM(order_status = 'CANCELLED') AS cancelled_orders
        FROM fc_orders
    ";

    $orderResult = $conn->query($orderQuery);
    $orders = $orderResult->fetch_assoc();


    /*
    |--------------------------------------------------------------------------
    | REVIEW SUMMARY
    |--------------------------------------------------------------------------
    */

    $reviewQuery = "
        SELECT
            COUNT(*) AS total_reviews,
            COALESCE(AVG(rating), 0) AS average_rating,
            SUM(rating = 5) AS five_star,
            SUM(rating = 4) AS four_star,
            SUM(rating = 3) AS three_star,
            SUM(rating = 2) AS two_star,
            SUM(rating = 1) AS one_star
        FROM fc_reviews
    ";

    $reviewResult = $conn->query($reviewQuery);
    $reviews = $reviewResult->fetch_assoc();


    /*
    |--------------------------------------------------------------------------
    | TOP PRODUCTS
    |--------------------------------------------------------------------------
    */

    $topProductsQuery = "
        SELECT
            p.id,
            p.name,
            p.product_type,
            COALESCE(SUM(oi.quantity), 0) AS total_quantity,
            COALESCE(SUM(oi.quantity * oi.price), 0) AS total_sales
        FROM fc_products p
        LEFT JOIN fc_order_items oi
            ON p.id = oi.product_id
        LEFT JOIN fc_orders o
            ON oi.order_id = o.id
        WHERE o.order_status != 'CANCELLED'
           OR o.order_status IS NULL
        GROUP BY
            p.id,
            p.name,
            p.product_type
        ORDER BY total_sales DESC
        LIMIT 10
    ";

    $topProductsResult = $conn->query($topProductsQuery);

    $topProducts = [];

    while ($row = $topProductsResult->fetch_assoc()) {
        $topProducts[] = $row;
    }


    /*
    |--------------------------------------------------------------------------
    | ORDER STATUS REPORT
    |--------------------------------------------------------------------------
    */

    $statusQuery = "
        SELECT
            order_status,
            COUNT(*) AS total
        FROM fc_orders
        GROUP BY order_status
        ORDER BY total DESC
    ";

    $statusResult = $conn->query($statusQuery);

    $orderStatus = [];

    while ($row = $statusResult->fetch_assoc()) {
        $orderStatus[] = $row;
    }


    /*
    |--------------------------------------------------------------------------
    | MONTHLY SALES
    |--------------------------------------------------------------------------
    */

    $monthlySalesQuery = "
        SELECT
            DATE_FORMAT(created_at, '%Y-%m') AS month,
            COUNT(*) AS total_orders,
            COALESCE(SUM(total_amount), 0) AS total_sales
        FROM fc_orders
        WHERE order_status != 'CANCELLED'
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month ASC
    ";

    $monthlySalesResult = $conn->query($monthlySalesQuery);

    $monthlySales = [];

    while ($row = $monthlySalesResult->fetch_assoc()) {
        $monthlySales[] = $row;
    }


    /*
    |--------------------------------------------------------------------------
    | FINAL RESPONSE
    |--------------------------------------------------------------------------
    */

    echo json_encode([
        "success" => true,
        "data" => [
            "users" => $users,
            "products" => $products,
            "orders" => $orders,
            "reviews" => $reviews,
            "top_products" => $topProducts,
            "order_status" => $orderStatus,
            "monthly_sales" => $monthlySales
        ]
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to load reports",
        "error" => $e->getMessage()
    ]);
}
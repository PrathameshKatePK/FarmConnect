<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


require_once "../../config/database.php";
$product_id = $_GET["id"] ?? null;

// =========================
// CREATE PRODUCT
// =========================

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);
        exit;
    }

    $seller_id = $data["seller_id"] ?? null;
    $category_id = $data["category_id"] ?? null;
    $name = trim($data["name"] ?? "");
    $slug = trim($data["slug"] ?? "");
    $description = $data["description"] ?? null;
    $product_type = $data["product_type"] ?? "";
    $price = $data["price"] ?? null;
    $unit = trim($data["unit"] ?? "");
    $quantity = $data["quantity"] ?? 0;
    $location_id = $data["location_id"] ?? null;
    $status = $data["status"] ?? "DRAFT";
    $featured_image = $data["featured_image"] ?? null;


    // =========================
    // VALIDATION
    // =========================

    if (
        !$seller_id ||
        !$category_id ||
        !$name ||
        !$slug ||
        !$product_type ||
        $price === null ||
        !$unit
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Required fields are missing"
        ]);
        exit;
    }


    // Validate product type

    if (!in_array($product_type, [
        "PRODUCE",
        "AGRICULTURAL_SUPPLY"
    ])) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid product type"
        ]);

        exit;
    }


    // Validate status

    if (!in_array($status, [
        "DRAFT",
        "PUBLISHED",
        "OUT_OF_STOCK",
        "INACTIVE"
    ])) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid product status"
        ]);

        exit;
    }


    // =========================
    // CHECK SELLER
    // =========================

    $sellerCheck = $conn->prepare(
        "SELECT id FROM fc_users WHERE id = ?"
    );

    $sellerCheck->bind_param("i", $seller_id);

    $sellerCheck->execute();

    $sellerResult = $sellerCheck->get_result();


    if ($sellerResult->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Seller not found"
        ]);

        exit;
    }


    // =========================
    // INSERT PRODUCT
    // =========================

    $sql = "INSERT INTO fc_products
            (
                seller_id,
                category_id,
                name,
                slug,
                description,
                product_type,
                price,
                unit,
                quantity,
                location_id,
                status,
                featured_image
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";


    $stmt = $conn->prepare($sql);


    if (!$stmt) {

        echo json_encode([
            "success" => false,
            "message" => "Failed to prepare query",
            "error" => $conn->error
        ]);

        exit;
    }

$stmt->bind_param(
    "iissssdsdiss",
    $seller_id,
    $category_id,
    $name,
    $slug,
    $description,
    $product_type,
    $price,
    $unit,
    $quantity,
    $location_id,
    $status,
    $featured_image
);

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Product created successfully",
            "product_id" => $stmt->insert_id
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to create product",
            "error" => $stmt->error
        ]);
    }

    exit;
}

// =========================
// UPDATE PRODUCT
// =========================
if($_SERVER["REQUEST_METHOD"]==="PUT"){
    $product_id = $_GET["id"]??null;
    if(!$product_id){
echo json_encode([
    "success"=> false,
    "message"=> "Product ID is Required"
]);
exit;
    }
    $data=json_decode(file_get_contents("php://input"),true);
    if(!$data){
        echo json_encode([
            "success"=> false,
            "message"=> "Invalid Json Data"
        ]);
        exit;
    }
    $name=trim($data["name"]??"");
     $slug = trim($data["slug"] ?? "");
    $description = $data["description"] ?? null;
    $category_id = $data["category_id"] ?? null;
    $product_type = $data["product_type"] ?? "";
    $price = $data["price"] ?? null;
    $unit = trim($data["unit"] ?? "");
    $quantity = $data["quantity"] ?? 0;
    $location_id = $data["location_id"] ?? null;
    $status = $data["status"] ?? "DRAFT";
    $featured_image = $data["featured_image"] ?? null;
// =========================
    // VALIDATION
    // =========================

    if (
        !$name ||
        !$slug ||
        !$category_id ||
        !$product_type ||
        $price === null ||
        !$unit
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Required fields are missing"
        ]);
        exit;
    }


    if (!in_array($product_type, [
        "PRODUCE",
        "AGRICULTURAL_SUPPLY"
    ])) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid product type"
        ]);
        exit;
    }


    if (!in_array($status, [
        "DRAFT",
        "PUBLISHED",
        "OUT_OF_STOCK",
        "INACTIVE"
    ])) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid product status"
        ]);
        exit;
    }


    // =========================
    // CHECK PRODUCT
    // =========================

    $productCheck = $conn->prepare(
        "SELECT id FROM fc_products WHERE id = ?"
    );

    $productCheck->bind_param("i", $product_id);
    $productCheck->execute();

    $productResult = $productCheck->get_result();

    if ($productResult->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Product not found"
        ]);
        exit;
    }


    // =========================
    // UPDATE PRODUCT
    // =========================

    $sql = "UPDATE fc_products
            SET
                category_id = ?,
                name = ?,
                slug = ?,
                description = ?,
                product_type = ?,
                price = ?,
                unit = ?,
                quantity = ?,
                location_id = ?,
                status = ?,
                featured_image = ?
            WHERE id = ?";


    $stmt = $conn->prepare($sql);


    if (!$stmt) {

        echo json_encode([
            "success" => false,
            "message" => "Failed to prepare query",
            "error" => $conn->error
        ]);
        exit;
    }


    $stmt->bind_param(
        "issssdsdissi",
        $category_id,
        $name,
        $slug,
        $description,
        $product_type,
        $price,
        $unit,
        $quantity,
        $location_id,
        $status,
        $featured_image,
        $product_id
    );


    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Product updated successfully"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to update product",
            "error" => $stmt->error
        ]);
    }

    exit;
}

// =========================
// DELETE PRODUCT
// =========================

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {

    $product_id = $_GET["id"] ?? null;

    if (!$product_id) {
        echo json_encode([
            "success" => false,
            "message" => "Product ID is required"
        ]);
        exit;
    }


    // Check product exists

    $productCheck = $conn->prepare(
        "SELECT id FROM fc_products WHERE id = ?"
    );

    $productCheck->bind_param("i", $product_id);

    $productCheck->execute();

    $productResult = $productCheck->get_result();


    if ($productResult->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Product not found"
        ]);

        exit;
    }


    // Delete product

    $stmt = $conn->prepare(
        "DELETE FROM fc_products WHERE id = ?"
    );

    $stmt->bind_param("i", $product_id);


    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Product deleted successfully"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to delete product",
            "error" => $stmt->error
        ]);
    }

    exit;
}
// =========================
// GET PRODUCT(S)
// =========================

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $product_id = $_GET["id"] ?? null;


    // =========================
    // GET SINGLE PRODUCT
    // =========================

    if ($product_id !== null && $product_id !== "") {

        $stmt = $conn->prepare(
    "SELECT
        p.id,
        p.seller_id,
        CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS seller,
        p.category_id,
        c.name AS category,
        p.name,
        p.slug,
        p.description,
        p.product_type,
        p.price,
        p.unit,
        p.quantity,
        p.location_id,
        p.status,
        p.featured_image,
        p.created_at,
        p.updated_at
    FROM fc_products p

    LEFT JOIN fc_users u
        ON p.seller_id = u.id

    LEFT JOIN fc_categories c
        ON p.category_id = c.id

    WHERE p.id = ?"
);

        $stmt->bind_param("i", $product_id);

        $stmt->execute();

        $result = $stmt->get_result();


        if ($result->num_rows === 0) {

            echo json_encode([
                "success" => false,
                "message" => "Product not found"
            ]);

            exit;
        }


        $product = $result->fetch_assoc();


        echo json_encode([
            "success" => true,
            "data" => $product
        ]);

        exit;
    }


    // =========================
    // GET ALL PRODUCTS
    // =========================

    $sql = "SELECT
            p.id,
            p.seller_id,
            CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS seller,
            p.category_id,
            c.name AS category,
            p.name,
            p.slug,
            p.description,
            p.product_type,
            p.price,
            p.unit,
            p.quantity,
            p.location_id,
            p.status,
            p.featured_image,
            p.created_at,
            p.updated_at
        FROM fc_products p

        LEFT JOIN fc_users u
            ON p.seller_id = u.id

        LEFT JOIN fc_categories c
            ON p.category_id = c.id

        ORDER BY p.id DESC";


    $result = $conn->query($sql);


    if (!$result) {

        echo json_encode([
            "success" => false,
            "message" => "Failed to fetch products"
        ]);

        exit;
    }


    $products = [];


    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }


    echo json_encode([
        "success" => true,
        "data" => $products
    ]);

    exit;
}

// =========================
// METHOD NOT ALLOWED
// =========================

echo json_encode([
    "success" => false,
    "message" => "Method not allowed"
]);
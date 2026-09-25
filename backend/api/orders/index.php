<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
require_once "../../config/database.php";
// =========================
// GET SINGLE ORDER
// =========================

if ($_SERVER["REQUEST_METHOD"] === "GET" && !empty($_GET["id"])) {

    $order_id = $_GET["id"];

    $stmt = $conn->prepare(
        "SELECT
            o.id,
            o.order_number,
            o.buyer_id,
            CONCAT(b.first_name, ' ', COALESCE(b.last_name, '')) AS buyer,
            b.phone AS buyer_phone,

            o.seller_id,
            CONCAT(s.first_name, ' ', COALESCE(s.last_name, '')) AS seller,
            s.phone AS seller_phone,

            o.order_type,
            oi.product_id,
            oi.product_name AS product,
            oi.quantity,
            oi.unit,
            oi.price,

            o.subtotal,
            o.delivery_charge,
            o.total_amount,

            o.order_status,
            o.payment_status,
            o.payment_method,

            o.delivery_address,
            o.expected_delivery,
            o.notes,
            o.created_at,
            o.updated_at

        FROM fc_orders o

        LEFT JOIN fc_users b
            ON o.buyer_id = b.id

        LEFT JOIN fc_users s
            ON o.seller_id = s.id

        LEFT JOIN fc_order_items oi
            ON o.id = oi.order_id

        WHERE o.id = ?"
    );

    $stmt->bind_param("i", $order_id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Order not found"
        ]);

        exit;
    }

    $order = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "data" => $order
    ]);

    exit;
}


// =========================
// GET ALL ORDERS
// =========================

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $sql = "SELECT
                o.id,
                o.order_number,

                o.buyer_id,
                CONCAT(b.first_name, ' ', COALESCE(b.last_name, '')) AS buyer,
                b.phone AS buyer_phone,

                o.seller_id,
                CONCAT(s.first_name, ' ', COALESCE(s.last_name, '')) AS seller,
                s.phone AS seller_phone,

                o.order_type,

                oi.product_id,
                oi.product_name AS product,
                oi.quantity,
                oi.unit,
                oi.price,

                o.subtotal,
                o.delivery_charge,
                o.total_amount,

                o.order_status,
                o.payment_status,
                o.payment_method,

                o.delivery_address,
                o.expected_delivery,
                o.notes,

                o.created_at,
                o.updated_at

            FROM fc_orders o

            LEFT JOIN fc_users b
                ON o.buyer_id = b.id

            LEFT JOIN fc_users s
                ON o.seller_id = s.id

            LEFT JOIN fc_order_items oi
                ON o.id = oi.order_id

            ORDER BY o.id DESC";

    $result = $conn->query($sql);

    if (!$result) {

        echo json_encode([
            "success" => false,
            "message" => "Failed to fetch orders",
            "error" => $conn->error
        ]);

        exit;
    }

    $orders = [];

    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $orders
    ]);

    exit;
}
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $buyer_id = $data["buyer_id"] ?? null;
    $seller_id = $data["seller_id"] ?? null;
    $product_id = $data["product_id"] ?? null;
    $quantity = $data["quantity"] ?? null;
    $delivery_charge = $data["delivery_charge"] ?? 0;
    $payment_method = $data["payment_method"] ?? "COD";
    $delivery_address = $data["delivery_address"] ?? null;
    $expected_delivery = $data["expected_delivery"] ?? null;
    $notes = $data["notes"] ?? null;
    if (
        !$buyer_id ||
        !$seller_id ||
        !$product_id ||
        !$quantity
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Buyer, seller, product and quantity are required"
        ]);
        exit;
    }
    $buyerCheck = $conn->prepare(
        "SELECT id
         FROM fc_users
         WHERE id = ?
         AND role = 'BUYER'
         AND status = 'ACTIVE'"
    );
    $buyerCheck->bind_param("i", $buyer_id);
    $buyerCheck->execute();
    $buyerResult = $buyerCheck->get_result();
    if ($buyerResult->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid buyer"
        ]);
        exit;
    }
    $sellerCheck = $conn->prepare(
        "SELECT id
         FROM fc_users
         WHERE id = ?
         AND role IN ('FARMER', 'SUPPLIER')
         AND status = 'ACTIVE'"
    );
    $sellerCheck->bind_param("i", $seller_id);
    $sellerCheck->execute();
    $sellerResult = $sellerCheck->get_result();
    if ($sellerResult->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid seller"
        ]);
        exit;
    }
    $productCheck = $conn->prepare(
        "SELECT
            id,
            seller_id,
            name,
            price,
            unit,
            quantity,
            product_type,
            status
         FROM fc_products
         WHERE id = ?"
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
    $product = $productResult->fetch_assoc();
    if ((int)$product["seller_id"] !== (int)$seller_id) {
        echo json_encode([
            "success" => false,
            "message" => "Product does not belong to this seller"
        ]);
        exit;
    }
    if ($product["status"] !== "PUBLISHED") {
        echo json_encode([
            "success" => false,
            "message" => "Product is not available for ordering"
        ]);
        exit;
    }
    if ($quantity > $product["quantity"]) {
        echo json_encode([
            "success" => false,
            "message" => "Insufficient product quantity"
        ]);
        exit;
    }
    $price = (float)$product["price"];
    $quantity = (float)$quantity;
    $delivery_charge = (float)$delivery_charge;
    $subtotal = $price * $quantity;
    $total_amount = $subtotal + $delivery_charge;
    $order_number = "FC" . date("YmdHis") . rand(100, 999);
    $conn->begin_transaction();
    try {
        $stmt = $conn->prepare(
            "INSERT INTO fc_orders
            (
                order_number,
                buyer_id,
                seller_id,
                order_type,
                subtotal,
                delivery_charge,
                total_amount,
                order_status,
                payment_status,
                payment_method,
                delivery_address,
                expected_delivery,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', 'PENDING', ?, ?, ?, ?)"
        );
        $order_type = $product["product_type"];
        $stmt->bind_param(
    "siisdddssss",
            $order_number,
            $buyer_id,
            $seller_id,
            $order_type,
            $subtotal,
            $delivery_charge,
            $total_amount,
            $payment_method,
            $delivery_address,
            $expected_delivery,
            $notes
        );
        if (!$stmt->execute()) {
            throw new Exception("Failed to create order");
        }
        $order_id = $stmt->insert_id;
        $item_total = $subtotal;
        $itemStmt = $conn->prepare(
            "INSERT INTO fc_order_items
            (
                order_id,
                product_id,
                product_name,
                quantity,
                unit,
                price,
                total
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $itemStmt->bind_param(
            "iisdsdd",
            $order_id,
            $product_id,
            $product["name"],
            $quantity,
            $product["unit"],
            $price,
            $item_total
        );
        if (!$itemStmt->execute()) {
            throw new Exception("Failed to create order item");
        }
        $new_quantity = $product["quantity"] - $quantity;
        $stockStmt = $conn->prepare(
            "UPDATE fc_products
             SET quantity = ?
             WHERE id = ?"
        );
        $stockStmt->bind_param(
            "di",
            $new_quantity,
            $product_id
        );
        if (!$stockStmt->execute()) {
            throw new Exception("Failed to update product stock");
        }
        $conn->commit();
        echo json_encode([
            "success" => true,
            "message" => "Order created successfully",
            "order_id" => $order_id,
            "order_number" => $order_number,
            "subtotal" => $subtotal,
            "delivery_charge" => $delivery_charge,
            "total_amount" => $total_amount
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
if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $order_id = $_GET["id"] ?? null;
    if (!$order_id) {
        echo json_encode([
            "success" => false,
            "message" => "Order ID is required"
        ]);
        exit;
    }
    $data = json_decode(
        file_get_contents("php://input"),
        true
    );
    $new_status = $data["order_status"] ?? null;
    $allowed_statuses = [
        "PENDING",
        "ACCEPTED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
    ];
    if (!$new_status) {
        echo json_encode([
            "success" => false,
            "message" => "Order status is required"
        ]);
        exit;
    }
    if (!in_array($new_status, $allowed_statuses)) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid order status"
        ]);
        exit;
    }
    $orderCheck = $conn->prepare(
        "SELECT
            id,
            order_status
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
    $order = $orderResult->fetch_assoc();
    $current_status = $order["order_status"];
    if ($current_status === $new_status) {
        echo json_encode([
            "success" => false,
            "message" => "Order already has this status"
        ]);
        exit;
    }
    $valid_transitions = [
        "PENDING" => [
            "ACCEPTED",
            "CANCELLED"
        ],
        "ACCEPTED" => [
            "PROCESSING",
            "CANCELLED"
        ],
        "PROCESSING" => [
            "SHIPPED"
        ],
        "SHIPPED" => [
            "DELIVERED"
        ],
        "DELIVERED" => [],
        "CANCELLED" => []
    ];
    if (
        !in_array(
            $new_status,
            $valid_transitions[$current_status]
        )
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid order status transition",
            "current_status" => $current_status,
            "requested_status" => $new_status
        ]);
        exit;
    }
    $stmt = $conn->prepare(
        "UPDATE fc_orders
         SET order_status = ?
         WHERE id = ?"
    );
    $stmt->bind_param(
        "si",
        $new_status,
        $order_id
    );
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Order status updated successfully",
            "previous_status" => $current_status,
            "current_status" => $new_status
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to update order status",
            "error" => $stmt->error
        ]);
    }
    exit;
}
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $order_id = $_GET["id"] ?? null;
    if (!$order_id) {
        echo json_encode([
            "success" => false,
            "message" => "Order ID is required"
        ]);
        exit;
    }
    $orderCheck = $conn->prepare(
        "SELECT
            id,
            order_status
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
    $order = $orderResult->fetch_assoc();
    $order_status = $order["order_status"];
    $allowed_delete_statuses = [
        "PENDING",
        "ACCEPTED",
        "CANCELLED"
    ];
    if (!in_array($order_status, $allowed_delete_statuses)) {
        echo json_encode([
            "success" => false,
            "message" => "Order cannot be deleted in its current status",
            "current_status" => $order_status
        ]);
        exit;
    }
    $conn->begin_transaction();
    try {
        if (
            $order_status === "PENDING" ||
            $order_status === "ACCEPTED"
        ) {
            $itemsStmt = $conn->prepare(
                "SELECT
                    product_id,
                    quantity
                 FROM fc_order_items
                 WHERE order_id = ?"
            );
            $itemsStmt->bind_param(
                "i",
                $order_id
            );
            $itemsStmt->execute();
            $itemsResult = $itemsStmt->get_result();
            while ($item = $itemsResult->fetch_assoc()) {
                $stockStmt = $conn->prepare(
                    "UPDATE fc_products
                     SET quantity = quantity + ?
                     WHERE id = ?"
                );
                $stockStmt->bind_param(
                    "di",
                    $item["quantity"],
                    $item["product_id"]
                );
                if (!$stockStmt->execute()) {
                    throw new Exception(
                        "Failed to restore product stock"
                    );
                }
            }
        }
        $deleteStmt = $conn->prepare(
            "DELETE FROM fc_orders
             WHERE id = ?"
        );
        $deleteStmt->bind_param(
            "i",
            $order_id
        );
        if (!$deleteStmt->execute()) {
            throw new Exception(
                "Failed to delete order"
            );
        }
        $conn->commit();
        echo json_encode([
            "success" => true,
            "message" => "Order deleted successfully",
            "order_id" => $order_id
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
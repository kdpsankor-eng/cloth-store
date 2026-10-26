<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$ordersFile = __DIR__ . '/../data/orders.json';
$productsFile = __DIR__ . '/../data/products.json';
$settingsFile = __DIR__ . '/../data/settings.json';
$blockedIpsFile = __DIR__ . '/../data/blocked_ips.json';

function getClientIp() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

// --- GET Request ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';

    // 1. Order Tracking by Customer
    if ($action === 'track') {
        $orderNumber = trim($_GET['orderNumber'] ?? '');
        $phone = trim($_GET['phone'] ?? '');

        if (!$orderNumber || !$phone) {
            http_response_code(400);
            echo json_encode(["error" => "অর্ডার নাম্বার এবং মোবাইল নাম্বার উভয়ই আবশ্যক।"]);
            exit();
        }

        $cleanPhone = preg_replace('/[\s-]/', '', $phone);
        $orders = file_exists($ordersFile) ? json_decode(file_get_contents($ordersFile), true) : [];

        foreach ($orders as $ord) {
            $ordPhone = preg_replace('/[\s-]/', '', $ord['customerPhone'] ?? '');
            if ($ord['orderNumber'] === $orderNumber && substr($ordPhone, -10) === substr($cleanPhone, -10)) {
                echo json_encode(["success" => true, "order" => $ord], JSON_UNESCAPED_UNICODE);
                exit();
            }
        }

        http_response_code(404);
        echo json_encode(["error" => "প্রদত্ত তথ্যের সাথে কোনো অর্ডার খুঁজে পাওয়া যায়নি। সঠিক তথ্য দিন।"]);
        exit();
    }

    // 2. Admin List All Orders
    if ($action === 'list_all') {
        $orders = file_exists($ordersFile) ? json_decode(file_get_contents($ordersFile), true) : [];
        $blockedIps = file_exists($blockedIpsFile) ? json_decode(file_get_contents($blockedIpsFile), true) : [];
        echo json_encode([
            "success" => true,
            "orders" => $orders,
            "blockedIps" => $blockedIps
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // 3. Single Order View
    if ($action === 'get_order') {
        $orderNumber = trim($_GET['orderNumber'] ?? '');
        $orders = file_exists($ordersFile) ? json_decode(file_get_contents($ordersFile), true) : [];
        foreach ($orders as $ord) {
            if ($ord['orderNumber'] === $orderNumber) {
                echo json_encode(["success" => true, "order" => $ord], JSON_UNESCAPED_UNICODE);
                exit();
            }
        }
        http_response_code(404);
        echo json_encode(["error" => "Order not found"]);
        exit();
    }

    echo json_encode(["message" => "Orders API Ready"]);
    exit();
}

// --- POST Request ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON payload"]);
        exit();
    }

    $action = $input['action'] ?? 'create';

    // 1. Admin Status & Courier Update
    if ($action === 'update_status') {
        $orderNumber = $input['orderNumber'] ?? '';
        $newStatus = $input['newStatus'] ?? '';
        $courierName = $input['courierName'] ?? null;
        $trackingCode = $input['trackingCode'] ?? null;

        $orders = file_exists($ordersFile) ? json_decode(file_get_contents($ordersFile), true) : [];
        $found = false;

        foreach ($orders as &$ord) {
            if ($ord['orderNumber'] === $orderNumber) {
                $ord['orderStatus'] = $newStatus;
                if ($courierName !== null) $ord['courierName'] = $courierName;
                if ($trackingCode !== null) $ord['trackingCode'] = $trackingCode;
                $found = true;
                break;
            }
        }

        if ($found) {
            file_put_contents($ordersFile, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(["success" => true]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Order not found"]);
        }
        exit();
    }

    // 2. Admin Edit Order (Edit Customer details, Items, Notes, Delivery Fees)
    if ($action === 'edit_order') {
        $orderNumber = $input['orderNumber'] ?? '';
        $orders = file_exists($ordersFile) ? json_decode(file_get_contents($ordersFile), true) : [];
        $found = false;

        foreach ($orders as &$ord) {
            if ($ord['orderNumber'] === $orderNumber) {
                if (isset($input['customerName'])) $ord['customerName'] = trim($input['customerName']);
                if (isset($input['customerPhone'])) $ord['customerPhone'] = trim($input['customerPhone']);
                if (isset($input['deliveryAddress'])) $ord['deliveryAddress'] = trim($input['deliveryAddress']);
                if (isset($input['deliveryZone'])) $ord['deliveryZone'] = $input['deliveryZone'];
                if (isset($input['deliveryCharge'])) $ord['deliveryCharge'] = floatval($input['deliveryCharge']);
                if (isset($input['subtotal'])) $ord['subtotal'] = floatval($input['subtotal']);
                if (isset($input['totalPayable'])) $ord['totalPayable'] = floatval($input['totalPayable']);
                if (isset($input['orderNotes'])) $ord['orderNotes'] = trim($input['orderNotes']);
                if (isset($input['orderStatus'])) $ord['orderStatus'] = $input['orderStatus'];
                if (isset($input['courierName'])) $ord['courierName'] = $input['courierName'];
                if (isset($input['trackingCode'])) $ord['trackingCode'] = $input['trackingCode'];
                if (isset($input['items']) && is_array($input['items'])) $ord['items'] = $input['items'];
                $found = true;
                break;
            }
        }

        if ($found) {
            file_put_contents($ordersFile, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(["success" => true]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Order not found"]);
        }
        exit();
    }

    // 3. Admin Delete False / Fake Order
    if ($action === 'delete_order') {
        $orderNumber = $input['orderNumber'] ?? '';
        $orders = file_exists($ordersFile) ? json_decode(file_get_contents($ordersFile), true) : [];
        $newOrders = array_values(array_filter($orders, function($o) use ($orderNumber) {
            return $o['orderNumber'] !== $orderNumber;
        }));

        file_put_contents($ordersFile, json_encode($newOrders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["success" => true]);
        exit();
    }

    // 4. IP Management: Block IP
    if ($action === 'block_ip') {
        $ip = trim($input['ip'] ?? '');
        $reason = trim($input['reason'] ?? 'False / spam order');
        if (!$ip) {
            http_response_code(400);
            echo json_encode(["error" => "IP is required"]);
            exit();
        }

        $blockedIps = file_exists($blockedIpsFile) ? json_decode(file_get_contents($blockedIpsFile), true) : [];
        // Check if already blocked
        $already = false;
        foreach ($blockedIps as $b) {
            if ($b['ip'] === $ip) { $already = true; break; }
        }

        if (!$already) {
            $blockedIps[] = [
                "ip" => $ip,
                "reason" => $reason,
                "blockedAt" => date('c')
            ];
            file_put_contents($blockedIpsFile, json_encode($blockedIps, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }

        echo json_encode(["success" => true, "blockedIps" => $blockedIps]);
        exit();
    }

    // 5. IP Management: Unblock IP
    if ($action === 'unblock_ip') {
        $ip = trim($input['ip'] ?? '');
        $blockedIps = file_exists($blockedIpsFile) ? json_decode(file_get_contents($blockedIpsFile), true) : [];
        $blockedIps = array_values(array_filter($blockedIps, function($b) use ($ip) {
            return $b['ip'] !== $ip;
        }));

        file_put_contents($blockedIpsFile, json_encode($blockedIps, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["success" => true, "blockedIps" => $blockedIps]);
        exit();
    }

    // 6. Customer Order Placement (With IP Collection and Fraud Blocking)
    $clientIp = getClientIp();

    // Check if IP is blocked
    $blockedIps = file_exists($blockedIpsFile) ? json_decode(file_get_contents($blockedIpsFile), true) : [];
    foreach ($blockedIps as $b) {
        if ($b['ip'] === $clientIp) {
            http_response_code(403);
            echo json_encode([
                "error" => "এই মুহুর্তে আপনি অর্ডারটি সম্পন্ন করা যাচ্ছে না।অনুগ্রহ করে \"০১৭৬২৫৫৬২৬২\" এই নাম্বারে যোগাযোগ করুন। সাময়িক অসুবিধার জন্য দুঃখিত।"
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }

    $customerName = trim($input['customerName'] ?? '');
    $customerPhone = trim($input['customerPhone'] ?? '');
    $deliveryAddress = trim($input['deliveryAddress'] ?? '');
    $deliveryZone = $input['deliveryZone'] ?? 'INSIDE_DHAKA';
    $orderNotes = trim($input['orderNotes'] ?? '');
    $items = $input['items'] ?? [];

    if (empty($customerName) || strlen($customerName) < 2) {
        http_response_code(400);
        echo json_encode(["error" => "অনুগ্রহ করে আপনার সঠিক নাম লিখুন।"]);
        exit();
    }

    $cleanPhone = preg_replace('/[\s-]/', '', $customerPhone);
    if (!preg_match('/^(?:\+8801|01)[3-9]\d{8}$/', $cleanPhone)) {
        http_response_code(400);
        echo json_encode(["error" => "অনুগ্রহ করে ১১ ডিজিটের সঠিক মোবাইল নাম্বার প্রদান করুন (যেমন: 017XXXXXXXX)।"]);
        exit();
    }

    if (empty($deliveryAddress) || strlen($deliveryAddress) < 6) {
        http_response_code(400);
        echo json_encode(["error" => "অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা বিস্তারিতভাবে দিন।"]);
        exit();
    }

    if (empty($items) || !is_array($items)) {
        http_response_code(400);
        echo json_encode(["error" => "আপনার শপিং ব্যাগে কোনো পোশাক নেই।"]);
        exit();
    }

    // Fetch official delivery fee from settings
    $settings = file_exists($settingsFile) ? json_decode(file_get_contents($settingsFile), true) : [];
    $insideDhakaFee = floatval($settings['delivery_inside_dhaka'] ?? 80);
    $outsideDhakaFee = floatval($settings['delivery_outside_dhaka'] ?? 150);
    $deliveryFee = ($deliveryZone === 'OUTSIDE_DHAKA') ? $outsideDhakaFee : $insideDhakaFee;

    // Calculate subtotal and build snapshot
    $products = file_exists($productsFile) ? json_decode(file_get_contents($productsFile), true) : [];
    $orderItemsToCreate = [];
    $subtotal = 0;

    foreach ($items as $it) {
        $prodId = $it['productId'] ?? '';
        $variantId = $it['variantId'] ?? '';
        $qty = intval($it['quantity'] ?? 1);

        $matchedProd = null;
        foreach ($products as &$p) {
            if ($p['id'] === $prodId) {
                $matchedProd = &$p;
                break;
            }
        }

        if (!$matchedProd) {
            http_response_code(400);
            echo json_encode(["error" => "পণ্যটি বর্তমানে অনুপলব্ধ।"]);
            exit();
        }

        $unitPrice = !empty($matchedProd['salePrice']) ? floatval($matchedProd['salePrice']) : floatval($matchedProd['regularPrice']);
        $variantNameSnapshot = "Free Size";

        // Check and decrement variant stock
        if (!empty($matchedProd['variants'])) {
            foreach ($matchedProd['variants'] as &$v) {
                if ($v['id'] === $variantId || empty($variantId)) {
                    $variantNameSnapshot = $v['size'] . (!empty($v['color']) ? " - " . $v['color'] : "");
                    $v['stockQuantity'] = max(0, $v['stockQuantity'] - $qty);
                    break;
                }
            }
        } elseif (!empty($matchedProd['stockQuantity'])) {
            $matchedProd['stockQuantity'] = max(0, $matchedProd['stockQuantity'] - $qty);
        }

        $lineTotal = $unitPrice * $qty;
        $subtotal += $lineTotal;

        $orderItemsToCreate[] = [
            "productId" => $matchedProd['id'],
            "productNameSnapshot" => $matchedProd['nameBn'] ?? $matchedProd['name'],
            "variantNameSnapshot" => $variantNameSnapshot,
            "unitPriceSnapshot" => $unitPrice,
            "quantity" => $qty,
            "lineTotal" => $lineTotal
        ];
    }

    $grandTotal = $subtotal + $deliveryFee;

    // Generate unique order number (e.g. WCS-261024-8492)
    $datePart = date('ymd');
    $randomPart = rand(1000, 9999);
    $orderNumber = "WCS-{$datePart}-{$randomPart}";

    $newOrder = [
        "orderNumber" => $orderNumber,
        "customerName" => $customerName,
        "customerPhone" => $cleanPhone,
        "customerIp" => $clientIp,
        "deliveryAddress" => $deliveryAddress,
        "deliveryZone" => $deliveryZone,
        "orderNotes" => $orderNotes,
        "subtotal" => $subtotal,
        "deliveryCharge" => $deliveryFee,
        "totalPayable" => $grandTotal,
        "orderStatus" => "PENDING",
        "paymentMethod" => "CASH_ON_DELIVERY",
        "paymentStatus" => "UNPAID",
        "courierName" => null,
        "trackingCode" => null,
        "createdAt" => date('c'),
        "items" => $orderItemsToCreate
    ];

    $orders = file_exists($ordersFile) ? json_decode(file_get_contents($ordersFile), true) : [];
    array_unshift($orders, $newOrder);

    // Save updated orders and product stock
    file_put_contents($ordersFile, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    file_put_contents($productsFile, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    echo json_encode([
        "success" => true,
        "orderNumber" => $orderNumber
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

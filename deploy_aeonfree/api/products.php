<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$productsFile = __DIR__ . '/../data/products.json';
$categoriesFile = __DIR__ . '/../data/categories.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $products = file_exists($productsFile) ? json_decode(file_get_contents($productsFile), true) : [];
    $categories = file_exists($categoriesFile) ? json_decode(file_get_contents($categoriesFile), true) : [];

    // Optional single product fetch by slug
    if (isset($_GET['slug'])) {
        $slug = $_GET['slug'];
        foreach ($products as $p) {
            if ($p['slug'] === $slug) {
                echo json_encode(["product" => $p]);
                exit();
            }
        }
        http_response_code(404);
        echo json_encode(["error" => "Product not found"]);
        exit();
    }

    echo json_encode([
        "products" => $products,
        "categories" => $categories
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// POST Requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid payload"]);
        exit();
    }

    $action = $input['action'] ?? 'update_stock';
    $products = file_exists($productsFile) ? json_decode(file_get_contents($productsFile), true) : [];
    $categories = file_exists($categoriesFile) ? json_decode(file_get_contents($categoriesFile), true) : [];

    // 1. Create New Product
    if ($action === 'create') {
        $name = trim($input['name'] ?? '');
        if (!$name) {
            http_response_code(400);
            echo json_encode(["error" => "পোশাকের নাম আবশ্যক"]);
            exit();
        }

        $productType = $input['productType'] ?? 'variable'; // 'simple' or 'variable'
        $regularPrice = floatval($input['regularPrice'] ?? 0);
        $salePrice = !empty($input['salePrice']) ? floatval($input['salePrice']) : $regularPrice;
        $costPrice = !empty($input['costPrice']) ? floatval($input['costPrice']) : ($regularPrice * 0.6);

        // Optional SKU
        $sku = trim($input['sku'] ?? '');
        if (!$sku) {
            $sku = 'SK-' . strtoupper(substr(md5(uniqid()), 0, 6));
        }

        // Slug
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $sku)) . '-' . rand(100, 999);

        // Images
        $images = [];
        if (!empty($input['image'])) {
            $images[] = $input['image'];
        } else {
            $images[] = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80";
        }

        // Variants or Simple Stock
        $variants = [];
        $totalStock = 0;

        if ($productType === 'variable') {
            $hasSizeVariants = true;
            $rawVariants = $input['variants'] ?? [];
            if (empty($rawVariants)) {
                // Default sizes if none selected
                $rawVariants = [
                    ["size" => "38", "stock" => 10],
                    ["size" => "40", "stock" => 15],
                    ["size" => "42", "stock" => 10]
                ];
            }
            foreach ($rawVariants as $idx => $v) {
                $vQty = intval($v['stock'] ?? 10);
                $totalStock += $vQty;
                $variants[] = [
                    "id" => "var_" . uniqid() . "_{$idx}",
                    "size" => $v['size'],
                    "color" => $v['color'] ?? "",
                    "stockQuantity" => $vQty
                ];
            }
        } else {
            $hasSizeVariants = false;
            $totalStock = intval($input['stockQuantity'] ?? 20);
            $variants[] = [
                "id" => "var_" . uniqid() . "_simple",
                "size" => "রেগুলার / Free Size",
                "color" => "",
                "stockQuantity" => $totalStock
            ];
        }

        $newProduct = [
            "id" => "prod_" . uniqid(),
            "name" => $name,
            "nameBn" => $name,
            "slug" => $slug,
            "sku" => $sku,
            "description" => $input['description'] ?? "প্রিমিয়াম কোয়ালিটি ফ্যাশনেবল পোশাক।",
            "regularPrice" => $regularPrice,
            "salePrice" => $salePrice,
            "costPrice" => $costPrice,
            "categorySlug" => $input['categorySlug'] ?? "salwar-kameez",
            "categoryNameBn" => $input['categoryNameBn'] ?? "সালোয়ার কামিজ ও থ্রি-পিস",
            "subcategoryName" => $input['subcategoryName'] ?? "",
            "isFeatured" => true,
            "hasSizeVariants" => $hasSizeVariants,
            "sizeSelectionRequired" => $hasSizeVariants,
            "images" => $images,
            "stockQuantity" => $totalStock,
            "variants" => $variants
        ];

        array_unshift($products, $newProduct);
        file_put_contents($productsFile, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        echo json_encode(["success" => true, "product" => $newProduct]);
        exit();
    }

    // 2. Create Category / Subcategory
    if ($action === 'create_category') {
        $catName = trim($input['categoryName'] ?? '');
        $subName = trim($input['subcategoryName'] ?? '');

        if (!$catName) {
            http_response_code(400);
            echo json_encode(["error" => "ক্যাটাগরির নাম আবশ্যক"]);
            exit();
        }

        $catSlug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $catName));
        $foundCat = null;

        foreach ($categories as &$c) {
            if ($c['nameBn'] === $catName || $c['slug'] === $catSlug) {
                $foundCat = &$c;
                break;
            }
        }

        if (!$foundCat) {
            $newCat = [
                "id" => "cat_" . uniqid(),
                "name" => $catName,
                "nameBn" => $catName,
                "slug" => $catSlug,
                "description" => $catName . " কালেকশন",
                "imageUrl" => "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
                "displayOrder" => count($categories) + 1,
                "subcategories" => []
            ];
            if ($subName) {
                $newCat["subcategories"][] = [
                    "id" => "sub_" . uniqid(),
                    "name" => $subName,
                    "slug" => strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $subName))
                ];
            }
            $categories[] = $newCat;
        } else {
            if ($subName) {
                if (!isset($foundCat['subcategories'])) $foundCat['subcategories'] = [];
                $foundCat['subcategories'][] = [
                    "id" => "sub_" . uniqid(),
                    "name" => $subName,
                    "slug" => strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $subName))
                ];
            }
        }

        file_put_contents($categoriesFile, json_encode($categories, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["success" => true, "categories" => $categories]);
        exit();
    }

    // 3. Delete Product
    if ($action === 'delete_product') {
        $prodId = $input['productId'] ?? '';
        $products = array_values(array_filter($products, function($p) use ($prodId) {
            return $p['id'] !== $prodId;
        }));
        file_put_contents($productsFile, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["success" => true]);
        exit();
    }

    // 4. Update Stock Quantity for a Variant
    if (isset($input['variantId']) && isset($input['stockQuantity'])) {
        $variantId = $input['variantId'];
        $stock = intval($input['stockQuantity']);
        $found = false;

        foreach ($products as &$p) {
            if (!empty($p['variants'])) {
                foreach ($p['variants'] as &$v) {
                    if ($v['id'] === $variantId) {
                        $v['stockQuantity'] = $stock;
                        $found = true;
                        break 2;
                    }
                }
            }
        }

        if ($found) {
            file_put_contents($productsFile, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(["success" => true]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Variant not found"]);
        }
        exit();
    }

    echo json_encode(["message" => "No matching action"]);
    exit();
}

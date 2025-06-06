<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductOrder;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index()
    {
        try {
            $data['orders'] = DB::table('orders')->leftJoin('customers', 'customers.id', '=', 'orders.customer_id')
                ->select(["orders.*", DB::raw("CONCAT(customers.first_name, ' ', customers.last_name) as customer_name")])
                ->get();
            return $this->sendResponse("List fetched successfully", $data, 200);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function store(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|string|max:255|exists:customers,id',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|numeric|min:1',
            'products.*.discount' => 'required|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return $this->sendError("please enter valid input data", $validator->errors(), 400);
        }
        $postData = $validator->validated();

        DB::beginTransaction();
        $data['order'] = Order::create([
            "customer_id" =>  $postData["customer_id"],
            "order_number" =>  "POS".uniqid(),
        ]);
       
        $data['order']->price = 0;
        $lowStockWarnings = []; // <-- Add this line

        foreach($postData["products"] as $product){
            $productData = Product::find($product['product_id']);
            if(empty($productData)){
                return $this->sendError("product not found", ["errors" => ["general" => "product not found"]], 404);
            }
            // Check if stock available
            if ($productData->stock < $product['quantity']) {
                return $this->sendError($productData->name . " is out of stock", $validator->errors(), 400);
            }
            
            // Create the item
            ProductOrder::create([
                "order_id" => $data['order']->id,
                "product_id" => $productData->id,
                "product_name" => $productData->name,
                "product_price" => $productData->price,
                "product_quantity" => $product['quantity'],
                "product_discount" =>  $product['discount'],
            ]);
            
            // Update the stock
            $productData->stock = ($productData->stock - $product['quantity']);
            $productData->save();

            // LOW STOCK ALERT
            if ($productData->stock < 5) {
                $lowStockWarnings[] = "{$productData->name} is low in stock ({$productData->stock} left)";
            }

            // Calculate the price
            $calculatedPrice = $productData->price - ($productData->price * $product['discount'] / 100);
            $data['order']->price += floatval($calculatedPrice * $product['quantity']);

            // Update the cart items number
            $data['order']->quantity += intval($product['quantity']);
        }

        $data['order']->save();
        DB::commit();

        // Prepare response with low stock warnings if any
        $response = [
            'order' => $data['order'],
        ];
        if (!empty($lowStockWarnings)) {
            $response['low_stock_warnings'] = $lowStockWarnings;
        }
        return $this->sendResponse("product created successfully.", $response, 201);

    } catch (Exception $e) {
        DB::rollBack();
        return $this->handleException($e);
    }
}

    public function show(string $id)
    {
        try {
            $data['order'] = Order::with(['items', 'customer'])->find($id);
            return $this->sendResponse("Order fetched successfully", $data, 200);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Sales Report: Get total sales per day
     */
    public function reportSales(Request $request)
    {
        // Optionally accept date range
        $startDate = $request->input('start_date') ?? now()->startOfMonth()->toDateString();
        $endDate = $request->input('end_date') ?? now()->endOfMonth()->toDateString();

        $sales = DB::table('orders')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total_orders, SUM(price) as total_sales')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'data' => $sales,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }

    /**
     * Product Performance Report: Shows units sold per product in a date range
     * (Shows all products, even those never sold)
     */
    public function reportProductPerformance(Request $request)
    {
        // Ensure the date range covers the full days for accurate reporting
        $startDate = $request->input('start_date')
            ? $request->input('start_date') . ' 00:00:00'
            : now()->startOfMonth()->toDateTimeString();

        $endDate = $request->input('end_date')
            ? $request->input('end_date') . ' 23:59:59'
            : now()->endOfMonth()->toDateTimeString();

        $performance = DB::table('products')
            ->leftJoin('product_orders', function($join) use ($startDate, $endDate) {
                $join->on('products.id', '=', 'product_orders.product_id')
                    ->whereBetween('product_orders.created_at', [$startDate, $endDate]);
            })
            ->select(
                'products.name as product',
                DB::raw('COALESCE(SUM(product_orders.product_quantity),0) as total_quantity'),
                DB::raw('COALESCE(SUM(product_orders.product_price * product_orders.product_quantity),0) as total_sales')
            )
            ->groupBy('products.name')
            ->orderByDesc('total_quantity')
            ->get();

        return response()->json([
            'data' => $performance,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }

    /**
     * Inventory Report: Shows current stock of all products
     */
    public function reportInventory()
    {
        $products = Product::select('name', 'stock')->orderBy('name')->get();

        return response()->json([
            'data' => $products,
        ]);
    }
}

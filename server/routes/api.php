<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
    Route::post('register', [AuthController::class, 'register']);
});

Route::group(['middleware' => 'auth:api'], function ($routes) {

    //Customer Management
    Route::group(['prefix' => 'v1/customers'], function ($routes) {
        Route::get('/list', [CustomerController::class, 'index']);
        Route::post('/', [CustomerController::class, 'store']);
        Route::get('/{id}', [CustomerController::class, 'show']);
        Route::put('/{id}', [CustomerController::class, 'update']);
        Route::delete('/{id}', [CustomerController::class, 'destroy']);
        Route::post('/getList', [CustomerController::class, 'getList']);
    });

    // Product management
    Route::group(['prefix' => 'v1/products'], function($routes){
        Route::get('/list', [ProductController::class, 'index']);
        Route::get('/initForm', [ProductController::class, 'initForm']);
        Route::post('/', [ProductController::class, 'store']);
        Route::post('/getList', [ProductController::class, 'getList']);
        Route::get('/{id}', [ProductController::class, 'show']);
        Route::post('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
        Route::post('/getList', [ProductController::class, 'getList']);
    });

    // Order management
    Route::group(['prefix' => 'v1/orders'], function($routes){
        Route::get('/', [OrderController::class, 'index']); // <-- ADD THIS LINE!
        Route::get('/list', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show']);
    });

    // --- Reporting endpoints, protected by manager/admin role ---
    Route::group(['prefix' => 'v1/reports', 'middleware' => ['role:manager,admin']], function($routes){
        Route::get('/sales', [OrderController::class, 'reportSales']);
        Route::get('/product-performance', [OrderController::class, 'reportProductPerformance']);
        Route::get('/inventory', [OrderController::class, 'reportInventory']);
    });

    // --- Role-protected example routes (number 5) ---
    Route::middleware(['role:manager,admin'])->group(function () {
        Route::get('/manager-area', function () {
            return response()->json(['message' => 'Welcome manager or admin!']);
        });
    });

    Route::middleware(['role:cashier'])->group(function () {
        Route::get('/cashier-area', function () {
            return response()->json(['message' => 'Welcome cashier!']);
        });
    });
});

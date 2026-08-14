<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EntryController;
use App\Http\Controllers\Api\RateController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\EnsureSuperAdmin;
use Illuminate\Support\Facades\Route;

// ── Health Check (public) ────────────────────────────────────────────────────
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'TeaTrack API is running',
        'version' => '1.0.0',
    ]);
});

// ── Authentication (public) ──────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);

// ── Protected Routes (requires valid Sanctum Bearer token) ──────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/me',     [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Entries (all authenticated users)
    Route::apiResource('entries', EntryController::class);

    // Rates — view: any authenticated user, update: super_admin only
    Route::get('/rates', [RateController::class, 'index']);
    Route::put('/rates', [RateController::class, 'update'])
        ->middleware(EnsureSuperAdmin::class);

    // Reports (all authenticated users)
    Route::get('/reports/monthly', [ReportController::class, 'monthly']);

    // User Management (super_admin only)
    Route::middleware(EnsureSuperAdmin::class)->group(function () {
        Route::apiResource('users', UserController::class);
        Route::patch('/users/{user}/status', [UserController::class, 'toggleStatus']);
    });
});

<?php

use App\Http\Controllers\AdminMobileController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);              // React (web)
Route::post('mobile/login', [AuthController::class, 'mobileLogin']); // Flutter (needs mobile-key)

Route::middleware('auth:api')->group(function () {
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::patch('tasks/{task}/toggle', [TaskController::class, 'toggle'])->name('api.tasks.toggle');
    Route::apiResource('tasks', TaskController::class)->names('api.tasks');

    // Admin only: enable/disable mobile login for a user
    Route::middleware('can:manage-users')->group(function () {
        Route::post('admin/users/{user}/mobile-key', [AdminMobileController::class, 'enable']);
        Route::delete('admin/users/{user}/mobile-key', [AdminMobileController::class, 'disable']);
    });
});
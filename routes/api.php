<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [RegistrationController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('users', UserController::class);

Route::post('/admin/register', [RegistrationController::class, 'adminRegister'])->middleware(['auth:sanctum', 'admin']);

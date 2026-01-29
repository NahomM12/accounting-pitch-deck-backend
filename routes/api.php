<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\PitchDeckController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [RegistrationController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('users', UserController::class);

Route::post('/admin/register', [RegistrationController::class, 'adminRegister'])->middleware(['auth:sanctum', 'admin']);
Route::post('/founder/create-profile', [RegistrationController::class, 'createFounderProfile'])->middleware(['auth:sanctum', 'admin']);

// Pitch Deck Routes
Route::get('/pitch-decks', [PitchDeckController::class, 'index'])->middleware('auth:sanctum');
Route::get('/pitch-decks/{id}', [PitchDeckController::class, 'show'])->middleware('auth:sanctum');
//Route::middleware('auth')->get('/pitch-decks/{id}/download', [App\Http\Controllers\PitchDeckController::class, 'download']);
Route::get('/pitch-decks/{id}/download', [PitchDeckController::class, 'download'])->middleware(['auth:sanctum', 'isinvestor']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/pitch-decks', [PitchDeckController::class, 'store']);
    Route::put('/pitch-decks/{id}', [PitchDeckController::class, 'update']);
    Route::delete('/pitch-decks/{id}', [PitchDeckController::class, 'destroy']);
});

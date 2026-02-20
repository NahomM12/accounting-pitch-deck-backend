<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\FounderController;
use App\Http\Controllers\PitchDeckController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ThumbnailController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [RegistrationController::class, 'login']);
Route::post('/investors/register', [RegistrationController::class, 'investorRegister']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('users', UserController::class);
Route::apiResource('founders', FounderController::class)->middleware('auth:sanctum');

Route::post('/admin/register', [RegistrationController::class, 'adminRegister'])->middleware(['auth:sanctum', 'superadmin']);
Route::post('/founder/create-profile', [RegistrationController::class, 'createFounderProfile']);
//->middleware(['auth:sanctum', 'superadmin']);

// Pitch Deck Routes
Route::get('/pitch-decks', [PitchDeckController::class, 'index'])->middleware('auth:sanctum');
Route::get('/pitch-decks/{id}', [PitchDeckController::class, 'show'])->middleware('auth:sanctum');
// Public pitch deck browsing (published only)
Route::get('/public/pitch-decks', [PitchDeckController::class, 'publicIndex']);
Route::get('/public/pitch-decks/{id}', [PitchDeckController::class, 'publicShow']);
//Route::middleware('auth')->get('/pitch-decks/{id}/download', [App\Http\Controllers\PitchDeckController::class, 'download']);
Route::get('/pitch-decks/{id}/download', [PitchDeckController::class, 'download'])->middleware(['auth:sanctum']);
Route::post('/pitch-decks', [PitchDeckController::class, 'store'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::put('/pitch-decks/{id}', [PitchDeckController::class, 'update']);
    Route::delete('/pitch-decks/{id}', [PitchDeckController::class, 'destroy']);
    Route::post('/pitch-decks/{id}/file', [PitchDeckController::class, 'updateFile']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::put('/pitch-decks/{id}/status', [PitchDeckController::class, 'changeStatusByAdmin']);
});
// In routes/api.php - Add this test route


Route::post('/pitch-decks/test-auth', [PitchDeckController::class, 'testAuth'])->middleware('auth:sanctum');



// Thumbnail management routes
Route::middleware('auth:sanctum')->group(function () {
    // Get thumbnail info
    Route::get('/pitch-decks/{pitchDeck}/thumbnail', [ThumbnailController::class, 'show']);
    
    // Upload thumbnail
    Route::post('/pitch-decks/{pitchDeck}/thumbnail', [ThumbnailController::class, 'upload']);
    
    // Delete thumbnail
    Route::delete('/pitch-decks/{pitchDeck}/thumbnail', [ThumbnailController::class, 'delete']);
    
    // Admin-only bulk conversion
    Route::middleware('admin')->post('/thumbnails/bulk-convert', [ThumbnailController::class, 'bulkConvert']);
});

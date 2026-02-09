<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\FounderController;
use App\Http\Controllers\PitchDeckController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [RegistrationController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('users', UserController::class);
Route::apiResource('founders', FounderController::class);

Route::post('/admin/register', [RegistrationController::class, 'adminRegister'])->middleware(['auth:sanctum', 'superadmin']);
Route::post('/founder/create-profile', [RegistrationController::class, 'createFounderProfile']);
//->middleware(['auth:sanctum', 'superadmin']);

// Pitch Deck Routes
Route::get('/pitch-decks', [PitchDeckController::class, 'index'])->middleware('auth:sanctum');
Route::get('/pitch-decks/{id}', [PitchDeckController::class, 'show'])->middleware('auth:sanctum');
//Route::middleware('auth')->get('/pitch-decks/{id}/download', [App\Http\Controllers\PitchDeckController::class, 'download']);
Route::get('/pitch-decks/{id}/download', [PitchDeckController::class, 'download'])->middleware(['auth:sanctum', 'isinvestor']);
Route::post('/pitch-decks', [PitchDeckController::class, 'store'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'superadmin'])->group(function () {
    
    Route::put('/pitch-decks/{id}', [PitchDeckController::class, 'update']);
    Route::delete('/pitch-decks/{id}', [PitchDeckController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::put('/pitch-decks/{id}/status', [PitchDeckController::class, 'changeStatusByAdmin']);
});
// In routes/api.php - Add this test route
Route::middleware('auth:sanctum')->get('/debug-auth', function (Request $request) {
    \Log::info('=== DEBUG AUTH ROUTE CALLED ===');
    \Log::info('Request Headers:', $request->headers->all());
    \Log::info('Bearer Token:', ['token' => $request->bearerToken()]);
    \Log::info('Auth Check:', ['check' => auth()->check()]);
    \Log::info('User via request:', ['user' => $request->user() ? $request->user()->id : 'null']);
    \Log::info('User via auth:', ['user' => auth()->user() ? auth()->user()->id : 'null']);
    
    // Check token in database
    $token = $request->bearerToken();
    if ($token) {
        $tokenHash = hash('sha256', $token);
        $accessToken = \Laravel\Sanctum\PersonalAccessToken::where('token', $tokenHash)->first();
        \Log::info('Token in DB:', [
            'exists' => $accessToken ? 'yes' : 'no',
            'tokenable_id' => $accessToken ? $accessToken->tokenable_id : 'none',
            'last_used' => $accessToken ? $accessToken->last_used_at : 'none'
        ]);
    }
    
    return response()->json([
        'authenticated' => auth()->check(),
        'user_id' => auth()->check() ? auth()->id() : null,
        'bearer_token_received' => $request->bearerToken() ? 'yes' : 'no',
        'token_length' => $request->bearerToken() ? strlen($request->bearerToken()) : 0,
        'headers_sent' => array_keys($request->headers->all()),
        'sanctum_configured' => class_exists(\Laravel\Sanctum\SanctumServiceProvider::class),
    ]);
});

Route::post('/pitch-decks/test-auth', [PitchDeckController::class, 'testAuth'])->middleware('auth:sanctum');
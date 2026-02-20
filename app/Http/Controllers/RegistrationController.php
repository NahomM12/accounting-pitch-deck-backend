<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Founders;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Log;

class RegistrationController extends Controller
{
    /**
     * Authenticate user and return a token.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Admin registers a new user.
     */
    public function adminRegister(Request $request)
    {
        $registrar = $request->user();
      Log::info('Registrar role: ' . $registrar->role);
     Log::info('Registrar ID: ' . $registrar->id);
     Log::info('Request role: ' . $request->input('role'));
     log::debug('registrar role: ' . $registrar->role);
        // Only superadmins can register admins
        if ($request->input('role') === 'admin' && $registrar->role !== 'superadmin') {
            return response()->json(['error' => 'Only superadmins can register new admins.'], 403);
        }
        
        // Cannot register superadmins
        if ($request->input('role') === 'superadmin') {
            return response()->json(['error' => 'Cannot register superadmins via this endpoint.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:' . implode(',', array_keys(User::ROLES)),
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json($user, 201);
    }

    /**
     * Public registration for investors.
     */
    public function investorRegister(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'investors',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }
}

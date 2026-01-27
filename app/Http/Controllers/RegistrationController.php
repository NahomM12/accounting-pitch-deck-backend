<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Founders;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

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
     * Admin creates a new founder profile.
     */
    public function createFounderProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:255',
            'sector' => 'required|string|max:255',
            'location' => 'required|string|in:addis ababa,diredawa,hawassa,bahirdar,gondar,mekele',
            'funding_stage' => 'required|string|in:pre-seed,seed,series A,series B,series C,IPO',
            'valuation' => 'required|string|in:pre-seed,seed,series A,series B,series C,IPO',
            'years_of_establishment' => 'required|string|max:255',
            'funding_amount' => 'required|numeric',
            'description' => 'required|string',
            'number_of_employees' => 'required|string|in:1-10,11-50,51-200,201-500,501-1000,1001+',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $founder = Founders::create($request->all());

        return response()->json($founder, 201);
    }
}

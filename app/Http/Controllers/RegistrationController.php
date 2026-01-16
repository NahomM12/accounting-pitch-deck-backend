<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PitchDeck;
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
            'industry' => 'required_if:role,investors|string|max:255',
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

        if ($request->role === 'investors') {
            PitchDeck::create([
                'user_id' => $user->id,
                'industry' => $request->industry,
            ]);
        }
        
        $user->load('pitchDeck');

        return response()->json($user, 201);
    }

    /**
     * Founder completes their pitch deck.
     */
    public function founderCompletePitchDeck(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'founders') {
            return response()->json(['error' => 'Only founders can complete a pitch deck.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'funding_stage' => 'required|string|max:255',
            'funding_amount' => 'required|numeric',
            'description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $pitchDeck = PitchDeck::updateOrCreate(
            ['user_id' => $user->id],
            $request->all()
        );

        $status = $pitchDeck->wasRecentlyCreated ? 201 : 200;

        return response()->json($pitchDeck, $status);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PitchDeck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegistrationController extends Controller
{
    /**
     * Admin registers a new user.
     */
    public function adminRegister(Request $request)
    {
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

        return response()->json($pitchDeck, 201);
    }
}

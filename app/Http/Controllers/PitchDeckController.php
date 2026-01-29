<?php

namespace App\Http\Controllers;

use App\Models\PitchDeck;
use App\Models\PitchDeckDownload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PitchDeckController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Eager load founder information
        $pitchDecks = PitchDeck::with('founder')->where('status', 'published')->get();
        return response()->json($pitchDecks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'founder_id' => 'required|exists:founders,id',
            'file' => 'required|file|mimes:pdf,ppt,pptx|max:20480', // 20MB Max
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $file = $request->file('file');
        // Store on a non-public disk (use 'local' or a configured private disk) so files aren't directly web-accessible.
        $filePath = $file->store('pitch_decks', 'local');

        $pitchDeck = PitchDeck::create([
            'founder_id' => $reques            <?php
            Route::middleware('auth')->get('/pitch-decks/{id}/download', [App\Http\Controllers\PitchDeckController::class, 'download']);            <?php
            Route::middleware('auth')->get('/pitch-decks/{id}/download', [App\Http\Controllers\PitchDeckController::class, 'download']);            <?php
            Route::middleware('auth')->get('/pitch-decks/{id}/download', [App\Http\Controllers\PitchDeckController::class, 'download']);            <?php
            Route::middleware('auth')->get('/pitch-decks/{id}/download', [App\Http\Controllers\PitchDeckController::class, 'download']);            <?php
            Route::middleware('auth')->get('/pitch-decks/{id}/download', [App\Http\Controllers\PitchDeckController::class, 'download']);            <?php
            Route::middleware('auth')->get('/pitch-decks/{id}/download', [App\Http\Controllers\PitchDeckController::class, 'download']);            <?php
            Route::middleware('auth')->get('/pitch-decks/{id}/download', [App\Http\Controllers\PitchDeckController::class, 'download']);            <?php
            Route::middleware('auth')->get('/pitch-decks/{id}/download', [App\Http\Controllers\PitchDeckController::class, 'download']);t->founder_id,
            'title' => $request->title,
            'file_path' => $filePath,
            'file_type' => $file->extension(),
            'status' => 'draft', // Always starts as a draft
            'uploaded_by' => $request->user()->id,
            'thumbnail_path' => '', // Placeholder, can be generated later
        ]);

        return response()->json($pitchDeck, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $pitchDeck = PitchDeck::with('founder')->where('status', 'published')->findOrFail($id);
        return response()->json($pitchDeck);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $pitchDeck = PitchDeck::findOrFail($id);
          $this->authorize('update', $pitchDeck);
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|string|in:draft,published,archived',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $pitchDeck->update($request->only('title', 'status'));

        return response()->json($pitchDeck);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $pitchDeck = PitchDeck::findOrFail($id);
        $this->authorize('delete', $pitchDeck);

        Storage::disk('public')->delete($pitchDeck->file_path);
        $pitchDeck->delete();

        return response()->json(null, 204);
    }

    /**
     * Download the specified pitch deck.
     */
    public function download(Request $request, $id)
    {
        // Require an authenticated user for downloads
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }
    public function download(Request $request, $id)
    {
        $pitchDeck = PitchDeck::where('status', 'published')->findOrFail($id);

        // Log the download
        PitchDeckDownload::create([
            'user_id' => $request->user()->id,
            'pitch_deck_id' => $pitchDeck->id,
            'downloaded_at' => now(),
            'ip_address' => $request->ip(),
        ]);

        $safeTitle = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $pitchDeck->title);
        return Storage::disk('public')->download($pitchDeck->file_path, $safeTitle . '.' . $pitchDeck->file_type);
    }
}

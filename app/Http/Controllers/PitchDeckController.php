<?php

namespace App\Http\Controllers;

use App\Models\PitchDeck;
use App\Models\PitchDeckDownload;
use App\Models\AdminActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

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
     \Log::info('=== FILE UPLOAD DEBUG ===');
    
    // Check what's in the request
    \Log::info('All request data:', $request->all());
    \Log::info('Has file in request: ' . ($request->hasFile('file') ? 'YES' : 'NO'));
    \Log::info('All files in request:', $request->allFiles());
    \Log::info('Request headers:', $request->headers->all());
    try {
        // Get authenticated user
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'founder_id' => 'required|exists:founders,id',
            'file' => 'required|file|mimes:pdf,ppt,pptx|max:20480', // 20MB Max
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

         // Get the uploaded file
        $file = $request->file('file');
        \Log::info('File object:', [
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'extension' => $file->getClientOriginalExtension(),
            'is_valid' => $file->isValid()
        ]);
        
        // Get the file extension
        $extension = strtolower($file->getClientOriginalExtension());
        
        // Validate extension matches allowed types
        if (!in_array($extension, ['pdf', 'ppt', 'pptx'])) {
            return response()->json([
                'file' => ['Invalid file type. Only PDF, PPT, and PPTX files are allowed.']
            ], 422);
        }
        
        // Generate a unique filename
        $originalName = $file->getClientOriginalName();
        $fileName = time() . '_' . Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '.' . $extension;
        
        // Store the file - using 'public' disk for web access
        $filePath = $file->storeAs('pitch_decks', $fileName, 'public');
        
        if (!$filePath) {
            throw new \Exception('Failed to store file');
        }
        
        // Create the pitch deck record
        $pitchDeck = PitchDeck::create([
            'founder_id' => $request->founder_id,
            'title' => $request->title,
            'file_path' => $filePath,
            'file_type' => $extension,
            'thumbnail_path' => null,
            'status' => 'draft',
            'uploaded_by' => $user->id,
        ]);
        // Log admin activity for adding a pitch deck
        try {
            $this->logAdminActivity($request, 'add_pitchdeck', 'PitchDeck', $pitchDeck->id, [
                'title' => $pitchDeck->title,
                'founder_id' => $pitchDeck->founder_id,
                'file_path' => $pitchDeck->file_path,
            ]);
        } catch (\Throwable $e) {
            \Log::warning('Failed to log admin activity: ' . $e->getMessage());
        }
        
        // Generate full URL
        $fileUrl = asset('storage/' . $filePath);
        
        return response()->json([
            'message' => 'Pitch deck uploaded successfully',
            'pitch_deck' => $pitchDeck,
            'file_url' => $fileUrl
        ], 201);
        
    } catch (\Exception $e) {
        \Log::error('Error in PitchDeckController@store', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return response()->json([
            'error' => 'Internal server error',
            'message' => $e->getMessage()
        ], 500);
    }
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

        // Log admin activity for editing a pitch deck
        try {
            $this->logAdminActivity($request, 'edit_pitchdeck', 'PitchDeck', $pitchDeck->id, $request->only('title', 'status'));
        } catch (\Throwable $e) {
            \Log::warning('Failed to log admin activity: ' . $e->getMessage());
        }

        return response()->json($pitchDeck);
    }

    /**
     * Change the status of a pitch deck (admin only).
     */
    /**
 * Change the status of a pitch deck (admin only).
 * Admin can change from draft→published, published→archived, etc.
 */
public function changeStatusByAdmin(Request $request, $id)
{
    // Check if user is admin or superadmin
    $user = $request->user();
    
    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    
    // Check user role - adjust based on your User model
    $allowedRoles = ['admin', 'superadmin'];
    if (!in_array($user->role, $allowedRoles)) {
        return response()->json([
            'message' => 'Forbidden. Only admins and superadmins can change pitch deck status.',
            'user_role' => $user->role
        ], 403);
    }
    
    $validator = Validator::make($request->all(), [
        'status' => 'required|string|in:draft,published,archived',
        'notes' => 'nullable|string|max:1000', // Optional admin notes
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    $pitchDeck = PitchDeck::findOrFail($id);
    
    // Log the status change
    $oldStatus = $pitchDeck->status;
    $newStatus = $request->input('status');
    
    // Update the pitch deck
    $pitchDeck->update([
        'status' => $newStatus,
        // If you want to track who changed the status and when:
        // 'status_changed_by' => $user->id,
        // 'status_changed_at' => now(),
    ]);
    
    // Log the action
    \Log::info('Pitch deck status changed', [
        'pitch_deck_id' => $pitchDeck->id,
        'title' => $pitchDeck->title,
        'old_status' => $oldStatus,
        'new_status' => $newStatus,
        'changed_by' => $user->id,
        'changed_by_email' => $user->email,
        'notes' => $request->input('notes', '')
    ]);

    // Persist admin activity
    try {
        $this->logAdminActivity($request, 'change_status', 'PitchDeck', $pitchDeck->id, [
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'notes' => $request->input('notes', ''),
        ]);
    } catch (\Throwable $e) {
        \Log::warning('Failed to log admin activity: ' . $e->getMessage());
    }

    return response()->json([
        'message' => 'Pitch deck status updated successfully',
        'pitch_deck' => $pitchDeck,
        'changes' => [
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by' => $user->email
        ]
    ]);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $pitchDeck = PitchDeck::findOrFail($id);
        $this->authorize('delete', $pitchDeck);

        // Log admin activity for deleting a pitch deck (before delete so we capture data)
        try {
            $this->logAdminActivity($request, 'delete_pitchdeck', 'PitchDeck', $pitchDeck->id, [
                'title' => $pitchDeck->title,
                'file_path' => $pitchDeck->file_path,
            ]);
        } catch (\Throwable $e) {
            \Log::warning('Failed to log admin activity: ' . $e->getMessage());
        }

        Storage::disk('public')->delete($pitchDeck->file_path);
        $pitchDeck->delete();

        return response()->json(null, 204);
    }

    /**
     * Helper to persist admin activity logs.
     */
    protected function logAdminActivity(Request $request, string $action, ?string $subjectType = null, $subjectId = null, array $data = [])
    {
        $user = $request->user() ?? auth()->user();
        if (! $user) {
            return;
        }

        AdminActivity::create([
            'admin_user_id' => $user->id,
            'action' => $action,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'data' => $data ?: null,
            'ip_address' => $request->ip(),
        ]);
    }

    /**
     * Download the specified pitch deck.
     */
   
    public function download(Request $request, $id)
    {
         if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
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
    public function testAuth(Request $request)
{
    \Log::info('=== TEST AUTH ENDPOINT ===');
    \Log::info('Headers:', $request->headers->all());
    \Log::info('Auth check: ' . (auth()->check() ? 'TRUE' : 'FALSE'));
    \Log::info('User: ' . (auth()->user() ? auth()->user()->id : 'NULL'));
    
    return response()->json([
        'authenticated' => auth()->check(),
        'user_id' => auth()->check() ? auth()->id() : null,
        'token' => $request->bearerToken(),
    ]);
}
}

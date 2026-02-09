<?php

namespace App\Http\Controllers;

use App\Models\Founders;
use Illuminate\Http\Request;
//use Debugbar;

class FounderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    \Log::info('=== FounderController::index() Called ===');
    
    // Log database connection info
    \Log::info('Database: ' . config('database.default'));
    \Log::info('Table prefix: ' . config('database.connections.mysql.prefix', 'none'));
    
    // Get count before fetching
    $count = Founders::count();
    \Log::info("Total founders in database: {$count}");
    
    // Get all founders with raw SQL for comparison
    $founders = Founders::all();
    \Log::info("Founders fetched: " . $founders->count());
    
    // Log SQL query
    \Log::info("SQL Query: " . Founders::toSql());
    
    return response()->json($founders);
}
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
              'company_name' => 'required|string|max:255',
            'sector' => 'required|string|max:255',
            'location' => 'required|string|in:addis ababa,diredawa,hawassa,bahirdar,gondar,mekele',
            'funding_stage' => 'required|string|in:pre-seed,seed,series A,series B,series C,IPO',
            'valuation' => 'required|string|in:pre-seed,seed,series A,series B,series C,IPO',
            'years_of_establishment' => 'required|integer|min:1900|max:' . date('Y'),
            'funding_amount' => 'required|numeric',
            'description' => 'required|string|max:10000',
            'number_of_employees' => 'required|string|in:1-10,11-50,51-200,201-500,501-1000,1001+',
            'funding_amount' => 'required|numeric',
            'description' => 'required|string',
            'number_of_employees' => 'required|string|in:1-10,11-50,51-200,201-500,501-1000,1001+',
        ]);

        $founder = Founders::create($validated);

        return response()->json($founder, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Founders $founder)
    {
        return $founder;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Founders $founder)
    {
        $validated = $request->validate([
            'company_name' => 'sometimes|required|string|max:255',
            'website' => 'sometimes|nullable|string|max:255',
            'industry' => 'sometimes|nullable|string|max:255',
        ]);

        $founder->update($validated);

        return response()->json($founder);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Founders $founder)
    {
        $founder->delete();

        return response()->json(null, 204);
    }
}

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
    public function index(Request $request)
    {
        \Log::info('=== FounderController::index() Called ===', [
            'query' => $request->query(),
        ]);

        $query = Founders::query();

        if ($request->filled('company_name')) {
            $query->where('company_name', 'like', '%' . $request->input('company_name') . '%');
        }

        if ($request->filled('sector')) {
            $query->where('sector', $request->input('sector'));
        }

        if ($request->filled('location')) {
            $query->where('location', $request->input('location'));
        }

        if ($request->filled('funding_stage')) {
            $query->where('funding_stage', $request->input('funding_stage'));
        }

        if ($request->filled('valuation')) {
            $query->where('valuation', $request->input('valuation'));
        }

        if ($request->filled('years_of_establishment')) {
            $query->where('years_of_establishment', $request->input('years_of_establishment'));
        }

        if ($request->filled('min_funding_amount')) {
            $query->where('funding_amount', '>=', (float) $request->input('min_funding_amount'));
        }

        if ($request->filled('max_funding_amount')) {
            $query->where('funding_amount', '<=', (float) $request->input('max_funding_amount'));
        }

        if ($request->filled('funding_amount')) {
            $query->where('funding_amount', (float) $request->input('funding_amount'));
        }

        if ($request->filled('description')) {
            $query->where('description', 'like', '%' . $request->input('description') . '%');
        }
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('number_of_employees')) {
            $query->where('number_of_employees', $request->input('number_of_employees'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', '%' . $search . '%')
                    ->orWhere('sector', 'like', '%' . $search . '%')
                    ->orWhere('location', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        $sortableFields = [
            'id',
            'company_name',
            'sector',
            'location',
            'funding_stage',
            'valuation',
            'years_of_establishment',
            'funding_amount',
            'status',
            'number_of_employees',
            'created_at',
            'updated_at',
        ];

        $sortBy = $request->input('sort_by', 'created_at');
        if (!in_array($sortBy, $sortableFields, true)) {
            $sortBy = 'created_at';
        }

        $sortDirection = strtolower($request->input('sort_direction', 'desc')) === 'asc' ? 'asc' : 'desc';

        $founders = $query->orderBy($sortBy, $sortDirection)->get();

        \Log::info('FounderController::index() result', [
            'count' => $founders->count(),
            'sort_by' => $sortBy,
            'sort_direction' => $sortDirection,
        ]);

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

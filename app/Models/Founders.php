<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Founders extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'sector',
        'location',
        'funding_stage',//enum: pre-seed, seed, series A, series B, series C, IPO
        'valuation',//enum: pre-seed, seed, series A, series B, series C, IPO
        'years of establishment',
        'funding_amount',
        'description',
        'file_path',
        'status',
        'number of employees',//enum: 1-10, 11-50, 51-200, 201-500, 501-1000, 1001+
    ];

    public function reviews()
    {
        return $this->hasMany(AdminReview::class);
    }
}

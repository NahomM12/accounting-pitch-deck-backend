<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_user_id',
        'action',
        'subject_type',
        'subject_id',
        'data',
        'ip_address',
    ];

    protected $casts = [
        'data' => 'array',
    ];
}

<?php

namespace App\Models\Self_service;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Callback extends Model
{
    // use HasFactory;

    protected $table = 'app_portal_callback';

    protected $fillable = [
        'client_id',
        'failed_count',
        'first_attempt_date',
        'second_attempt_date',
        'third_attempt_date',
        'created_at',
        'updated_at'
    ];
}

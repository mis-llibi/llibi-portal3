<?php

namespace App\Models\Self_service;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RemainingTbl extends Model
{
    use HasFactory;


    protected $table = 'app_remaining';

    protected $fillable = [
        'uniquecode',
        'allow',
    ];

    public $timestamps = false;
}

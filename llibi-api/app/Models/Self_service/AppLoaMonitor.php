<?php

namespace App\Models\Self_service;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppLoaMonitor extends Model
{
    use HasFactory;

    protected $connection = 'mysql';
    protected $table = 'app_loa_monitor';
}

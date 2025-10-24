<?php

namespace App\Models\Self_service;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnumerateProcedure extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $table = "app_portal_lab_enumerate";

    protected $fillable = [
        'request_id',
        'procedure_name',
        'cost',
        'status'
    ];
}

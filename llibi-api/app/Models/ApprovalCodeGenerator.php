<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApprovalCodeGenerator extends Model
{
    use HasFactory;

    protected $connection = 'portal_request_db';
    protected $table = 'approval_code_generators';

    protected $fillable = [
        'hospital_code',
        'date',
        'count'
    ];
}

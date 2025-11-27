<?php

namespace App\Models\Self_service;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RemainingTblLogs extends Model
{
    use HasFactory;

    protected $table = 'remaining_tbl_logs';

    protected $fillable = [
        'member_id',
    ];
}

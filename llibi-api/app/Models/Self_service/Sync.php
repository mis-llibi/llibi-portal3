<?php

namespace App\Models\Self_service;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sync extends Model
{
    use HasFactory;

    protected $connection = 'mysql_sync';
    protected $table = 'masterlist';

    protected $fillable = [
        'member_id',
        'last_name',
        'first_name',
        'middle_name',
        'relation',
        'birth_date',
        'email',
    ];
}

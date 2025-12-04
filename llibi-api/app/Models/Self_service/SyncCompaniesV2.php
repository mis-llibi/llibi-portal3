<?php

namespace App\Models\Self_service;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyncCompaniesV2 extends Model
{
    use HasFactory;

    protected $connection = 'mysql_sync';
    protected $table = 'companies_v2';

}

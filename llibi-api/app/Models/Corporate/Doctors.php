<?php

namespace App\Models\Corporate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctors extends Model
{
    use HasFactory;

    protected $connection = 'mysql_corporate';
    protected $table = 'doctors';
}

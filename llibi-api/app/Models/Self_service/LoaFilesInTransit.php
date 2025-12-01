<?php

namespace App\Models\Self_service;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoaFilesInTransit extends Model
{
    use HasFactory;

    protected $connection = 'ebd_current';
    protected $table = 'loa_files_in_transits';
}

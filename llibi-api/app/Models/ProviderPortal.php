<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProviderPortal extends Model
{
    use HasFactory;

    protected $connection = 'portal_request_db';
    protected $table = 'provider_portals';
}

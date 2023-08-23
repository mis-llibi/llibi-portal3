<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportSetting extends Model
{
  use HasFactory;

  protected $table = 'settings';
  protected $fillable = ['minutes', 'sender', 'receiver_email'];
}

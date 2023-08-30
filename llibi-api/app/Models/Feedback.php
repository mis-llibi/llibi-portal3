<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
  use HasFactory;

  protected $table = 'feedbacks';
  protected $fillable = ['request_id', 'company_code', 'member_id', 'request_status', 'rating', 'comments'];
}

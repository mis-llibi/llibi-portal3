<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
  use HasFactory;

  protected $table = 'feedbacks';
  protected $fillable = [
    'request_id', 'company_code', 'member_id', 'request_status', 'question1', 'question2', 'question3', 'question4', 'comments', 'is_manual'
  ];
}

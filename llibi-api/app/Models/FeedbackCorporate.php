<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackCorporate extends Model
{
  use HasFactory;

  protected $table = 'feedbacks_corporate';
  protected $fillable = [
    'company_code', 'member_id', 'approval_code', 'question1', 'question2', 'question3', 'question4', 'question5', 'comments'
  ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdmuFeedback extends Model
{
  use HasFactory;

  protected $table = 'feedbacks_admu';

  protected $fillable = [
    'company_code',
    'question1',
    'question2',
    'question3',
    'question4',
    'comments',
  ];
}

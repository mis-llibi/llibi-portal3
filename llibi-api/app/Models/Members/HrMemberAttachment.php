<?php

namespace App\Models\Members;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HrMemberAttachment extends Model
{
  use HasFactory;

  protected $table = 'hr_member_attachments';

  protected $fillable = [
    'link_id',
    'file_name',
    'file_link',
  ];
}

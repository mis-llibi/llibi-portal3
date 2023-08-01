<?php

namespace App\Models\Members;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class hr_members extends Model
{
    use HasFactory;

    protected $table = 'hr_members';

    protected $fillable = [
        'employee_no',
        'first_name',
        'middle_name',
        'last_name',
        'extension',
        'gender',
        'member_type',
        'birth_date',
        'relationship_id',
        'civil_status',
        'effective_date',
        'date_hired',
        'reg_date',
        'if_enrollee_is_a_philhealth_member',
        'client_remarks',
        'status',
    ];
}

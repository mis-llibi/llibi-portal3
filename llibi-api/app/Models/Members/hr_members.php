<?php

namespace App\Models\Members;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class hr_members extends Model
{
  use HasFactory;

  protected $table = 'hr_members';

  protected $fillable = [
    'client_company',
    'member_id',
    'employee_no',
    'hash',
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
    'admin_remarks',
    'status',
    'late_enrolled_remarks',
    'changed_status_at',
    'attachments',
    'created_by',
    'excel_batch',
    'pending_submission_created_at',
    'pending_cancellation_at',
    'plan',
    'action_code',
  ];

  protected function middleName(): Attribute
  {
    return Attribute::make(
      get: fn (string $value) => $value ?? '',
      set: fn (string $value) => $value ?? ''
    );
  }

  public function scopePendingSubmission(Builder $query): void
  {
    $query->where('status', 1);
  }

  public function scopeSumittedMembers(Builder $query): void
  {
    $query->where('status', 2);
  }

  public function scopePendingDeletion(Builder $query): void
  {
    $query->where('status', 3);
  }

  public function scopeApprovedMembers(Builder $query): void
  {
    $query->where('status', 4);
  }

  public function scopePendingCorrection(Builder $query): void
  {
    $query->where('status', 5);
  }

  public function scopeApprovedCorrection(Builder $query): void
  {
    $query->where('status', 6);
  }

  public function scopeDeletedMember(Builder $query): void
  {
    $query->where('status', 7);
  }

  public function scopePrincipal(Builder $query): void
  {
    $query->where('relationship_id', 'PRINCIPAL');
  }
}

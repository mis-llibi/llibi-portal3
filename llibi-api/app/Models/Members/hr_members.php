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
    'pending_deleted_at',
    'plan',
    'action_code',
    'certificate_no',
    'certificate_issued_at',
    'change_plan_at',
    'deleted_remarks',
    'approved_deleted_member_at',
    'approved_by',
    'approved_member_at',
    'approved_change_plan_at',
    'nationality',
    'approved_deleted_member_at_original',
  ];

  protected $appends = ['status_name'];

  protected function middleName(): Attribute
  {
    return Attribute::make(
      get: fn (string $value) => $value ?? '',
      set: fn (string $value) => $value ?? ''
    );
  }

  protected function statusName(): Attribute
  {
    return Attribute::make(
      get: function () {
        return match ($this->status) {
          1 => 'Pending Member',
          3 => 'Pending Deletion',
          5 => 'Pending Correction',
          8 => 'Pending Change Plan',
          default => '',
        };
      },
    );
  }

  public function scopePendingSubmission(Builder $query): void
  {
    $query->where('status', 1);
  }

  // public function scopeSumittedMembers(Builder $query): void
  // {
  //   $query->where('status', 2);
  // }

  public function scopePendingDeletion(Builder $query): void
  {
    $query->where('status', 3);
  }

  public function scopeApprovedMembers(Builder $query): void
  {
    // $query->where('status', 4);
    $query->whereNotNull('approved_member_at')->where('status', '<>', 7);
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

  public function scopePendingChangePlan(Builder $query): void
  {
    $query->where('status', 8);
  }

  public function scopeApprovedChangePlan(Builder $query): void
  {
    $query->where('status', 9);
  }

  public function scopePendingApproval(Builder $query): void
  {
    /**
     * 1 pending submission
     * 3 Pending deletion
     * 5 pending correction
     * 8 pending change plan
     */
    $query->whereIn('status', [1, 3, 5, 8]);
  }

  public function scopePrincipal(Builder $query): void
  {
    $query->where('relationship_id', 'PRINCIPAL');
  }

  public function changePlanPending()
  {
    return $this->hasOne(HrMemberChangePlanCorrection::class, 'member_link_id', 'id')->orderByDesc('id');
  }
}

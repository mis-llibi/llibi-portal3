<?php

namespace App\Models\Members;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

use App\Enums\Broadpath\Members\StatusEnum;

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

  // protected $guarded = [];

  protected $appends = ['status_name', 'full_name'];

  /* 
    * #####################
    * # LEGENDS OF STATUS #
    * #####################

    * 1 pending submission
    * 3 Pending deletion
    * 5 pending correction
    * 8 pending change plan

    * all this status is considered as active
    * 4 approved/active members
    * 6 approved correction
    * 7 approved deletion
    * 9 approved change plan
    * 10 disapproved member
  */

  protected function middleName(): Attribute
  {
    return Attribute::make(
      get: fn (string $value) => $value ?? '',
      set: fn (string $value) => $value ?? ''
    );
  }

  protected function fullName(): Attribute
  {
    return Attribute::make(
      get: fn () => $this->last_name . ', ' . $this->first_name . ' ' . $this->middle_name,
    );
  }

  protected function statusName(): Attribute
  {
    return Attribute::make(
      get: function () {
        return match ($this->status) {
          // pending
          StatusEnum::PENDING_MEMBER => 'Pending Member',
          StatusEnum::PENDING_DELETION => 'Pending Deletion',
          StatusEnum::PENDING_CORRECTION => 'Pending Correction',
          StatusEnum::PENDING_CHANGE_PLAN => 'Pending Change Plan',

          // approve or active
          StatusEnum::ACTIVE_MEMBER => 'Approved Member',
          StatusEnum::APPROVED_CORRECTION => 'Approved Correction',
          StatusEnum::APPROVED_DELETION => 'Approved Deletion',
          StatusEnum::APPROVED_CHANGE_PLAN => 'Approved Change Plan',
          StatusEnum::DISAPPROVED_MEMBER => 'Disapproved Member',
          default => '',
        };
      },
    );
  }

  public function scopePendingSubmission(Builder $query): void
  {
    $query->where('status', StatusEnum::PENDING_MEMBER);
  }

  // public function scopeSumittedMembers(Builder $query): void
  // {
  //   $query->where('status', 2);
  // }

  public function scopePendingDeletion(Builder $query): void
  {
    $query->where('status', StatusEnum::PENDING_DELETION);
  }

  public function scopeApprovedMembers(Builder $query): void
  {
    // $query->where('status', 4);
    $query->whereNotNull('approved_member_at')->where('status', '<>', StatusEnum::APPROVED_DELETION);
  }

  public function scopePendingCorrection(Builder $query): void
  {
    $query->where('status', StatusEnum::PENDING_CORRECTION);
  }

  public function scopeApprovedCorrection(Builder $query): void
  {
    $query->where('status', StatusEnum::APPROVED_CORRECTION);
  }

  public function scopeDeletedMember(Builder $query): void
  {
    $query->where('status', StatusEnum::APPROVED_DELETION);
  }

  public function scopePendingChangePlan(Builder $query): void
  {
    $query->where('status', StatusEnum::PENDING_CHANGE_PLAN);
  }

  public function scopeApprovedChangePlan(Builder $query): void
  {
    $query->where('status', StatusEnum::APPROVED_CHANGE_PLAN);
  }

  public function scopeActiveMembers(Builder $query): void
  {
    /**
     * 4 approved/active members
     * 6 approved correction
     * 7 approved deletion
     * 9 approved change plan
     * 10 disapproved member
     */
    $query->whereIn('status', [
      StatusEnum::ACTIVE_MEMBER,
      StatusEnum::APPROVED_CORRECTION,
      StatusEnum::APPROVED_DELETION,
      StatusEnum::APPROVED_CHANGE_PLAN,
      StatusEnum::DISAPPROVED_MEMBER
    ]);
  }

  public function scopePendingApproval(Builder $query): void
  {
    /**
     * 1 pending submission
     * 3 Pending deletion
     * 5 pending correction
     * 8 pending change plan
     */
    $query->whereIn('status', [
      StatusEnum::PENDING_MEMBER,
      StatusEnum::PENDING_DELETION,
      StatusEnum::PENDING_CORRECTION,
      StatusEnum::PENDING_CHANGE_PLAN
    ]);
  }

  public function scopePrincipal(Builder $query): void
  {
    $query->where('relationship_id', 'PRINCIPAL');
  }

  public function scopeDisapprovedMember(Builder $query): void
  {
    $query->where('status', StatusEnum::DISAPPROVED_MEMBER);
  }


  // ELOQUENT RELATIONSHIP
  public function changePlanPending(): HasOne
  {
    return $this->hasOne(HrMemberChangePlanCorrection::class, 'member_link_id', 'id')->orderByDesc('id');
  }

  public function contact(): HasOne
  {
    return $this->hasOne(hr_contact::class, 'link_id', 'id');
  }
}

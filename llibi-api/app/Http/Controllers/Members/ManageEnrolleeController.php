<?php

namespace App\Http\Controllers\Members;

use App\Exports\Members\LateEnrolledExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Imports\Members\MasterlistImport;
use Maatwebsite\Excel\Facades\Excel;

use App\Models\Members\hr_members;
use App\Models\Members\hr_contact;
use App\Models\Members\hr_philhealth;

use App\Models\Members\hr_members_correction;
use App\Models\Members\hr_contact_correction;
use App\Models\Members\hr_philhealth_correction;
use App\Services\SendingEmail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ManageEnrolleeController extends Controller
{
  public function getEnrollees($status)
  {
    $list = DB::table('hr_members as t1')
      ->join('hr_contact as t2', 't1.id', '=', 't2.link_id')
      ->join('hr_philhealth as t3', 't1.id', '=', 't3.link_id')
      ->select('t1.id', 't1.*', 't2.*', 't3.*')
      ->where('t1.status', $status)
      ->orderBy('t1.id', 'DESC')
      ->get();

    $pending = hr_members::where('status', 1)->get();
    $for_enrollment = hr_members::where('status', 2)->get();
    $enrolled = hr_members::where('status', 4)->get();
    $denied = hr_members::where('status', 6)->get();
    $for_deletion = hr_members::where('status', 3)->get();
    $for_correction = hr_members::where('status', 7)->get();
    $for_cancellation = hr_members::where('status', 8)->get();
    $cancelled = hr_members::where('status', 9)->get();

    //$pending = array_count_values(array_column($members, 'status'))[$pending];
    return array(
      'list' => $list,
      'pending' => count($pending),
      'for_enrollment' => count($for_enrollment),
      'enrolled' => count($enrolled),
      'denied' => count($denied),
      'for_deletion' => count($for_deletion),
      'for_correction' => count($for_correction),
      'for_cancellation' => count($for_cancellation),
      'cancelled' => count($cancelled),
    );
  }

  public function import(Request $request)
  {
    $comp = '';
    $import = new MasterlistImport($comp);
    $excel = Excel::import($import, $request->file);
    $late_enrolled = $import->getLateEnrolledImport();

    // new SendingEmail(
    //   email: 'glenilagan@llibi.com',
    //   body: view('send-late-enrollee-hr-portal'),
    //   subject: 'LATE ENROLLEE - NOTIFICATION',
    //   attachments: [],
    // );


    return response()->json($late_enrolled);
  }

  public function create(Request $request)
  {
    $members = [
      'employee_no' => $request->empno,
      'last_name' => strtolower($request->lastName),
      'first_name' => strtolower($request->firstName),
      'middle_name' => strtolower($request->middleName),
      'extension' => strtoupper($request->extension),
      'gender' => strtoupper($request->gender),
      'member_type' => strtoupper($request->memberType),
      'birth_date' => $request->birthDate,
      'relationship_id' => $request->relationshipId,
      'civil_status' => $request->civilStatus,
      'effective_date' => $request->effectiveDate,
      'date_hired' => $request->dateHired,
      'reg_date' => $request->regDate,
      'if_enrollee_is_a_philhealth_member' => strtoupper($request->philHealthMember),
      'client_remarks' => $request->clientRemarks,
      // status 101 means late enrollee
      'status' => Carbon::parse($request->dateHired)->diffInDays(now()) > 30 ? 101 : 1,
      'late_enrolled_remarks' => $request->lapseRemarks,
    ];
    $member = hr_members::create($members);

    $contact = [
      'link_id' => $member->id,
      'street' => $request->street,
      'city' => $request->city,
      'province' => $request->province,
      'zip_code' => $request->zipCode,
      'email' => $request->email,
      'mobile_no' => $request->mobile,
    ];
    hr_contact::create($contact);

    $philHealth = [
      'link_id' => $member->id,
      'philhealth_conditions' => $request->philHealthConditions,
      'position' => $request->position,
      'plan_type' => $request->planType,
      'branch_name' => $request->branchName,
      'philhealth_no' => $request->philHealthNo,
      'senior_citizen_id_no' => $request->seniorCitizenIDNo,
    ];
    hr_philhealth::create($philHealth);
  }

  public function update(Request $request)
  {
    $members = [
      'employee_no' => $request->empno,
      'last_name' => strtolower($request->lastName),
      'first_name' => strtolower($request->firstName),
      'middle_name' => strtolower($request->middleName),
      'extension' => strtoupper($request->extension),
      'gender' => strtoupper($request->gender),
      'member_type' => strtoupper($request->memberType),
      'birth_date' => $request->birthDate,
      'relationship_id' => $request->relationshipId,
      'civil_status' => $request->civilStatus,
      'effective_date' => $request->effectiveDate,
      'date_hired' => $request->dateHired,
      'reg_date' => $request->regDate,
      'if_enrollee_is_a_philhealth_member' => strtoupper($request->philHealthMember),
      'client_remarks' => $request->clientRemarks,
      'status' => 1,
    ];
    hr_members::where('id', $request->id)
      ->update($members);

    $contact = [
      'link_id' => $request->id,
      'street' => $request->street,
      'city' => $request->city,
      'province' => $request->province,
      'zip_code' => $request->zipCode,
      'email' => $request->email,
      'mobile_no' => $request->mobile,
    ];
    hr_contact::where('link_id', $request->id)
      ->update($contact);

    $philHealth = [
      'link_id' => $request->id,
      'philhealth_conditions' => $request->philHealthConditions,
      'position' => $request->position,
      'plan_type' => $request->planType,
      'branch_name' => $request->branchName,
      'philhealth_no' => $request->philHealthNo,
      'senior_citizen_id_no' => $request->seniorCitizenIDNo,
    ];
    hr_philhealth::where('link_id', $request->id)
      ->update($philHealth);
  }

  public function remove(Request $request)
  {
    $members = [
      'status' => 3,
    ];
    hr_members::where('id', $request->id)
      ->update($members);
  }

  public function forEnrollment(Request $request)
  {
    hr_members::where('id', $request->selected)
      ->update(['status' => 2]);
  }

  public function forCancellation(Request $request)
  {
    hr_members::whereIn('id', $request->selected)
      ->update(['status' => 8,]);
  }

  public function revokeCancellation(Request $request)
  {
    hr_members::whereIn('id', $request->selected)
      ->update(['status' => 4]);
  }

  public function forCorrection(Request $request)
  {
    $exists = hr_members_correction::where('link_id', $request->id)
      ->where('status', 1)
      ->exists();

    if ($exists) {

      $this->updateCorrection($request);
    } else {

      $this->createCorrection($request);

      hr_members::where('id', $request->id)
        ->update(['status' => 7]);
    }
  }

  public function createCorrection($request)
  {
    $members = [
      'link_id' => $request->id,
      'employee_no' => $request->empno,
      'last_name' => strtolower($request->lastName),
      'first_name' => strtolower($request->firstName),
      'middle_name' => strtolower($request->middleName),
      'extension' => strtoupper($request->extension),
      'gender' => strtoupper($request->gender),
      'member_type' => strtoupper($request->memberType),
      'birth_date' => $request->birthDate,
      'relationship_id' => $request->relationshipId,
      'civil_status' => $request->civilStatus,
      'effective_date' => $request->effectiveDate,
      'date_hired' => $request->dateHired,
      'reg_date' => $request->regDate,
      'if_enrollee_is_a_philhealth_member' => strtoupper($request->philHealthMember),
      'client_remarks' => $request->clientRemarks,
      'status' => 1,
    ];
    $member = hr_members_correction::create($members);

    $contact = [
      'link_id' => $member->id,
      'street' => $request->street,
      'city' => $request->city,
      'province' => $request->province,
      'zip_code' => $request->zipCode,
      'email' => $request->email,
      'mobile_no' => $request->mobile,
    ];
    hr_contact_correction::create($contact);

    $philHealth = [
      'link_id' => $member->id,
      'philhealth_conditions' => $request->philHealthConditions,
      'position' => $request->position,
      'plan_type' => $request->planType,
      'branch_name' => $request->branchName,
      'philhealth_no' => $request->philHealthNo,
      'senior_citizen_id_no' => $request->seniorCitizenIDNo,
    ];
    hr_philhealth_correction::create($philHealth);
  }

  public function updateCorrection($request)
  {
    $members = [
      'employee_no' => $request->empno,
      'last_name' => strtolower($request->lastName),
      'first_name' => strtolower($request->firstName),
      'middle_name' => strtolower($request->middleName),
      'extension' => strtoupper($request->extension),
      'gender' => strtoupper($request->gender),
      'member_type' => strtoupper($request->memberType),
      'birth_date' => $request->birthDate,
      'relationship_id' => $request->relationshipId,
      'civil_status' => $request->civilStatus,
      'effective_date' => $request->effectiveDate,
      'date_hired' => $request->dateHired,
      'reg_date' => $request->regDate,
      'if_enrollee_is_a_philhealth_member' => strtoupper($request->philHealthMember),
      'client_remarks' => $request->clientRemarks,
      'status' => 1,
    ];
    $member = hr_members_correction::where('link_id', $request->id)
      ->where('status', 1)
      ->update($members);

    $contact = [
      'link_id' => $request->link_id,
      'street' => $request->street,
      'city' => $request->city,
      'province' => $request->province,
      'zip_code' => $request->zipCode,
      'email' => $request->email,
      'mobile_no' => $request->mobile,
    ];
    hr_contact_correction::where('link_id', $request->link_id)
      ->update($contact);

    $philHealth = [
      'link_id' => $request->link_id,
      'philhealth_conditions' => $request->philHealthConditions,
      'position' => $request->position,
      'plan_type' => $request->planType,
      'branch_name' => $request->branchName,
      'philhealth_no' => $request->philHealthNo,
      'senior_citizen_id_no' => $request->seniorCitizenIDNo,
    ];
    hr_philhealth_correction::where('link_id', $request->link_id)
      ->update($philHealth);
  }

  public function revokeCorrection(Request $request)
  {
    hr_members::whereIn('id', $request->selected)
      ->update(['status' => 4]);
    hr_members_correction::whereIn('link_id', $request->selected)
      ->update(['status' => 3]);
  }

  public function getCorrection($id)
  {
    $list = DB::table('hr_members_correction as t1')
      ->join('hr_contact_correction as t2', 't1.id', '=', 't2.link_id')
      ->join('hr_philhealth_correction as t3', 't1.id', '=', 't3.link_id')
      ->select('t1.id', 't1.*', 't2.*', 't3.*')
      ->where('t1.link_id', $id)
      ->where('t1.status', 1)
      ->orderBy('t1.id', 'DESC')
      ->limit(1)
      ->get();

    return $list;
  }

  //Admin
  public function updateEnrollmentStatus(Request $request)
  {
    $members = [
      'certificate_no' => $request->certificateNo,
      'admin_remarks' => $request->adminRemarks,
      'changed_status_at' => date('Y-m-d H:i:s'),
      'status' => $request->changeStatus,
    ];
    hr_members::where('id', $request->id)
      ->update($members);
  }

  public function approveCancellation(Request $request)
  {
    $members = [
      'status' => 9,
    ];
    foreach ($request->selected as $key => $value) {
      hr_members::where('id', $value)
        ->update($members);
    }
  }

  public function exportLateEnrolled()
  {
    $data = hr_members::query()
      ->where('status', 101)
      ->join('hr_contact as hrcon', 'hr_members.id', 'hrcon.link_id',)
      ->join('hr_philhealth as hrphil', 'hr_members.id', 'hrphil.link_id',)
      ->select([
        'hr_members.employee_no',
        'hr_members.first_name',
        'hr_members.last_name',
        'hr_members.middle_name',
        'hr_members.extension',
        'hr_members.gender',
        'hrcon.street',
        'hrcon.city',
        'hrcon.province',
        'hrcon.zip_code',
        'hrcon.email',
        'hrcon.mobile_no',
        'hr_members.member_type',
        'hr_members.birth_date',
        'hr_members.relationship_id',
        'hr_members.civil_status',
        'hr_members.effective_date',
        'hr_members.date_hired',
        'hr_members.reg_date',
        'hr_members.if_enrollee_is_a_philhealth_member',
        'hrphil.philhealth_conditions',
        'hrphil.position',
        'hrphil.plan_type',
        'hrphil.branch_name',
        'hrphil.philhealth_no',
        'hrphil.senior_citizen_id_no',
        'hr_members.client_remarks',
        'hr_members.late_enrolled_remarks',
      ])
      ->get();
    return Excel::download(new LateEnrolledExport($data), 'late-enrolled-' . now()->format('Y-m-d') . '.xlsx');
  }
}

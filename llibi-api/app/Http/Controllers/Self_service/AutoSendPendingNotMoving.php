<?php

namespace App\Http\Controllers\Self_service;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class AutoSendPendingNotMoving extends Controller
{
  public function autoSendEmail()
  {
    $less_fifteen_minutes = Carbon::now()->subMinutes(15)->toDateTimeString();

    $request = DB::table('app_portal_clients as t1')
      ->join('app_portal_requests as t2', 't2.client_id', '=', 't1.id')
      ->leftJoin(env('DB_DATABASE_SYNC') . '.masterlist as mlist', 'mlist.member_id', '=', 't1.member_id')
      ->select(
        't1.id',
        't1.reference_number as refno',
        't1.email as email',
        't1.alt_email as altEmail',
        't1.contact as contact',
        't1.member_id as memberID',
        't1.first_name as firstName',
        't1.last_name as lastName',
        't1.dob as dob',
        // 't1.is_dependent as isDependent',
        // 't1.dependent_member_id as depMemberID',
        // 't1.dependent_first_name as depFirstName',
        // 't1.dependent_last_name as depLastName',
        // 't1.dependent_dob as depDob',
        't1.remarks as remarks',
        't1.status as status',
        // 't2.loa_type as loaType',
        // 't2.loa_number as loaNumber',
        // 't2.approval_code as approvalCode',
        // 't2.loa_attachment as loaAttachment',
        // 't2.complaint as complaint',
        // 't2.lab_attachment as labAttachment',
        // 't2.assessment_q1 as ass1',
        // 't2.assessment_q2 as ass2',
        // 't2.assessment_q3 as ass3',
        't1.created_at as createdAt',
        // 't2.provider_id as providerID',
        // 't2.provider as providerName',
        // 't2.doctor_id as doctorID',
        // 't2.doctor_name as doctorName',
        // 't2.diagnosis as diagnosis',
        't1.approved_date',
        DB::raw('TIMESTAMPDIFF(MINUTE, t1.created_at, t1.approved_date) as elapse_minutes'),
        DB::raw('TIMESTAMPDIFF(HOUR, t1.created_at, t1.approved_date) as elapse_hours'),
        'mlist.company_name',
        't1.is_sent'
      )
      ->where('t1.status', 2)
      ->where('t1.created_at', '>=', $less_fifteen_minutes)
      ->where('is_sent', 0)
      ->orderBy('t1.id', 'DESC')
      ->get();

    return $request;
  }
}

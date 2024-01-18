<?php

namespace App\Http\Controllers\PreApprove;

use App\Http\Controllers\Controller;
use App\Models\PreApprove\PreApprovedLogs;
use Illuminate\Http\Request;

class PreApprovedLogsController extends Controller
{
  public function store(Request $request)
  {
    $employee = $request->employee;
    $laboratory = $request->laboratory;
    $utilization = $request->utilization;
    $preapproved_details = $request->preapproved_details;
    $mbl_amount = $request->mbl_amount;
    $laboratory_amount = $request->laboratory_amount;
    $utilization_amount = $request->utilization_amount;

    $inputs = [
      'member_id' => $employee['masterlist']['member_id'],
      'company' => $employee['masterlist']['company_name'],
      'plan_type' => $employee['companies']['plantype'] . ' ' . $employee['companies']['sharetype'],
      'mbl' => $mbl_amount,
      'reservation' => $employee['reserving_amount'],
      'utilization' => $laboratory_amount,
      'laboratory' => $utilization_amount,
    ];

    $preapproved = PreApprovedLogs::create($inputs);

    return $preapproved;
  }
}

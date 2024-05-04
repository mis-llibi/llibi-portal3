<?php

namespace App\Http\Controllers;

use App\Events\ClientPortal\MemberNotificationEvent;
use App\Models\ClientPortalErrorLogs;
use App\Services\SendingEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClientPortalErrorLogsController extends Controller
{
  public function index()
  {
    $result = ClientPortalErrorLogs::query()->select('id', 'member_id', 'first_name', 'last_name', 'dob', 'is_dependent', 'dependent_member_id', 'dependent_first_name', 'dependent_last_name', 'dependent_dob', 'created_at', 'email', 'company', 'mobile', 'is_allow_to_call', 'fullname', 'deps_fullname', 'notify_status')
      ->orderByDesc('id')
      ->take(100)
      ->get();

    return response()->json($result);
  }

  public function store(Request $request)
  {
    $report_status = ClientPortalErrorLogs::where('id', $request->error_data['id'])->update([
      'fullname' => $request->fullname,
      'deps_fullname' => $request->deps_fullname ?? '',
      'email' => $request->email,
      'company' => $request->company,
      'mobile' => $request->mobile,
      'is_allow_to_call' => $request->is_allow_to_call,
    ]);

    return response()->noContent();
  }

  public function sendNotify(Request $request)
  {
    $notify_to = $request->notifyTo;
    $row = $request->row;


    $data = [
      'notify_to' => $notify_to,
      'member_info' => $row,
      'cae_email' => $request->filled('cae_email') ? $request->cae_email : '',
    ];

    event(new MemberNotificationEvent($data));

    return response()->noContent();
  }
}

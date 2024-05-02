<?php

namespace App\Http\Controllers;

use App\Models\ClientPortalErrorLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClientPortalErrorLogsController extends Controller
{
  public function index()
  {
    $result = ClientPortalErrorLogs::query()->select('id', 'member_id', 'first_name', 'last_name', 'dob', 'is_dependent', 'dependent_member_id', 'dependent_first_name', 'dependent_last_name', 'dependent_dob', 'created_at', 'email', 'company', 'mobile', 'is_allow_to_call', 'fullname', 'deps_fullname')
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
}

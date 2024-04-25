<?php

namespace App\Http\Controllers;

use App\Models\ClientPortalErrorLogs;
use Illuminate\Http\Request;

class ClientPortalErrorLogsController extends Controller
{
  public function index()
  {
    $result = ClientPortalErrorLogs::query()->select('id', 'member_id', 'first_name', 'last_name', 'dob', 'is_dependent', 'dependent_member_id', 'dependent_first_name', 'dependent_last_name', 'dependent_dob', 'created_at')
      ->orderByDesc('id')
      ->take(100)
      ->get();

    return response()->json($result);
  }
}

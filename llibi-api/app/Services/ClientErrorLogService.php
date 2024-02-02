<?php

namespace App\Services;

use App\Models\Self_service\ClientErrorLog;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Str;

class ClientErrorLogService
{

  public static function saveLog($inputs)
  {
    $errorLog = ClientErrorLog::create([
      'request_type' => $inputs['requestType'],

      'member_id' => $inputs['memberID'],
      'first_name' => $inputs['firstName'],
      'last_name' => $inputs['lastName'],
      'dob' => $inputs['dob'],

      'is_dependent' => $inputs['minorDependent'],
      'dependent_member_id' => $inputs['depMemberID'],
      'dependent_first_name' => $inputs['depFirstName'],
      'dependent_last_name' => $inputs['depLastName'],
      'dependent_dob' => $inputs['depDob'],
      'request_loa_type' => Str::upper($inputs['typeLOA']),
    ]);

    Log::info($errorLog);
  }
}

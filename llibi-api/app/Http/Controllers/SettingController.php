<?php

namespace App\Http\Controllers;

use App\Models\ReportSetting;
use Illuminate\Http\Request;

use App\Services\SendingEmail;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
  public function index()
  {
    return ReportSetting::query()->first();
  }

  public function update(Request $request)
  {
    $settings = ReportSetting::find(1);

    $settings->minutes = $request->minutes;
    $settings->receiver = $request->receiver;
    $settings->receiver_email = $request->receiver_email;
    $settings->save();

    return response()->json(['status' => true, 'message' => 'Update success.']);
  }
}

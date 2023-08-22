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
    $settings->sender = $request->sender;
    $settings->save();

    return response()->json(['status' => true, 'message' => 'Update success.']);
  }

  public function send()
  {
    // return Storage::path('public/Self-service/LOA/LLIBI00321/LLIBI NPC Seal of Registration valid until 19 July 2024.pdf');
    // $emailer = new SendingEmail('glenilagan@llibi.com', 'Hello World', 'TEST SUBJ');
    // $response = $emailer->send();
  }
}

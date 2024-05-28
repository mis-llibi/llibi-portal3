<?php

use App\Events\RealtimeNotificationEvent;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api_third_party\BenadEncryptor;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

Route::post('/test/realtime', function (Request $request) {
  $message = $request->message;

  // https://carbon.nesbot.com/docs/#api-humandiff
  $date_created = Carbon::now()->diffForHumans();

  $data = [
    'message' => $message,
    'date_created' => $date_created,
  ];

  event(new RealtimeNotificationEvent($data));

  return 'ok';
});

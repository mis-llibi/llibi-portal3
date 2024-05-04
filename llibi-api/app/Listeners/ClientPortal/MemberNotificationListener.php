<?php

namespace App\Listeners\ClientPortal;

use App\Models\ClientPortalErrorLogs;
use App\Services\SendingEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MemberNotificationListener
{
  /**
   * Create the event listener.
   *
   * @return void
   */
  public function __construct()
  {
    //
  }

  /**
   * Handle the event.
   *
   * @param  object  $event
   * @return void
   */
  public function handle($event)
  {
    $data = $event->data;
    Log::debug($data);

    $notify_to = $data['notify_to'];
    $email = $data['member_info']['email'];
    $member_info = $data['member_info'];

    try {
      DB::beginTransaction();
      switch ($notify_to) {
        case 'member':
          $body = view('client-error-logs.send-notify-member');
          $sending = new SendingEmail('test32llibi@yopmail.com', $body);
          $sending->send();
          break;
        case 'mis':
          $body = view('client-error-logs.send-notify-mis', [
            'member_info' => $member_info,
          ]);
          $sending = new SendingEmail('test32llibi@yopmail.com', $body);
          $sending->send();
          break;
        case 'cae':
          $cae_email = $data['cae_email'];
          Log::info($cae_email);
          // send to cae
          $cae_body = view('client-error-logs.send-notify-cae', [
            'member_info' => $member_info,
          ]);
          $sending = new SendingEmail('test32llibi@yopmail.com', $cae_body);
          $sending->send();

          // send to member
          $member_body = view('client-error-logs.send-notify-member-2-3-days');
          $sending = new SendingEmail('test32llibi@yopmail.com', $member_body);
          $sending->send();
          break;
        default:
          # code...
          break;
      }

      ClientPortalErrorLogs::where('id', $member_info['id'])
        ->update([
          'notify_status' => 1,
        ]);

      DB::commit();
    } catch (\Throwable $th) {
      DB::rollBack();
      throw Log::error($th->getMessage());
    }
  }
}

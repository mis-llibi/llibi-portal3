<?php

namespace App\Console\Commands;

use App\Http\Controllers\NotificationController;
use App\Services\SendingEmail;
use Illuminate\Console\Command;

class CheckingInfobipStatus extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'checking-infobip-status';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Command description';

  /**
   * Execute the console command.
   *
   * @return int
   */
  public function handle()
  {
    $mailer = new SendingEmail('glenilagan@llibi.com', view('send-infobip')->render(), 'INFOBIP WORKING');
    $mailer->send();

    $mailer = new SendingEmail('glenilagan@llibi.com', '<h1>Hello world</h1>', 'HELLO WORLD');
    $mailer->send();

    // $message = [
    //   'body' => view('send-infobip')->render(),
    //   'subject' => 'INFOBIP SMTP',
    // ];
    // (new NotificationController)->NewMail('', 'glenilagan@llibi.com', $message);
  }
}

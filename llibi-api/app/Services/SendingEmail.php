<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SendingEmail
{
  public function __construct(public $email, public $body, public $subject, public $key = 'default')
  {
  }

  private function defaultSendMail()
  {
    try {
      $post_data = [
        'headers' => ['Authorization' => config('app.infobip_key')],
        'multipart' => [
          [
            'name' => 'bulkId',
            'contents' => trim(Str::slug($this->subject))
          ],
          [
            'name' => 'from',
            'contents' => config('app.infobip_sender'),
          ],
          [
            'name' => 'to',
            'contents' => trim($this->email)
          ],
          [
            'name' => 'bcc',
            'contents' => 'glenilagan@llibi.com'
          ],
          [
            'name' => 'subject',
            'contents' => trim($this->subject)
          ],
          [
            'name' => 'html',
            'contents' => $this->body
          ],
          [
            'name' => 'intermediateReport',
            'contents' => 'true'
          ]
        ]
      ];
      $client = new Client();
      $response = $client->post(config('app.infobip_url') . '/email/3/send', $post_data);
      $body = $response->getBody();

      return true;
      // return json_decode($body);
    } catch (\Throwable $th) {
      echo $th;
      Log::error($th);
      return false;
    }
  }

  public function send()
  {
    return $this->defaultSendMail();
  }
}

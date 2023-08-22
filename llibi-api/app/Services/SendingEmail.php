<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SendingEmail
{
  public function __construct(public $email, public $body, public $subject = 'CLIENT CARE PORTAL - NOTIFICATION', public $key = 'default', public $attachments = [])
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
          // [
          //   'name' => 'bcc',
          //   'contents' => 'glenilagan@llibi.com'
          // ],
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

      if (!empty($this->attachments)) {
        foreach ($this->attachments as $key => $file) {
          array_push($post_data['multipart'], [
            'name' => 'attachment',
            'contents' => fopen($file, 'r')
          ]);
        }
      }
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

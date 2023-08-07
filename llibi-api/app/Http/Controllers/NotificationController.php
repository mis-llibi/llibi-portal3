<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class NotificationController extends Controller
{
    // -- All Notification goes here via SMS and EMAIL
    public function SmsNotification($mobile, $message)
    { 
        $ch = curl_init('http://192.159.66.221/goip/sendsms/');

        $parameters = array(
        'auth' => array('username' => "root", 'password' => "LACSONSMS"), //Your API KEY
        'provider' => "SIMNETWORK",
        'number' => $mobile,
        'content' => $message,
        );

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        //Send the parameters set above with the request
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($parameters));

        // Receive response from server
        $output = curl_exec($ch);
        curl_close($ch);

        //print_r(json_decode($output));
        //Show the server response
    }

    public function MailNotification($name, $email, $message)
    {
        Mail::send([], [], function ($mail) use ($name, $email, $message) {

            $subject = (isset($message['subject']) ? $message['subject'] : 'Client Care Portal - Notification');
        
            $mail->to($email, $name)
                ->subject($subject)
                ->html('<h4>'.$message['body'].'</h4>');
            $mail->from('notify@llibi.app');
        
            if (isset($message['bcc'])) 
                $mail->bcc($message['bcc'], $message['name']);
            
            if (isset($message['attachment']))
                foreach ($message['attachment'] as $file) {
                    $mail->attach(Storage::path($file));
                }
            
        });
    }

    public function EncryptedPDFMailNotification($name, $email, $message) {
        try {
            //Mail::to($userEmail)->send($welcomeMailable);
            Mail::send([], [], function ($mail) use ($name, $email, $message) {

                $subject = (isset($message['subject']) ? $message['subject'] : 'Client Care Portal - Notification');
            
                $mail->to($email, $name)
                    ->subject($subject)
                    ->html('<h4>'.$message['body'].'</h4>');
                $mail->from('notify@llibi.app');
            
                if (isset($message['bcc'])) 
                    $mail->bcc($message['bcc'], $message['name']);
                
                if (isset($message['attachment']))
                    foreach ($message['attachment'] as $file) {
                        $mail->attach($file);
                    }
                
            });
        } catch (Exception $e) {
            print_r($e);
        }
    }
}

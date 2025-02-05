<?php

namespace App\Http\Controllers\Callback_Request;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Self_service\Client;
use App\Models\Self_service\ClientRequest;
use App\Events\RealtimeNotificationEvent;
use Illuminate\Support\Carbon;
use App\Models\Self_service\Callback;
use App\Services\SendingEmail;

class CallbackRequest extends Controller
{
    //

    public function getHospitals(){
        $result = DB::connection('mysql_sync')
                    ->table('hospitals')
                    ->get('*');
        return $result;
    }

    public function getMasterlist(Request $request){

        $memberID = $request->emplid;

        $result = DB::table('llibiapp_sync.masterlist')
                    ->select('first_name', 'middle_name', 'last_name')
                    ->where('member_id', '=', $memberID)
                    ->first();
        return $result;
    }




    public function submitCallback(Request $request){
        $resultClients = Client::create([
            'request_type' => 1,
            'reference_number' => strtotime("now"),
            'contact' => $request->data['mobile'],
            'member_id' => $request->emplID,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'status' => 6,
            'opt_landline' => $request->data['landline'],
            'callback_remarks' => $request->data['request'],
            'created_at' => now()
        ]);


        if($resultClients){
            $resultRequests = ClientRequest::create([
                'client_id' => $resultClients->id,
                'member_id' => $resultClients->member_id,
                'provider_id' => $request->data['hospital']['value'] ?? null,
                'provider' => $request->data['hospital']['label'] ?? null,
                'created_at' => now(),
                'loa_type' => 'callback'
            ]);

            Callback::create([
                'client_id' => $resultClients->id,
                'failed_count' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $data = [

                'message' => 'New claim request',

                'date_created' => Carbon::now()->diffForHumans(),

              ];
            event(new RealtimeNotificationEvent($data));

            return $resultRequests;
        }
    }

    public function changeCallbackStatus(Request $request){
        $id = $request->id;

        $details = [
            'status' => 9
        ];


        if($id !== null){

            $checkIfStatusDone = Client::where('id', $id)->first();

            if($checkIfStatusDone->status !== 7 && $checkIfStatusDone->status !== 10){
                $result = Client::where('id', $id)->update($details);
                return $checkIfStatusDone;
            }
        }

    }

    public function doneStatusCallback(Request $request){

        $id = $request->id;

        $details = [
            'status' => 7
        ];

        if($id !== null){
            $result = Client::where('id', $id)->update($details);
            return $result;
        }

    }

    public function unresponsiveCallback(Request $request){
        $failed_count = $request->failed_count;
        $id = $request->id;

        $data = Callback::where('client_id', $id)->first();





        if($data->failed_count == 0 && $data->first_attempt_date === null){
            $data->update([
                'failed_count' => $failed_count + 1,
                'first_attempt_date' => now()
            ]);

            $formatted_date = Carbon::parse($data->first_attempt_date)->format('F j, Y g:i:s A');

            $first_attempt_msg =
            '<p style="font-weight:normal;">
                Our Client Care is trying to contact your facility through the registered and/or alternative contact details, 1st attempt at ' . '<b>' . $formatted_date . '</b>' .  '. <br /><br />

                Please keep your line open as we try our 2nd attempt to contact your facility.
            </p>';

            $emailer = new SendingEmail(email: "jeremiahquintano@llibi.com", body: $first_attempt_msg, subject: 'CLIENT CARE PORTAL - FIRST CALLBACK ATTEMPT');

            $emailer->send();

            return response()->json([
                'success' => true,
                'attempt' => '1st notification email was sent to the client',
                'data' => $data
            ]);
        }elseif($data->failed_count == 1 && $data->second_attempt_date === null){
            $data->update([
                'failed_count' => $failed_count + 1,
                'second_attempt_date' => now()
            ]);

            $formatted_date = Carbon::parse($data->second_attempt_date)->format('F j, Y g:i:s A');

            $second_attempt_msg =
            '<p style="font-weight:normal;">
                Our Client Care is trying to contact your facility through the registered and/or alternative contact details, 2nd attempt at ' . '<b>' . $formatted_date . '</b>' .  '. <br /><br />

                Please keep your line open as we try our 3rd attempt to contact your facility.
            </p>';

            $emailer = new SendingEmail(email: "jeremiahquintano@llibi.com", body: $second_attempt_msg, subject: 'CLIENT CARE PORTAL - SECOND CALLBACK ATTEMPT');

            $emailer->send();

            return response()->json([
                'success' => true,
                'attempt' => '2nd notification email was sent to the client',
                'data' => $data
            ]);
        }elseif($data->failed_count == 2 && $data->third_attempt_date === null){
            $data->update([
                'failed_count' => $failed_count + 1,
                'third_attempt_date' => now()
            ]);

            $formatted_date_1st_attempt = Carbon::parse($data->first_attempt_date)->format('F j, Y g:i:s A');
            $formatted_date_2nd_attempt = Carbon::parse($data->second_attempt_date)->format('F j, Y g:i:s A');
            $formatted_date_3rd_attempt = Carbon::parse($data->third_attempt_date)->format('F j, Y g:i:s A');

            $third_attempt_msg =
            '<p style="font-weight:normal;">
                This is to inform you that our Client Care tried to contact your facility through the registered and/or alternative contact details, 1st attempt at ' .'<b>' .$formatted_date_1st_attempt . '</b>' . ' and 2nd attempt at ' . '<b>' . $formatted_date_2nd_attempt . '</b>' . ' and 3rd and last attempt at ' .'<b>' . $formatted_date_3rd_attempt . '</b>' . '.Unfortunately, your line remains uncontactable/unresponsive. <br /><br />If you still wish to contact Client Care, you may request for callback again through our Provider Portal. Thank you.
            </p>';

            $emailer = new SendingEmail(email: "jeremiahquintano@llibi.com", body: $third_attempt_msg, subject: 'CLIENT CARE PORTAL - THIRD CALLBACK ATTEMPT');

            $emailer->send();

            $update = [
                'status' => 10
            ];

            $result = Client::where('id', $id)->update($update);



            return response()->json([
                'success' => true,
                'attempt' => 'Final notification email was sent to the client. Callback request will be marked as failed',
                'data' => $data,
                'result' => $result
            ]);
        }





    }
}

<?php

namespace App\Http\Controllers\Callback_Request;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Self_service\Client;
use App\Models\Self_service\ClientRequest;

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
            'status' => 2,
            'created_at' => now()
        ]);

        // return $resultClients->contact;
        // return $resultClients;

        if($resultClients){
            $resultRequests = ClientRequest::create([
                'client_id' => $resultClients->id,
                'member_id' => $resultClients->member_id,
                'provider_id' => $request->data['hospital'],
                'created_at' => now(),
                'loa_type' => 'callback'
            ]);

            return $resultRequests;
        }


    }
}

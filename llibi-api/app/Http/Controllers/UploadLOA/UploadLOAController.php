<?php

namespace App\Http\Controllers\UploadLOA;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Self_service\Client;
use App\Models\Self_service\Sync;
use App\Models\Self_service\ClientRequest;
use Illuminate\Support\Facades\DB;
use App\Models\Self_service\Callback;

class UploadLOAController extends Controller
{
    //

    public function validateClient(Request $request){

        $loaType = $request->typeLOA;
        $link = '/upload-loa/client?loatype=' . $request->typeLOA;
        $response = 'We are unable to validate this information. Please check your input and try again.';

        try {

            if($request->client['relation'] !== "EMPLOYEE"){

                $client = Client::create([
                    'request_type' => 1,
                    'reference_number' => strtotime('now'),
                    'is_dependent' => 1,
                    'dependent_member_id' => $request->client['member_id'],
                    'dependent_first_name' => $request->client['first_name'],
                    'dependent_last_name' => $request->client['last_name'],
                    'dependent_dob' => $request->client['birth_date'],
                    'status' => 1,
                    'platform' => 'manual'
                ]);
            }else{

                $client = Client::create([
                    'request_type' => 1,
                    'reference_number' => strtotime('now'),
                    'member_id' => $request->client['member_id'],
                    'first_name' => $request->client['first_name'],
                    'last_name' => $request->client['last_name'],
                    'dob' => $request->client['birth_date'],
                    'status' => 1,
                    'platform' => 'manual'
                ]);
            }

            ClientRequest::create([
                'client_id' => $client['id'],
                'member_id' => $request->client['member_id'],
                'loa_type' => $loaType
            ]);

            $link .= '&refno=' . $client['reference_number'];

            return response()->json([
                'link' => $link
            ], 200);

        } catch (\Throwable $th) {

            return response()->json([
                'response' => $response,
            ], 404);

        }

    }



  public function GetRequest($loaType, $refno)

  {

    $request = DB::table('app_portal_clients as t1')

      ->join('app_portal_requests as t2', 't2.client_id', '=', 't1.id')

      ->select('t1.id', 't1.reference_number as refno', 't1.email as email', 't1.contact as contact', 't1.member_id as memberID', 't1.first_name as firstName', 't1.last_name as lastName', 't1.dob as dob', 't1.is_dependent as isDependent', 't1.dependent_member_id as depMemberID', 't1.dependent_first_name as depFirstName', 't1.dependent_last_name as depLastName', 't1.dependent_dob as depDob', 't1.status as status', 't2.loa_type as loaType', 't2.provider', 't2.doctor_id as doctorID', 't2.doctor_name as doctorName')

      ->where('t1.reference_number', $refno)

      ->where('t2.loa_type', $loaType)

      ->get();



    return $request;

  }


  public function updateRequest(Request $request){

    $refno = $request->refno;
    $provider = $request->provider;
    $loaNumber = $request->loaNumber;
    $member_id = '';
    $directory = 'Self-service/LOA/';
    $hospital = explode('||', $request->provider);

    $client = Client::where('reference_number', $refno)->firstOrFail();

    try {

        if($client){
            $client['status'] = 3;

            $client->update();

            if($client->is_dependent){
                $member_id .= $client->dependent_member_id;
            }else{
                $member_id .= $client->member_id;
            }

            $directory .= $member_id;
            $path = $request->attachLOA->storeAs($directory, str_replace('_', '', $request->attachLOA->getClientOriginalName()), 'llibiapp');

            $update = [
            'provider_id' => $hospital[0],
            'provider' => $hospital[1],
            'loa_attachment' => env('DO_LLIBI_CDN_ENDPOINT') . "/" . $path,
            'loa_number' => strtoupper(explode('_', $request->loaNumber)[0]) . '*',
            'loa_status' => "Approved"
            ];

            ClientRequest::where('client_id', $client->id)->update($update);
            Callback::create([
                'client_id' => $client->id
            ]);

            return $client;

        }

    } catch (\Throwable $th) {
        //throw $th;
            return response()->json(404);
    }
  }

}

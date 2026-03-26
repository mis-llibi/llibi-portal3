<?php

namespace App\Http\Controllers\Self_service;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Self_service\Client;
use App\Models\Self_service\ClientRequest;

class HrController extends Controller
{
    //

    public function UpdateRequestHrCall(Request $request){

        $callStatus = $request->callStatus;

        $updateClient = [
            'status' => $callStatus ? 3 : 4,
            'user_id' => $request->user()->id,
        ];
        Client::where('id', $request->id)
                ->update($updateClient);

        return response()->json([
            'success' => true
        ], 200);




    }
}

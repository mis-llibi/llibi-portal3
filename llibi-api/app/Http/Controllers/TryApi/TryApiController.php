<?php

namespace App\Http\Controllers\TryApi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TryApiController extends Controller
{
    //

    public function index(){


        // $requestLOA = DB::table('llibiapp_portal.app_portal_requests')
        //     ->whereBetween('created_at', ['2025-01-01', '2025-01-31'])
        //     ->whereNotNull('loa_number')
        //     ->where('loa_number', '!=', 'UNDEFINED')
        //     ->orderBy('id', 'asc')
        //     ->get();

        $utilizationLOA = DB::table('llibinet_llibi.utilizationloa')
            ->where('loanumber', 'like', '%AHI-2025-X-00019%')
            ->get();

        if ($utilizationLOA->isEmpty()) {
            return response()->json(['message' => 'No matching utilization LOA found.'], 404);
        }

        $loanumber = $utilizationLOA->first()->loanumber;

        $requestLOA = DB::table('llibiapp_portal.app_portal_requests as req')
            ->where('req.loa_number', 'like', '%AHI-2025-X-00019%')
            ->get();

        return $requestLOA;


        // $utilizationLOA = DB::table('llibinet_llibi.utilizationloa as util')
        //                     ->where(function ($query){
        //                         $query->where('util.loanumber', 'like', '%AHI-2025-X-00019%');
        //                     })
        //                     ->get();
        // return $utilizationLOA;


        // return response()->json([
        //     'utilizationLOA' => $utilizationLOA,
        //     'requestLOA' => $requestLOA
        // ]);
    }
}

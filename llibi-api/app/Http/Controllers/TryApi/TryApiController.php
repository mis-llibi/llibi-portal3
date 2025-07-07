<?php

namespace App\Http\Controllers\TryApi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


use App\Models\Self_service\Hospitals as SyncHospital;
use App\Models\Corporate\Hospitals;
use App\Models\Self_service\ClientRequest;
use App\Models\Corporate\UtilizationLoa;
use Carbon\Carbon;

class TryApiController extends Controller
{
    //

public function showLoaClient(){


    set_time_limit(0);

    $dateFirst = '2025-06-04';
    $dateLast = '2025-06-04';

    // Get all request loa from selected date and all have * in their loa's

    $utilizationLOA = UtilizationLoa::orderBy('id', 'desc')
                        ->limit(10)
                        ->get();
    // $utilizationLOA = DB::table('llibinet_llibi.utilizationloa')
    //     ->whereBetween('dateissued', [$dateFirst, $dateLast])
    //     ->where('loanumber', 'like', '%*%')
    //     ->pluck('loanumber')
    //     ->toArray();


    // Select all loa that uploaded in app_portal_request table
    // $clientRequest = ClientRequest::whereBetween('updated_at', [$dateFirst, $dateLast])
    //     ->whereNotNull('loa_number')
    //     ->where('loa_number', '!=', 'UNDEFINED')
    //     ->whereIn('loa_number', $utilizationLOA)
    //     ->orderBy('updated_at', 'asc')
    //     ->get();

    return $utilizationLOA;


    }


public function showNoLoaClient(Request $request)
{
    set_time_limit(0);

    $dateFirst = $request->dateFirst;
    $dateLast = $request->dateLast;

    // Normalize to start and end of day for date range
    $startDate = Carbon::parse($dateFirst)->startOfDay()->toDateTimeString();
    $endDate = Carbon::parse($dateLast)->endOfDay()->toDateTimeString();

    // Get LOAs that contain '*' and are within dateissued range
    $utilizationLOA = UtilizationLoa::whereBetween(DB::raw('DATE(dateissued)'), [$startDate, $endDate])
        ->where('loanumber', 'like', '%*%')
        ->pluck('loanumber')
        ->toArray();

    // Get client requests that are in utilizationLOA and within updated_at date range
    $clientRequest = ClientRequest::whereBetween(DB::raw('DATE(updated_at)'), [$startDate, $endDate])
        ->whereNotNull('loa_number')
        ->where('loa_number', '!=', 'UNDEFINED')
        ->whereIn('loa_number', $utilizationLOA)
        ->pluck('loa_number')
        ->toArray();


    // LOAs that are not uploaded
    $notUploaded = UtilizationLoa::whereBetween(DB::raw('DATE(dateissued)'), [$startDate, $endDate])
        ->whereNotIn('loanumber', $clientRequest)
        ->get()
        ->map(function ($item) {
            $item->uploaded = false;
            return $item;
        });


    // LOAs that are uploaded
    $uploaded = UtilizationLoa::whereBetween(DB::raw('DATE(dateissued)'), [$startDate, $endDate])
        ->whereIn('loanumber', $clientRequest)
        ->get()
        ->map(function ($item) {
            $item->uploaded = true;
            return $item;
        });

    $combined = $notUploaded->merge($uploaded)->sortBy('id')->values();

    return response()->json([
        'combined' => $combined,
        'notUplodedCount' => count($notUploaded),
        'uploadedCount' => count($uploaded),
    ]);
}



public function hospitals()
{
    // Normalize and key by lowercase trimmed name
    $sync = SyncHospital::all()->keyBy(fn($item) => strtolower(trim($item->name)));
    $corporate = Hospitals::all()->keyBy(fn($item) => strtolower(trim($item->name)));

    $differentFromSync = [];
    $missingInSync = [];

    // 1. Loop through $sync to find records not in $corporate or with different data
    foreach ($sync as $name => $syncHospital) {
        $corporateHospital = $corporate->get($name);

        if (!$corporateHospital || (
            $syncHospital->status !== $corporateHospital->status ||
            $syncHospital->address !== $corporateHospital->address
            // Add more fields as needed
        )) {
            $differentFromSync[] = $syncHospital;
        }
    }

    // 2. Loop through $corporate to find records not in $sync
    foreach ($corporate as $name => $corporateHospital) {
        if (!$sync->has($name)) {
            $missingInSync[] = $corporateHospital;
        }
    }

    return response()->json([
        'sync_count' => $sync->count(),
        'corporate_count' => $corporate->count(),
        'different_from_sync_count' => count($differentFromSync),
        'different_from_sync_data' => $differentFromSync,
        'missing_in_sync_count' => count($missingInSync),
        'missing_in_sync_data' => $missingInSync,
    ]);
}



}

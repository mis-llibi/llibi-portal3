<?php

namespace App\Http\Controllers\Self_service;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Self_service\LoaFilesInTransit;
use App\Models\Self_service\AppLoaMonitor;

class FindPatientLoaController extends Controller
{
    //

    public function findPatientAllLoa(Request $request){

        $fullname = $request->fullname;
        $inscode = (int) $request->inscode;
        $compcode = $request->compcode;

        $status = [1, 4];
        $types = ['outpatient', 'laboratory', 'consultation'];
        // Find existing loa in Loa Files in Transit
        $loafiles = LoaFilesInTransit::where('patient_name', 'like', "%$fullname%")
                                    ->whereIn('status', $status)
                                    ->where(function ($q) use ($types) {
                                        foreach ($types as $type) {
                                            $q->orWhere('type', 'like', "%$type%");
                                        }
                                    })
                                    ->where('date', '>=', '2024-11-1')
                                    ->orderBy('id', 'desc')
                                    ->get();

        // Claims
        $claims = AppLoaMonitor::where('compcode', $compcode)
                            ->where('inscode', $inscode)
                            ->get();

        return response()->json([
            'loafiles' => $loafiles,
            'claims' => $claims
        ], 200);

    }
}

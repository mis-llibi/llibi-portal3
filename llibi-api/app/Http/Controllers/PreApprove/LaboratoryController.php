<?php

namespace App\Http\Controllers\PreApprove;

use App\Exports\PreApproved\LaboratoryExport;
use App\Http\Controllers\Controller;
use App\Imports\PreApprove\LaboratoryImport;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\PreApprove\Laboratory;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class LaboratoryController extends Controller
{
  public function index()
  {
    $q = request()->query('q');
    return Laboratory::query()
      ->where('code', 'LIKE', "%{$q}%")
      ->orWhere('laboratory', 'LIKE', "%{$q}%")
      ->latest()->take(250)->get();
  }

  public function store(Request $request)
  {
    $lab = Laboratory::create([
      'code' => Str::random(12),
      'laboratory' => trim($request->laboratory),
      'cost' => Str::replace(',', '', trim($request->cost)),
      'cost2' => Str::replace(',', '', trim($request->cost2)),
      'class' => 1,
    ]);

    return response()->json($lab);
  }

  public function update(Request $request, $id)
  {
    $lab = Laboratory::where('id', $id)->update([
      'laboratory' => trim($request->laboratory),
      'cost' => Str::replace(',', '', trim($request->cost)),
      'cost2' => Str::replace(',', '', trim($request->cost2)),
    ]);

    return response()->json($lab);
  }

  public function destroy($id)
  {
    $lab = Laboratory::where('id', $id)->delete();

    return response()->json($lab);
  }

  public function export()
  {
    $q = request()->query('q');

    $labs = Laboratory::query()
      ->where('code', 'LIKE', "%$q%")
      ->orWhere('laboratory', 'LIKE', "%$q%")
      ->select('code', 'laboratory', 'cost', 'cost2')
      ->latest()
      ->take(100)
      ->get();

    $filename = 'laboratory-export ' . Carbon::parse()->toDateTimeString() . '.xlsx';
    return (new LaboratoryExport($labs))->download($filename);
  }

  public function import(Request $request)
  {
    $file = $request->file;

    Excel::import(new LaboratoryImport, $file);
    return response()->noContent();
  }
}

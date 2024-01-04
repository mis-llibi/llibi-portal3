<?php

namespace App\Http\Controllers\PreApprove;

use App\Exports\PreApproved\LaboratoryExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\PreApprove\Laboratory;
use Carbon\Carbon;

class LaboratoryController extends Controller
{
  public function index()
  {
    $q = request()->query('q');
    return Laboratory::query()
      ->where('code', 'LIKE', "%{$q}%")
      ->orWhere('laboratory', 'LIKE', "%{$q}%")
      ->latest()->take(100)->get();
  }

  public function store(Request $request)
  {
    $lab = Laboratory::create([
      'code' => Str::random(12),
      'laboratory' => trim($request->laboratory),
      'cost' => Str::replace(',', '', trim($request->cost)),
    ]);

    return response()->json($lab);
  }

  public function update(Request $request, $id)
  {
    $lab = Laboratory::where('id', $id)->update([
      'laboratory' => trim($request->laboratory),
      'cost' => Str::replace(',', '', trim($request->cost)),
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
      ->select('code', 'laboratory', 'cost')
      ->latest()
      ->take(100)
      ->get();

    $filename = 'laboratory-export ' . Carbon::parse()->toDateTimeString() . '.xlsx';
    return (new LaboratoryExport($labs))->download($filename);
  }
}

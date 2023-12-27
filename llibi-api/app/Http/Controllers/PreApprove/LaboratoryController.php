<?php

namespace App\Http\Controllers\PreApprove;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\PreApprove\Laboratory;

class LaboratoryController extends Controller
{
  public function index()
  {
    return Laboratory::query()->latest()->take(100)->get();
  }

  public function store(Request $request)
  {
    $lab = Laboratory::create([
      'code' => Str::uuid(),
      'laboratory' => trim($request->laboratory),
      'cost' => Str::replace(',', '', trim($request->cost)),
    ]);

    return $lab;
  }

  public function update(Request $request, $id)
  {
    $lab = Laboratory::where('id', $id)->update([
      'laboratory' => trim($request->laboratory),
      'cost' => Str::replace(',', '', trim($request->cost)),
    ]);

    return $lab;
  }
}

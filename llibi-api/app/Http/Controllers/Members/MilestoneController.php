<?php

namespace App\Http\Controllers\Members;

use App\Http\Controllers\Controller;
use App\Models\Members\hr_members;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{
  public function getDependentsForInactive()
  {
    $member_id = request()->query('member_id');
    $principal_civil_status = request()->query('principal_civil_status');
    $principal_birthdate = request()->query('principal_birthdate');
    $birthdate = request()->query('birthdate');
    $relation = request()->query('relation');

    // remove principal
    $dependents = hr_members::query()->where('member_id', $member_id)->activeMembers()->get();

    return response($dependents);
  }

  public function submitDependentsForInactive(Request $request)
  {
    return $request->all();
  }
}

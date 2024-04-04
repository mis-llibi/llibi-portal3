<?php

namespace App\Http\Controllers\Members;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

use App\Models\Members\hr_members;

use App\Http\Requests\Member\ApproveMembeDeletionrRequest;
use App\Http\Requests\Member\ApproveMemberRequest;

class AdminController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    //
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function show($id)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $id)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id)
  {
    //
  }

  public function approveMember(ApproveMemberRequest $request, $id)
  {
    $member = hr_members::find($id);

    abort_if(!$member, 404, 'Member not found.');

    $principal = hr_members::query()->where('member_id', $member->member_id)->principal()->first();

    if (is_null($principal->certificate_no) && $member->relationship_id != 'PRINCIPAL') {
      return response()->json(['message' => 'The principal should have Certificate No. before approving dependents.', 'data' => $member], 400);
    }

    $member->certificate_no = $request->certificate_no;
    // $member->certificate_issued_at = $request->certificate_issued_at;
    $member->certificate_issued_at = Carbon::now();
    $member->status = 4;
    $member->approved_member_at = Carbon::now();
    $member->approved_by = Auth::id();
    $member->save();

    return response()->json(['message' => 'Approve member success.', 'data' => $member]);
  }

  public function approveDeletion(ApproveMembeDeletionrRequest $request, $id)
  {
    $member = hr_members::find($id);
    $member->status = 7;
    $member->admin_remarks = $request->remarks;
    $member->approved_deleted_member_at = Carbon::parse($request->approved_deleted_member_at)->format('Y-m-d H:i');
    $member->approved_deleted_member_at_original = Carbon::now();
    $member->approved_by = Auth::id();
    $member->save();

    return response()->json(['message' => 'Approve deletion success.', 'data' => $member]);
  }

  public function approveChangePlan(Request $request, $id)
  {
    $member = hr_members::find($id);
    $member->status = 9;
    $member->plan = $request->plan;
    $member->approved_change_plan_at = Carbon::now();
    $member->approved_by = Auth::id();
    $member->save();

    return response()->json(['message' => 'Approve change plan success.', 'data' => $member]);
  }
}

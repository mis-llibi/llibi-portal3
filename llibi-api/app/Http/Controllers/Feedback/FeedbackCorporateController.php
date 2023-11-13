<?php

namespace App\Http\Controllers\Feedback;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Requests\ManualSendFeedbackRequest;
use App\Models\Corporate\Employees;
use App\Models\FeedbackCorporate;
use App\Models\Self_service\Sync;
use App\Services\SendingEmail;

use Illuminate\Http\File;
use Illuminate\Mail\Attachment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\App;

class FeedbackCorporateController extends Controller
{
  function sendLoa(ManualSendFeedbackRequest $request)
  {
    $employee_id = $request->employee_id;
    $approval_code = $request->approval_code;
    $email = $request->email;
    $loa = $request->file('loa');

    $path = $request->file('loa')->storeAs(
      'public/corporate/upload/loa',
      $loa->getClientOriginalName()
    );

    $employee = Employees::where('id', $employee_id)->first();
    // if (!$employee) {
    //   return response()->json(['status' => false, 'message' => 'Employee Not Found.'], 404);
    // }

    abort_if(!$employee, 404, 'Employee Not Found.');

    $masterlist = Sync::query()
      ->where('empcode', $employee->code)
      ->whereDate('birth_date', $employee->birthdate)
      ->first();

    // if (!$masterlist) {
    //   return response()->json(['status' => false, 'message' => 'Member Not Found.'], 404);
    // }

    abort_if(!$employee, 404, 'Member Not Found.');

    $q = Str::random(64);
    $company_code = $masterlist->company_code;
    $member_id = $masterlist->member_id;
    $feedback_url = "https://portal.llibi.app/feedback/corporate?q=$q&company_code=$company_code&member_id=$member_id&approval_code=$approval_code";

    $mailMsg = view('send-corporate-loa', [
      'homepage' => 'https://portal.llibi.app',
      'first_name' => $masterlist->first_name,
      // 'member_id' => $masterlist->member_id,
      // 'company_code' => $masterlist->company_code,
      // 'approval_code' => $approval_code,
      // 'q' => Str::random(64)
      'feedback_url' => $feedback_url,
    ]);

    if (App::environment('local')) {
      $emailer = new SendingEmail(
        email: 'glenilagan@llibi.com',
        body: $mailMsg,
        subject: 'CORPORATE REQUEST LOA',
        attachments: [Storage::path($path)],
      );
      $emailer->send();
    }

    if (App::environment('production')) {
      $emailer = new SendingEmail(
        email: $email,
        body: $mailMsg,
        subject: 'CORPORATE REQUEST LOA',
        attachments: [Storage::path($path)],
        cc: ['clientcare@llibi.com'],
      );
      $emailer->send();
    }

    return response()->noContent();
  }

  public function store(Request $request)
  {
    // $employee = Employees::where('id', $request->employee_id)->first();
    // if (!$employee) {
    //   return response()->json(['status' => false, 'message' => 'Employee Not Found.'], 404);
    // }

    $masterlist = Sync::query()
      ->where('member_id', $request->member_id)
      // ->whereDate('birth_date', $employee->birthdate)
      ->first();

    if (!$masterlist) {
      return response()->json(['status' => false, 'message' => 'Member Not Found.'], 404);
    }

    $feedback = new FeedbackCorporate();
    $feedback->company_code = $request->company_code;
    $feedback->member_id = $masterlist->member_id;
    $feedback->approval_code = $request->approval_code;
    $feedback->question1 = $request->questionOne;
    $feedback->question2 = $request->questionTwo;
    $feedback->question3 = $request->questionThree;
    $feedback->question4 = $request->questionFour;
    $feedback->question5 = $request->questionFive;
    $feedback->comments = $request->comments;
    $feedback->save();

    return response()->json(['status' => true, 'message' => 'Successfully submit.', 'feedback' => $feedback]);
  }

  public function showEmployee()
  {
    $employee_id = request()->query('employee_id');
    $employee = Employees::where('id', $employee_id)->first();
    // if (!$employee) {
    //   return response()->json(['status' => false, 'message' => 'Employee Not Found.'], 404);
    // }

    abort_if(!$employee, 404, 'Employee Not Found.');

    $masterlist = Sync::query()
      ->where('empcode', $employee->code)
      ->whereDate('birth_date', $employee->birthdate)
      ->first();

    // if (!$masterlist) {
    //   return response()->json(['status' => false, 'message' => 'Member Not Found.'], 404);
    // }
    abort_if(!$masterlist, 404, 'Member Not Found.');

    return response()->json($masterlist);
  }
}

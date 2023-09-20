<?php

namespace App\Http\Controllers\Feedback;

use App\Http\Controllers\Controller;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;

use App\Models\Feedback;
use App\Http\Requests\FeedbackRequest;
use App\Http\Requests\ManualSendFeedbackRequest;
use App\Models\Corporate\Employees;
use App\Models\Self_service\Sync;
use App\Services\SendingEmail;

use Illuminate\Http\File;
use Illuminate\Mail\Attachment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FeedbackController extends Controller
{
  public function store(FeedbackRequest $request)
  {
    $comment = $request->comment ?? "";
    $questionOne = $request->questionOne;
    $questionTwo = $request->questionTwo;
    $questionThree = $request->questionThree;
    $questionFour = $request->questionFour;
    $request_id = $request->request_id;
    $company_code = $request->company_code;
    $member_id = $request->member_id;
    $request_status = $request->request_status;

    if ($this->checkingIfAlreadyFeedback($request_id)) {
      return response()->json(['status' => false, 'message' => 'You are already send feedback.', 'data' => []]);
    }

    $feedback = Feedback::create([
      'request_id' => $request_id,
      'company_code' => $company_code,
      'member_id' => $member_id,
      'request_status' => $request_status,
      'question1' => $questionOne,
      'question2' => $questionTwo,
      'question3' => $questionThree,
      'question4' => $questionFour,
      'comments' => $comment,
    ]);

    return response()->json(['status' => true, 'message' => 'Thank you for sharing your feedback.', 'data' => $feedback]);
  }

  public function checkingIfAlreadyFeedback($request_id)
  {
    $feedback = Feedback::where('request_id', $request_id)->exists();

    return $feedback;
  }

  function manualStore(ManualSendFeedbackRequest $request)
  {
    $employee_id = $request->employee_id;
    $email = $request->email;
    $loa = $request->file('loa');

    // return $contents = file_get_contents($loa->getRealPath());

    $path = $request->file('loa')->storeAs(
      'public/manual/upload/loa',
      $loa->getClientOriginalName()
    );

    $employee = Employees::where('id', $employee_id)->first();
    if (!$employee) {
      return response()->json(['status' => false, 'message' => 'Not Found.']);
    }

    $masterlist = Sync::query()
      ->where('empcode', $employee->code)
      ->whereDate('birth_date', $employee->birthdate)
      ->first();

    // $request_id = NULL;
    // $company_code = $masterlist->company_code;
    // $member_id = $masterlist->member_id;
    // $request_status = NULL;
    // $comments = '';
    // $is_manual = 1;

    // $feedback = Feedback::create([
    //   'request_id' => $request_id,
    //   'company_code' => $company_code,
    //   'member_id' => $member_id,
    //   'request_status' => $request_status,
    //   'comments' => $comments,
    //   'is_manual' => $is_manual,
    // ]);


    $mailMsg = view('send-manual-loa-with-feedback-link', [
      'member_id' => $masterlist->member_id,
      'company_code' => $masterlist->company_code,
      'q' => Str::random(64)
    ]);

    $emailer = new SendingEmail(email: 'glenilagan@llibi.com', body: $mailMsg, subject: 'MANUAL REQUEST LOA', attachments: [Storage::path($path)]);
    $emailer->send();

    return response()->noContent();
  }
}

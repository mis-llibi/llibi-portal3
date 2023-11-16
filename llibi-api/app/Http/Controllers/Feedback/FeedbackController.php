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
  public function index()
  {
    $feedbacks = Feedback::query()->orderBy('id', 'DESC')->paginate(25);

    return response()->json($feedbacks);
  }
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
}

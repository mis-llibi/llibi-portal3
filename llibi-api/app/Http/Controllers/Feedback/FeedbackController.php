<?php

namespace App\Http\Controllers\Feedback;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Feedback;
use App\Http\Requests\FeedbackRequest;

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

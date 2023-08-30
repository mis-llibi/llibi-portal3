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
    $request_id = $request->request_id;
    $company_code = $request->company_code;
    $member_id = $request->member_id;
    $request_status = $request->request_status;
    $rating = $request->rating;
    $comments = $request->comments;

    $feedback = Feedback::create([
      'request_id' => $request_id,
      'company_code' => $company_code,
      'member_id' => $member_id,
      'request_status' => $request_status,
      'rating' => $rating,
      'comments' => $comments,
    ]);

    return response()->json(['status' => true, 'message' => 'Thank you for sharing your feedback.', 'data' => $feedback]);
  }

  public function checkingIfAlreadyFeedback($request_id)
  {
    $feedback = Feedback::where('request_id', $request_id)->exists();

    return $feedback;
  }
}

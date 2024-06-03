<?php

namespace App\Http\Controllers\Feedback;

use App\Http\Controllers\Controller;
use App\Http\Requests\FeedbackRequest;
use App\Http\Requests\ManualSendFeedbackRequest;
use App\Models\AdmuFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdmuFeedbackController extends Controller
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
    $llibixadmu_key = $request->header('X-LLIBIXADMU-KEY');

    if ($llibixadmu_key !== env('LLIBIXADMU_KEY') && $request->member_id === 'MANUAL' && $request->company_code === 'admu') {
      abort(401, 'Unauthorized api key');
    }

    $comment = $request->comment ?? "";
    $questionOne = $request->questionOne;
    $questionTwo = $request->questionTwo;
    $questionThree = $request->questionThree;
    $questionFour = $request->questionFour;

    $feedback = AdmuFeedback::create([
      'company_code' => 'ADMU',
      'question1' => $questionOne,
      'question2' => $questionTwo,
      'question3' => $questionThree,
      'question4' => $questionFour,
      'comments' => $comment,
    ]);

    return response()->json(['status' => true, 'message' => 'Thank you for sharing your feedback.', 'data' => $feedback]);
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
}

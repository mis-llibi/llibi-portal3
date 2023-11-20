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
use Illuminate\Support\Facades\DB;

class FeedbackCorporateController extends Controller
{
  public function index()
  {
    $feedbacks = FeedbackCorporate::query()
      ->join('app_portal_requests as request', 'request.client_id', '=', 'feedbacks_corporate.id')
      ->leftJoin(env('DB_DATABASE_SYNC') . '.masterlist as mlist', 'mlist.member_id', '=', 'feedbacks_corporate.member_id')
      ->select('feedbacks_corporate.*', 'request.loa_type', 'mlist.company_name')
      ->orderBy('feedbacks_corporate.id', 'DESC')->paginate(25);

    $feedback_counts = FeedbackCorporate::query()->count();
    $q1 = $this->getStatisticsQuestOne($feedback_counts);
    $q2 = $this->getStatisticsQuestTwo($feedback_counts);
    $q3 = $this->getStatisticsQuestThree($feedback_counts);
    $q4 = $this->getStatisticsQuestFour($feedback_counts);
    $q5 = $this->getStatisticsQuestFive($feedback_counts);

    return response()->json(['result' => $feedbacks, 'q1' => $q1, 'q2' => $q2, 'q3' => $q3, 'q4' => $q4, 'q5' => $q5]);
  }

  private function getStatisticsQuestOne($feedback_counts)
  {
    $sql = DB::select("
      SELECT SUM(very_easy) AS very_easy, SUM(easy) AS easy, SUM(moderate) AS moderate, 
      SUM(difficult) AS difficult, SUM(very_difficult) AS very_difficult 
      FROM (
        SELECT 
          CASE 
            WHEN question1 = 5 THEN COUNT(question1)
            ELSE 0
            END AS very_easy,
        CASE 
            WHEN question1 = 4 THEN COUNT(question1)
            ELSE 0
            END AS easy,
        CASE 
            WHEN question1 = 3 THEN COUNT(question1)
            ELSE 0
            END AS moderate,
        CASE 
            WHEN question1 = 2 THEN COUNT(question1)
            ELSE 0
            END AS difficult,
        CASE 
            WHEN question1 = 1 THEN COUNT(question1)
            ELSE 0
            END AS very_difficult
        FROM feedbacks_corporate GROUP BY question1)
      AS tbl;
    ");

    $result = [];
    $hundread_percent = 100;
    foreach ($sql as $key => $row) {
      $very_easy = ($row->very_easy / $feedback_counts) * $hundread_percent;
      $easy = ($row->easy / $feedback_counts) * $hundread_percent;
      $moderate = ($row->moderate / $feedback_counts) * $hundread_percent;
      $difficult = ($row->difficult / $feedback_counts) * $hundread_percent;
      $very_difficult = ($row->very_difficult / $feedback_counts) * $hundread_percent;
      array_push($result, [
        'very_easy' => number_format($very_easy, 2),
        'easy' => number_format($easy, 2),
        'moderate' => number_format($moderate, 2),
        'difficult' => number_format($difficult, 2),
        'very_difficult' => number_format($very_difficult, 2),
      ]);
    }

    return $result;
  }

  private function getStatisticsQuestTwo($feedback_counts)
  {
    $sql = DB::select("
      SELECT SUM(yes) AS yes, SUM(no) AS no
      FROM (
        SELECT 
          CASE 
            WHEN question2 = 1 THEN COUNT(question2)
            ELSE 0
            END AS yes,
        CASE 
            WHEN question2 = 0 THEN COUNT(question2)
            ELSE 0
            END AS no
        FROM feedbacks_corporate GROUP BY question2)
      AS tbl;
    ");

    $result = [];
    $hundread_percent = 100;
    foreach ($sql as $key => $row) {
      $yes = ($row->yes / $feedback_counts) * $hundread_percent;
      $no = ($row->no / $feedback_counts) * $hundread_percent;
      array_push($result, [
        'yes' => number_format($yes, 2),
        'no' => number_format($no, 2),
      ]);
    }

    return $result;
  }

  private function getStatisticsQuestThree($feedback_counts)
  {
    $sql = DB::select("
      SELECT SUM(yes) AS yes, SUM(no) AS no
      FROM (
        SELECT 
          CASE 
            WHEN question3 = 1 THEN COUNT(question3)
            ELSE 0
            END AS yes,
        CASE 
            WHEN question3 = 0 THEN COUNT(question3)
            ELSE 0
            END AS no
        FROM feedbacks_corporate GROUP BY question3)
      AS tbl;
    ");

    $result = [];
    $hundread_percent = 100;
    foreach ($sql as $key => $row) {
      $yes = ($row->yes / $feedback_counts) * $hundread_percent;
      $no = ($row->no / $feedback_counts) * $hundread_percent;
      array_push($result, [
        'yes' => number_format($yes, 2),
        'no' => number_format($no, 2),
      ]);
    }

    return $result;
  }

  private function getStatisticsQuestFour($feedback_counts)
  {
    $sql = DB::select("
      SELECT SUM(very_easy) AS very_easy, SUM(easy) AS easy, SUM(moderate) AS moderate, 
      SUM(difficult) AS difficult, SUM(very_difficult) AS very_difficult 
      FROM (
        SELECT 
          CASE 
            WHEN question4 = 5 THEN COUNT(question4)
            ELSE 0
            END AS very_easy,
        CASE 
            WHEN question4 = 4 THEN COUNT(question4)
            ELSE 0
            END AS easy,
        CASE 
            WHEN question4 = 3 THEN COUNT(question4)
            ELSE 0
            END AS moderate,
        CASE 
            WHEN question4 = 2 THEN COUNT(question4)
            ELSE 0
            END AS difficult,
        CASE 
            WHEN question4 = 1 THEN COUNT(question4)
            ELSE 0
            END AS very_difficult
        FROM feedbacks_corporate GROUP BY question4)
      AS tbl;
    ");

    $result = [];
    $hundread_percent = 100;
    foreach ($sql as $key => $row) {
      $very_easy = ($row->very_easy / $feedback_counts) * $hundread_percent;
      $easy = ($row->easy / $feedback_counts) * $hundread_percent;
      $moderate = ($row->moderate / $feedback_counts) * $hundread_percent;
      $difficult = ($row->difficult / $feedback_counts) * $hundread_percent;
      $very_difficult = ($row->very_difficult / $feedback_counts) * $hundread_percent;
      array_push($result, [
        'very_easy' => number_format($very_easy, 2),
        'easy' => number_format($easy, 2),
        'moderate' => number_format($moderate, 2),
        'difficult' => number_format($difficult, 2),
        'very_difficult' => number_format($very_difficult, 2),
      ]);
    }

    return $result;
  }

  private function getStatisticsQuestFive($feedback_counts)
  {
    $sql = DB::select("
      SELECT SUM(very_easy) AS very_easy, SUM(easy) AS easy, SUM(moderate) AS moderate, 
      SUM(difficult) AS difficult, SUM(very_difficult) AS very_difficult 
      FROM (
        SELECT 
          CASE 
            WHEN question5 = 5 THEN COUNT(question5)
            ELSE 0
            END AS very_easy,
        CASE 
            WHEN question5 = 4 THEN COUNT(question5)
            ELSE 0
            END AS easy,
        CASE 
            WHEN question5 = 3 THEN COUNT(question5)
            ELSE 0
            END AS moderate,
        CASE 
            WHEN question5 = 2 THEN COUNT(question5)
            ELSE 0
            END AS difficult,
        CASE 
            WHEN question5 = 1 THEN COUNT(question5)
            ELSE 0
            END AS very_difficult
        FROM feedbacks_corporate GROUP BY question5)
      AS tbl;
    ");

    $result = [];
    $hundread_percent = 100;
    foreach ($sql as $key => $row) {
      $very_easy = ($row->very_easy / $feedback_counts) * $hundread_percent;
      $easy = ($row->easy / $feedback_counts) * $hundread_percent;
      $moderate = ($row->moderate / $feedback_counts) * $hundread_percent;
      $difficult = ($row->difficult / $feedback_counts) * $hundread_percent;
      $very_difficult = ($row->very_difficult / $feedback_counts) * $hundread_percent;
      array_push($result, [
        'very_easy' => number_format($very_easy, 2),
        'easy' => number_format($easy, 2),
        'moderate' => number_format($moderate, 2),
        'difficult' => number_format($difficult, 2),
        'very_difficult' => number_format($very_difficult, 2),
      ]);
    }

    return $result;
  }

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

    if (FeedbackCorporate::where('approval_code', $request->approval_code)->where('member_id', $request->member_id)->exists()) {
      return response()->json(['status' => false, 'message' => 'Already sent feedback.'], 400);
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

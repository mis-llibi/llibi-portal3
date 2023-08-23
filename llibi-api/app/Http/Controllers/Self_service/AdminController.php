<?php

namespace App\Http\Controllers\Self_service;

use App\Http\Controllers\Controller;
use App\Http\Controllers\NotificationController;

use Illuminate\Http\Request;

use App\Models\Self_service\Client;
use App\Models\Self_service\ClientRequest;
use App\Models\Self_service\Complaints;
use App\Models\Self_service\Sync;
use App\Models\Self_service\Attachment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

use mikehaertl\pdftk\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SelfService\AdminExport;
use App\Models\Corporate\Hospitals;
use App\Services\SendingEmail;

class AdminController extends Controller
{
  public function SearchRequest($search, $id)
  {
    $request = DB::table('app_portal_clients as t1')
      ->join('app_portal_requests as t2', 't2.client_id', '=', 't1.id')
      ->leftJoin(env('DB_DATABASE_SYNC') . '.masterlist as mlist', 'mlist.member_id', '=', 't1.member_id')
      ->select(
        't1.id',
        't1.reference_number as refno',
        't1.email as email',
        't1.alt_email as altEmail',
        't1.contact as contact',
        't1.member_id as memberID',
        't1.first_name as firstName',
        't1.last_name as lastName',
        't1.dob as dob',
        't1.is_dependent as isDependent',
        't1.dependent_member_id as depMemberID',
        't1.dependent_first_name as depFirstName',
        't1.dependent_last_name as depLastName',
        't1.dependent_dob as depDob',
        't1.remarks as remarks',
        't1.status as status',
        't2.loa_type as loaType',
        't2.loa_number as loaNumber',
        't2.approval_code as approvalCode',
        't2.loa_attachment as loaAttachment',
        't2.complaint as complaint',
        't2.lab_attachment as labAttachment',
        't2.assessment_q1 as ass1',
        't2.assessment_q2 as ass2',
        't2.assessment_q3 as ass3',
        't1.created_at as createdAt',
        't2.provider_id as providerID',
        't2.provider as providerName',
        't2.doctor_id as doctorID',
        't2.doctor_name as doctorName',
        't2.diagnosis as diagnosis',
        't1.approved_date',
        DB::raw('TIMESTAMPDIFF(MINUTE, t1.created_at, t1.approved_date) as elapse_minutes'),
        DB::raw('TIMESTAMPDIFF(HOUR, t1.created_at, t1.approved_date) as elapse_hours'),
        'mlist.company_name',
      )
      ->whereIn('t1.status', [2, 3, 4, 5])
      ->where(function ($query) use ($search, $id) {
        if ($search != 0) {
          $query->orWhere('t1.member_id', 'like', '%' . strtoupper($search) . '%');
          $query->orWhere('t1.first_name', 'like', '%' . strtoupper($search) . '%');
          $query->orWhere('t1.last_name', 'like', '%' . strtoupper($search) . '%');

          $query->orWhere('t1.dependent_member_id', 'like', '%' . strtoupper($search) . '%');
          $query->orWhere('t1.dependent_first_name', 'like', '%' . strtoupper($search) . '%');
          $query->orWhere('t1.dependent_last_name', 'like', '%' . strtoupper($search) . '%');
        }
        if (is_array($id)) {
          $query->where('t1.id', $id['val']);
        } else {
          if ($id != 0) {
            $query->where('t1.status', $id);
          }
        }
      })
      ->orderBy('t1.id', 'DESC')
      ->limit(40)
      ->get();

    foreach ($request as $key => $row) {
      $hospital = Hospitals::where('id', $row->providerID)->first();
      $request[$key]->email1 = $this->emailIsValid($hospital->email1) ? $hospital->email1 : null;
      $request[$key]->email2 = $this->emailIsValid($hospital->email2) ? $hospital->email2 : null;
    }

    return $request;
  }

  public function UpdateRequest(Request $request)
  {
    $user_id = request()->user()->id;
    $client = $this->SearchRequest(0, ['val' => $request->id]);

    $status = (int)$request->status;

    $arr = [
      'status' => $status,
      'remarks' => (isset($request->disapproveRemarks) ? strtoupper($request->disapproveRemarks) : ''),
      'user_id' => $user_id,
      'approved_date' => $status === 3 ? Carbon::now() : null,
    ];
    
    if($status === 2)
      $arr['created_at'] = Carbon::now();

    $updateClient = Client::where('id', $request->id)
      ->update($arr);

    $update = [];
    $loa = [];
    if ((int)$request->status == 3) {
      $title = strtoupper($request->loaNumber);
      $this->validate($request, [
        'attachLOA' => 'required|mimes:pdf',
      ]);

      $path = request('attachLOA')->storeAs('Self-service/LOA/' . $client[0]->memberID, request('attachLOA')->getClientOriginalName(), 'public');

      $update = [
        'loa_attachment' => 'storage/' . $path,
        'loa_number' => strtoupper($request->loaNumber),
        'approval_code' => strtoupper($request->approvalCode)
      ];

      $updateRequest = ClientRequest::where('client_id', $request->id)
        ->update($update);

      if ($client[0]->isDependent == 1) {
        $password = date('Ymd', strtotime($client[0]->depDob));
      } else {
        $password = date('Ymd', strtotime($client[0]->dob));
      }

      $encryptedPdfPath = $this->encryptPdf($path, $password);

      $loa = ['encryptedLOA' => $encryptedPdfPath];
    }

    $client = $this->SearchRequest(0, ['val' => $request->id]);
    $allClient = $this->SearchRequest(0, 2);

    $hospital_emails = [];
    if ($request->hospital_email1 != 'null') {
      // array_push($hospital_emails, $request->hospital_email1);
      array_push($hospital_emails, 'testllibi1@yopmail.com');
    }
    if ($request->hospital_email2 != 'null') {
      // array_push($hospital_emails, $request->hospital_email2);
      array_push($hospital_emails, 'testllibi2@yopmail.com');
    }

    //SendNotification
    $dataSend = [
      'refno' => $client[0]->refno,
      'remarks' => $request->disapproveRemarks,
      'status' => $status,
      'hospital_email' => $hospital_emails,
    ];

    $this->sendNotification(array_merge($dataSend, $update, $loa), $client[0]->firstName . ' ' . $client[0]->lastName, $client[0]->email, $client[0]->altEmail, $client[0]->contact);

    return array('client' => $client, 'all' => $allClient);
  }

  private function encryptPdf($path, $password)
  {
    $filePath = Storage::path('public/' . $path);

    /* if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $pdf = new Pdf($filePath, [
                'command' => 'C:\Program Files (x86)\PDFtk\bin\pdftk.exe',
                // or on most Windows systems:
                // 'command' => 'C:\Program Files (x86)\PDFtk\bin\pdftk.exe',
                'useExec' => true,  // May help on Windows systems if execution fails
            ]);
        } else {
            $pdf = new Pdf($filePath);
        }

        $userPassword = 'admin123456';
  
        $result = $pdf->allow('AllFeatures')
            ->setPassword($password)
            ->setUserPassword($userPassword)
            ->passwordEncryption(128)
            ->saveAs($filePath);
  
        if ($result === false) {
            $error = $pdf->getError();
        } */

    return $filePath;
  }

  function removePastValue($in, $before)
  {
    $pos = strpos($in, $before);
    return $pos !== FALSE
      ? substr($in, $pos + strlen($before), strlen($in))
      : "";
  }

  function clean($string)
  {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
    return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
  }

  private function sendNotification($data, $name, $email, $altEmail, $contact)
  {
    $name = ucwords(strtolower($name));
    $remarks = $data['remarks'];
    $ref = $data['refno'];

    $loanumber = (!empty($data['loa_number']) ? $data['loa_number'] : '');
    $approvalcode = (!empty($data['approval_code']) ? $data['approval_code'] : '');

    if (!empty($email)) {

      $attachment = [];
      if ($data['status'] == 3) {
        $attach = $data['encryptedLOA'];
        $attachment = [$attach, $attach];
      }

      //$numbers = $data['status'] === 3 ? "LOA #: <b>$loanumber</b> <br /> Approval Code: <b>$approvalcode</b>" : ''; <br /><br /> Password to LOA is requestor birth date: <b style="color:red;">YYYYMMDD i.e., 19500312</b>

      if ($data['status'] === 3) {
        $statusRemarks = 'Your LOA request is <b>approved</b>. Please print a copy LOA and present to the accredited provider upon availment.';
      } else {
        $statusRemarks = 'Your LOA request is <b>disapproved</b> with remarks: ' . $remarks;
      }

      $mailMsg =
        '<p style="font-weight:normal;">
                Hi <b>' . $name . ',</b><br /><br />
                ' . $statusRemarks . '<br /><br />
                For further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.<br /><br />
                Manila Line: (02) 8236-6492<br/>
                Mobile number for Calls Only:<br />
                0917-8055424<br />
                0917-8855424<br />
                0919-0749433<br />

                Email: clientcare@llibi.com<br /><br />

                Your reference number is <b>' . $ref . '</b>.<br /><br />
                <b>This is an auto-generated Email. Doesn’t support replies and calls.</b>
            </p>';

      // $body = array('body' => $mailMsg, 'attachment' => $attachment, 'hospital_email' => $data['hospital_email']);
      // $mail = (new NotificationController)->EncryptedPDFMailNotification($name, $email, $body);
      $emailer = new SendingEmail(email: $email, body: $mailMsg, subject: 'CLIENT CARE PORTAL - ADMIN NOTIFICATION', attachments: $attachment, cc: $data['hospital_email']);
      $emailer->send();

      if (!empty($altEmail)) {
        $emailer = new SendingEmail(email: $altEmail, body: $mailMsg, subject: 'CLIENT CARE PORTAL - ADMIN NOTIFICATION', attachments: $attachment, cc: $data['hospital_email']);
        $emailer->send();
        //   $altMail = (new NotificationController)->EncryptedPDFMailNotification($name, $altEmail, $body);
      }
    }

    if (!empty($contact)) {
      if ($data['status'] === 3) {
        $sms =
          "From Lacson & Lacson:\n\nHi $name,\n\nYour LOA request is approved, Please print a copy LOA and present to the accredited provider upon availment.\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference number: $ref\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.";
        //\nLOA #: $loanumber\nAPP #: $approvalcode \n\n Thank you
      } else {
        $sms =
          "From Lacson & Lacson:\n\nHi $name,\n\nYour LOA request is disapproved with remarks: $remarks\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference number is $ref\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.";
      }
      $sms = (new NotificationController)->SmsNotification($contact, $sms);
    }
  }

  //FILE UPLOADS
  public function getFiles($id)
  {
    $attachment = Attachment::where('request_id', $id)
      ->select('id', 'file_name', 'file_link')
      ->get();

    return $attachment;
  }

  public function export(Request $request)
  {
    $request_status = $request->status;
    $request_search = $request->search;
    $request_from = $request->from;
    $request_to = $request->to;

    $records = $this->exportRecords($request_search, $request_status, $request_from, $request_to)->toArray();

    return Excel::download(new AdminExport($records), 'records' . now()->format('Y-m-d') . '.xlsx');
  }

  public function exportRecords($search = 0, $status = 2, $from = null, $to = null)
  {
    $request = DB::table('app_portal_clients as t1')
      ->join('app_portal_requests as t2', 't2.client_id', '=', 't1.id')
      ->leftJoin('users as user', 'user.id', '=', 't1.user_id')
      ->leftJoin(env('DB_DATABASE_SYNC') . '.masterlist as mlist', 'mlist.member_id', '=', 't1.member_id')
      ->select(
        't1.id',
        't1.reference_number as refno',
        't1.email as email',
        't1.alt_email as altEmail',
        't1.contact as contact',
        't1.member_id as memberID',
        't1.first_name as firstName',
        't1.last_name as lastName',
        't1.remarks as remarks',
        't1.status as status',
        't2.loa_type as loaType',
        't2.loa_number as loaNumber',
        't2.approval_code as approvalCode',
        't2.complaint as complaint',
        't1.created_at as createdAt',
        't1.approved_date',
        DB::raw('TIMESTAMPDIFF(MINUTE, t1.created_at, t1.approved_date) as elapse_minutes'),
        DB::raw('TIMESTAMPDIFF(HOUR, t1.created_at, t1.approved_date) as elapse_hours'),
        'user.first_name as approved_by_first_name',
        'user.last_name as approved_by_last_name',
        'user.user_level',
        'mlist.company_name'
      )
      ->whereIn('t1.status', [2, 3, 4, 5])
      ->where(function ($query) use ($search, $status) {
        if ($search != 0) {
          $query->orWhere('t1.member_id', 'like', '%' . strtoupper($search) . '%');
          $query->orWhere('t1.first_name', 'like', '%' . strtoupper($search) . '%');
          $query->orWhere('t1.last_name', 'like', '%' . strtoupper($search) . '%');

          $query->orWhere('t1.dependent_member_id', 'like', '%' . strtoupper($search) . '%');
          $query->orWhere('t1.dependent_first_name', 'like', '%' . strtoupper($search) . '%');
          $query->orWhere('t1.dependent_last_name', 'like', '%' . strtoupper($search) . '%');
        }
        if (is_array($status)) {
          $query->where('t1.id', $status['val']);
        } else {
          if ($status != 0) {
            $query->where('t1.status', $status);
          }
        }
      })
      ->whereDate('t1.created_at', '>=', $from)
      ->whereDate('t1.created_at', '<=', $to)
      ->orderBy('t1.id', 'DESC')
      ->get();

    return $request;
  }

  public function viewBy(Request $request)
  {
    $user_id = request()->user()->id;

    $view_checker = Client::where('id', $request->id)->select('view_by')->first();

    if (!is_null($view_checker->view_by) && $view_checker->view_by != $user_id && $request->type == 'view') {
      return response()->json(['status' => false, 'message' => 'Someone already view this claims.']);
    }

    if ($request->type == 'view') {
      Client::where('id', $request->id)->update(['view_by' => $user_id]);
    } else {
      Client::where('id', $request->id)->update(['view_by' => null]);
    }

    return response()->json(['status' => true, 'message' => 'Success.']);
  }

  private function emailIsValid($email)
  {
    $isValidEmail = preg_match('/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/', $email) === 1;
    return $isValidEmail;
  }
}

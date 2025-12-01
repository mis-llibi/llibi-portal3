<?php

namespace App\Http\Controllers\Self_service;

use App\Http\Controllers\Controller;
use App\Http\Controllers\NotificationController;

use Illuminate\Http\Request;

use App\Models\Self_service\Client;
use App\Models\Self_service\ClientRequest;
use App\Models\Self_service\Complaints;
use App\Models\Self_service\Sync;
use App\Models\Self_service\SyncCompanies;
use App\Models\Self_service\Attachment;
use App\Models\Self_service\Hospitals;
use App\Models\Self_service\Procedure;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use App\Models\ApprovalCodeGenerator;
use mikehaertl\pdftk\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SelfService\AdminExport;
// use App\Models\Corporate\Hospitals;
use App\Services\GetActiveEmailProvider;
use App\Services\SendingEmail;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

use App\Models\ProviderPortal;
use App\Models\Self_service\EnumerateProcedure;
use App\Models\Self_service\RemainingTbl;
use App\Models\Self_service\RemainingTblLogs;
use App\Models\Self_service\LoaFilesInTransit;
use App\Models\Self_service\AppLoaMonitor;
use App\Models\Self_service\Companies;

class AdminController extends Controller
{
    public function SearchRequest($search, $id)
{
    // Define default statuses
    $defaultStatuses = [2, 6, 9];

    $request = DB::table('app_portal_clients as t1')
        ->join('app_portal_requests as t2', 't2.client_id', '=', 't1.id')
        // ->leftJoin('llibiapp_sync.masterlist as mlist', 'mlist.member_id', '=', 't1.member_id')
        // ->leftJoin('llibiapp_sync.masterlist as mlist', function ($join) {
        //     $join->on('mlist.member_id', '=', 't1.member_id')
        //         ->orOn('mlist.member_id', '=', 't1.dependent_member_id');
        // })
        ->leftJoin('llibiapp_sync.masterlist as mlist', function ($join) {
            $join->on('mlist.member_id', '=', DB::raw("
                CASE
                    WHEN t1.is_dependent = 1 THEN t1.dependent_member_id
                    ELSE t1.member_id
                END
            "));
        })
        ->rightJoin('app_portal_callback as t3', 't3.client_id', '=', 't1.id')
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
            't1.provider_remarks as provider_remarks',
            't1.status as status',
            't1.opt_landline as opt_landline',
            't1.callback_remarks as callback_remarks',
            't1.landline as landline',
            't1.opt_contact as opt_contact',
            't1.remaining as remaining',
            't1.is_complaint_has_approved as is_complaint_has_approved',
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
            't2.provider_procedure_type as procedure_type',
            't2.is_excluded as is_excluded',
            't1.approved_date',
            DB::raw('TIMESTAMPDIFF(MINUTE, t1.created_at, t1.approved_date) as elapse_minutes'),
            DB::raw('TIMESTAMPDIFF(HOUR, t1.created_at, t1.approved_date) as elapse_hours'),
            'mlist.company_name',
            'mlist.company_code',
            't1.provider_email2',
            't1.is_send_to_provider',
            't1.platform',
            't3.failed_count',
            't3.first_attempt_date',
            't3.second_attempt_date',
            't3.third_attempt_date',
            't3.created_at as callback_created_at',
            't3.updated_at as callback_updated_at',
            'mlist.empcode as inscode',
            't2.type_approval_code',
            't2.approval_code_loanumber',
        )
        ->where(function ($query) use ($id, $defaultStatuses) {
            if ($id == 8) {
                $query->whereIn('t1.status', $defaultStatuses); // Default statuses
            } elseif(is_array($id)){
                $query->where('t1.id', $id['val']);
            }else {
                $query->where('t1.status', $id);
            }
        })
        ->where(function ($query) use ($search) {
            if ($search != 0) {
                $query->orWhere('t1.member_id', 'like', '%' . strtoupper($search) . '%');
                $query->orWhere('t1.first_name', 'like', '%' . strtoupper($search) . '%');
                $query->orWhere('t1.last_name', 'like', '%' . strtoupper($search) . '%');

                $query->orWhere('t1.dependent_member_id', 'like', '%' . strtoupper($search) . '%');
                $query->orWhere('t1.dependent_first_name', 'like', '%' . strtoupper($search) . '%');
                $query->orWhere('t1.dependent_last_name', 'like', '%' . strtoupper($search) . '%');
            }
        })
        ->whereDate('t1.created_at', now()->format('Y-m-d'))
        ->orderBy('t1.id', 'DESC')
        ->limit(20)
        ->get();

    $request->transform(function($patient){

        $fullname = $patient->isDependent
            ? "{$patient->depLastName}, {$patient->depFirstName}"
            : "{$patient->lastName}, {$patient->firstName}";
        $insCode = (int) $patient->inscode;
        $compcode = $patient->company_code;
        $status = [1, 4];
        $types = ['outpatient', 'laboratory', 'consultation'];

        $loafiles = LoaFilesInTransit::where('patient_name', 'like', "%$fullname%")
                                    ->whereIn('status', $status)
                                    ->where(function ($q) use ($types) {
                                        foreach ($types as $type) {
                                            $q->orWhere('type', 'like', "%$type%");
                                        }
                                    })
                                    ->where('date', '>=', '2024-11-1')
                                    ->orderBy('id', 'desc')
                                    ->get();

        $claims = AppLoaMonitor::where('compcode', $compcode)
                            ->where('inscode', $insCode)
                            ->get();

        if(count($claims) > count($loafiles)){
            $patient->total_remaining = 0;
        }else{

            $totalLoaTransitClaims = count($loafiles) - count($claims);
            $patient->total_remaining = $patient->remaining - $totalLoaTransitClaims;
        }

        $benefit_type = Companies::where('corporate_compcode', $compcode)->first();

        if ($benefit_type) {
            $patient->benefit_type = $benefit_type->benefit_type;
        } else {
            // Handle not found
            $patient->benefit_type = null; // or some default value
            // Log::warning("Company not found for compcode: $compcode");
        }

        return $patient;


    });

    return $request;
}





//   public function SearchRequest($search, $id){
//     $request = DB::table('app_portal_clients as t1')
//       ->join('app_portal_requests as t2', 't2.client_id', '=', 't1.id')
//       ->leftJoin('llibiapp_sync.masterlist as mlist', 'mlist.member_id', '=', 't1.member_id')
//       ->select(
//         't1.id',
//         't1.reference_number as refno',
//         't1.email as email',
//         't1.alt_email as altEmail',
//         't1.contact as contact',
//         't1.member_id as memberID',
//         't1.first_name as firstName',
//         't1.last_name as lastName',
//         't1.dob as dob',
//         't1.is_dependent as isDependent',
//         't1.dependent_member_id as depMemberID',
//         't1.dependent_first_name as depFirstName',
//         't1.dependent_last_name as depLastName',
//         't1.dependent_dob as depDob',
//         't1.remarks as remarks',
//         't1.status as status',
//         't2.loa_type as loaType',
//         't2.loa_number as loaNumber',
//         't2.approval_code as approvalCode',
//         't2.loa_attachment as loaAttachment',
//         't2.complaint as complaint',
//         't2.lab_attachment as labAttachment',
//         't2.assessment_q1 as ass1',
//         't2.assessment_q2 as ass2',
//         't2.assessment_q3 as ass3',
//         't1.created_at as createdAt',
//         't2.provider_id as providerID',
//         't2.provider as providerName',
//         't2.doctor_id as doctorID',
//         't2.doctor_name as doctorName',
//         't2.diagnosis as diagnosis',
//         't1.approved_date',
//         DB::raw('TIMESTAMPDIFF(MINUTE, t1.created_at, t1.approved_date) as elapse_minutes'),
//         DB::raw('TIMESTAMPDIFF(HOUR, t1.created_at, t1.approved_date) as elapse_hours'),
//         'mlist.company_name',
//         'mlist.company_code',
//         't1.provider_email2',
//         't1.is_send_to_provider',
//         't1.platform'
//       )
//       ->whereIn('t1.status', [2, 3, 4, 5, 6])
//       ->where(function ($query) use ($search, $id) {
//         if ($search != 0) {
//           $query->orWhere('t1.member_id', 'like', '%' . strtoupper($search) . '%');
//           $query->orWhere('t1.first_name', 'like', '%' . strtoupper($search) . '%');
//           $query->orWhere('t1.last_name', 'like', '%' . strtoupper($search) . '%');

//           $query->orWhere('t1.dependent_member_id', 'like', '%' . strtoupper($search) . '%');
//           $query->orWhere('t1.dependent_first_name', 'like', '%' . strtoupper($search) . '%');
//           $query->orWhere('t1.dependent_last_name', 'like', '%' . strtoupper($search) . '%');
//         }
//         if (is_array($id)) {
//           $query->where('t1.id', $id['val']);
//         } else {
//           if ($id != 0) {
//             $query->where('t1.status', $id);
//           }
//         }
//       })
//       ->whereDate('t1.created_at', now()->format('Y-m-d'))
//       ->orderBy('t1.id', 'DESC')
//       // ->offset(0)
//       ->limit(20)
//       ->get();


//     return $request;
//   }

//   public function UpdateRequest(Request $request)
//   {
//     $user_id = request()->user()->id;
//     $client = $this->SearchRequest(0, ['val' => $request->id]);

//     $status = (int)$request->status;

//     $arr = [
//       'status' => $status,
//       'remarks' => (isset($request->disapproveRemarks) ? strtoupper($request->disapproveRemarks) : ''),
//       'user_id' => $user_id,
//       'approved_date' => $status === 3 ? Carbon::now() : null,
//     ];

//     $updateClient = Client::where('id', $request->id)
//       ->update($arr);

//     $update = [];
//     $loa = [];



//     $directory = 'Self-service/LOA/' . $client[0]->memberID;

//     if(!Storage::disk('llibiapp')->exists($directory)){
//       Storage::disk('llibiapp')->makeDirectory($directory);
//     }

//     if ((int)$request->status == 3) {
//       $title = strtoupper($request->loaNumber);
//       $this->validate($request, [
//         'attachLOA' => 'required|mimes:pdf',
//       ]);

//       //Define the file name and directory path
//       $member_id = $client[0]->memberID;
//       $current_date = Carbon::now()->format('Ymd');
//       $created_at = Carbon::parse($client[0]->createdAt)->format('Ymd_His');
//       $fileName = $member_id . '_' . $current_date . '_' . $created_at . '.pdf';
//       $path = $directory . '/' . $fileName;



//       $uploadedPath = request('attachLOA')->storeAs($directory, $fileName, 'llibiapp');
//       $fileLink = env('DO_LLIBI_CDN_ENDPOINT') . '/' . $path;



//       // $path = request('attachLOA')->storeAs('Self-service/LOA/' . $client[0]->memberID, request('attachLOA')->getClientOriginalName(), 'public');

//       $update = [
//         'loa_attachment' => $fileLink,
//         'loa_number' => strtoupper($request->loaNumber), // Ensure LOA Number is stored
//         'approval_code' => strtoupper($request->approvalCode)
//       ];

//       $updateRequest = ClientRequest::where('client_id', $request->id)
//         ->update($update);

//       if ($client[0]->isDependent == 1) {
//         $password = date('Ymd', strtotime($client[0]->depDob));
//       } else {
//         $password = date('Ymd', strtotime($client[0]->dob));
//       }

//       $encryptedPdfPath = $this->encryptPdf($path, $password);

//       $loa = ['encryptedLOA' => $encryptedPdfPath];
//     }

//     $client = $this->SearchRequest(0, ['val' => $request->id]);
//     $allClient = $this->SearchRequest(0, 2);

//     $hospital_emails = [];
//     // if ($request->hospital_email1 != 'null') {
//     // array_push($hospital_emails, $request->hospital_email1);
//     // array_push($hospital_emails, 'testllibi1@yopmail.com');
//     // }
//     // if ($request->hospital_email2 != 'null') {
//     // array_push($hospital_emails, $request->hospital_email2);
//     // array_push($hospital_emails, 'testllibi2@yopmail.com');
//     // }

//     //SendNotification
//     $dataSend = [
//       'refno' => $client[0]->refno,
//       'remarks' => $request->disapproveRemarks,
//       'status' => $status,
//       'hospital_email' => $hospital_emails,
//       'provider_email2' => $client[0]->provider_email2,
//       'is_send_to_provider' => $client[0]->is_send_to_provider,
//       'company_code' => $client[0]->company_code,
//       'member_id' => $client[0]->memberID,
//       'request_id' => $client[0]->id,
//       'email_format_type' => $request->email_format_type
//     ];

//    $this->sendNotification(array_merge($dataSend, $update, $loa), $client[0]->firstName . ' ' . $client[0]->lastName, $client[0]->email, $client[0]->altEmail, $client[0]->contact);

//     return array('client' => $client, 'all' => $allClient);
//   }

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


  $updateClient = Client::where('id', $request->id)
    ->update($arr);

  $update = [];
  $loa = [];

  if((int)$request->status == 4){
    $update = [
        'loa_status' => $status === 4 ? "Denied" : null
      ];
    ClientRequest::where('client_id', $request->id)->update($update);
  }

  if ((int)$request->status == 3) {
    $title = strtoupper($request->loaNumber);
    $this->validate($request, [
      'attachLOA' => 'required|mimes:pdf',
    ]);

    $directory = 'Self-service/LOA/' . $client[0]->memberID;

    // if(!Storage::disk('llibiapp')->exists($directory)){
    //   Storage::disk('llibiapp')->makeDirectory($directory);
    // }

    $path = $request->attachLOA->storeAs($directory, str_replace('_', '', $request->attachLOA->getClientOriginalName()), 'llibiapp');

    request('attachLOA')->storeAs('Self-service/LOA/' . $client[0]->memberID, str_replace('_', '', $request->attachLOA->getClientOriginalName()), 'public');

    $update = [
      'loa_attachment' => env('DO_LLIBI_CDN_ENDPOINT') . "/" . $path,
      'loa_number' => strtoupper(explode('_', $request->loaNumber)[0]) . '*',
      'approval_code' => strtoupper($request->approvalCode),
      'loa_status' => $status === 3 ? "Approved" : ""
    ];

    $updateRequest = ClientRequest::where('client_id', $request->id)
      ->update($update);

    // Check the complaints if existing in database and make it approve if status is pending
    $getComplaints = ClientRequest::where('client_id', $request->id)->first();
    $splitComplaints = explode(', ', $getComplaints->complaint);


    $this->ComplaintChecker($splitComplaints);
    $remaining = RemainingTbl::where('uniquecode', $getComplaints->member_id)->first();
    if (!$remaining) {
        // Check if member exists in logs, if not add it
        RemainingTblLogs::firstOrCreate([
            'member_id' => $getComplaints->member_id
        ]);
    } else {
        // Decrement only if allow is greater than 0
        if ($remaining->allow > 0) {
            RemainingTbl::where('uniquecode', $getComplaints->member_id)
                ->where('allow', '>', 0)
                ->decrement('allow');
        }
    }

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

  //SendNotification
  $dataSend = [
    'refno' => $client[0]->refno,
    'remarks' => $request->disapproveRemarks,
    'status' => $status,
    'hospital_email' => $hospital_emails,
    'provider_email2' => $client[0]->provider_email2,
    'is_send_to_provider' => $client[0]->is_send_to_provider,
    'company_code' => $client[0]->company_code,
    'member_id' => $client[0]->memberID,
    'request_id' => $client[0]->id,
    'email_format_type' => $request->email_format_type
  ];



    if($client[0]->platform == 'qr' && $status === 3){

        // Send Email Provider

        $this->sendNotificationProvider(
            array_merge($dataSend, $update, $loa),
            $client[0]->firstName . ' ' . $client[0]->lastName,
            $client[0]->email,
            $client[0]->altEmail,
            $client[0]->contact,
            $client[0]->depFirstName === null && $client[0]->depLastName === null ? null : $client[0]->depFirstName . ' ' . $client[0]->depLastName,
            $client[0]->providerID
        );

    }else{
        $this->sendNotification(
            array_merge($dataSend, $update, $loa),
            $client[0]->firstName . ' ' . $client[0]->lastName,
            $client[0]->email,
            $client[0]->altEmail,
            $client[0]->contact,
            $client[0]->depFirstName === null && $client[0]->depLastName === null ? null : $client[0]->depFirstName . ' ' . $client[0]->depLastName,
            $client[0]->providerID

            );
    }

  return array('client' => $client, 'all' => $allClient);
}

public function ComplaintChecker($complaints){

    if ($complaints) {
        foreach ($complaints as $complaint) {

            $getComplaint = Complaints::where('title', $complaint)->first();

            if ($getComplaint && $getComplaint->is_status == 0) {
                $getComplaint->update([
                    'is_status' => 1
                ]);
            }
        }
    }

}

public function UpdateRequestApproval(Request $request){

    $updatedProcedures = $request->updatedProcedures;
    $user_id = request()->user()->id;

    $status = (int)$request->status;

    $arr = [
        'status' => $status,
        'remarks' => ($status === 4 && isset($request->disapproveRemarks) ? strtoupper($request->disapproveRemarks) : ''),
        'user_id' => $user_id,
        'approved_date' => $status === 3 ? Carbon::now() : null
    ];

    $client = Client::where('id', $request->id)->update($arr);

    $update = [];

    if((int)$request->status == 4){
        $update = [
            'loa_status' => $status === 4 ? "Denied" : null
        ];
        ClientRequest::where('client_id', $request->id)->update($update);

        if(count($updatedProcedures) > 0){

            foreach($updatedProcedures as $procedures){

                $updateEnumerate = [
                    'cost' => 0,
                    'status' => "DENIED"
                ];
                EnumerateProcedure::where('request_id', $request->id)
                                    ->where('id', $procedures['id'])
                                    ->update($updateEnumerate);
            }

        }else{
            return response()->json([
                'message' => 'Procedures must be updated'
            ], 422);
        }
    }

    if((int) $request->status == 3){

        $findProviderIdClientRequest = ClientRequest::where('client_id', $request->id)->first();
        $findProvider = Hospitals::find($findProviderIdClientRequest->provider_id);
        $generatedApprovalCode = $this->generate($findProvider->hosp_code);
        $update = [
            // 'loa_attachment' => "APPROVAL CODE",
            'approval_code' => $generatedApprovalCode,
            'loa_status' => $status === 3 ? "Approved" : null,
        ];

        ClientRequest::where('client_id', $request->id)->update($update);

        if(count($updatedProcedures) > 0){

            foreach($updatedProcedures as $procedures){

                $updateEnumerate = [
                    'cost' => $procedures['status'] == 'DENIED' ? 0 : (float)$procedures['cost'],
                    'status' => $procedures['status']
                ];
                EnumerateProcedure::where('request_id', $request->id)
                                    ->where('id', $procedures['id'])
                                    ->update($updateEnumerate);
            }

        }else{
            return response()->json([
                'message' => 'Procedures must be updated'
            ], 422);
        }
    }

    $client = $this->SearchRequest(0, ['val' => $request->id]);
    $allClient = $this->SearchRequest(0, 2);

    $hospital_emails = [];

    $dataSend = [
        'refno' => $client[0]->refno,
        'remarks' => $request->disapproveRemarks,
        'status' => $status,
        'hospital_email' => $hospital_emails,
        'provider_email2' => $client[0]->provider_email2,
        'is_send_to_provider' => $client[0]->is_send_to_provider,
        'company_code' => $client[0]->company_code,
        'member_id' => $client[0]->memberID,
        'request_id' => $client[0]->id,
        'email_format_type' => $request->email_format_type
    ];


    $this->sendNotificationApprovalCode(
            array_merge($dataSend, $update),
            $client[0]->firstName . ' ' . $client[0]->lastName,
            $client[0]->email,
            $client[0]->altEmail,
            $client[0]->contact,
            $client[0]->depFirstName === null && $client[0]->depLastName === null ? null : $client[0]->depFirstName . ' ' . $client[0]->depLastName,
            $client[0]->providerID
    );

  return array('client' => $client, 'all' => $allClient);

}

    public function generate(string $hospitalCode): string
    {
        $date = now()->format('mdy'); // mmddyy format
        return DB::transaction(function () use ($hospitalCode, $date) {
            // Get or create record for today + hospital
            $record = ApprovalCodeGenerator::firstOrCreate(
                [
                    'hospital_code' => $hospitalCode,
                    'date' => $date,
                ],
                ['count' => 0]
            );
            // Increment counter
            $record->increment('count');
            // Pad count (example: 01, 02, 03...)
            $sequence = str_pad($record->count, 2, '0', STR_PAD_LEFT);
            // Log for debugging
            Log::info("Generated Approval Code: LLIBI{$hospitalCode}{$date}{$sequence}");
            // Return code
            return "LLIBI{$hospitalCode}{$date}{$sequence}";
        });
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

  private function sendNotificationProvider($data, $name, $email, $altEmail, $contact, $dependent, $providerID){
    $hospital = Hospitals::where('id', $providerID)->first();
    $accept_eloa = $hospital->accept_eloa;

    $provider_portal = ProviderPortal::where('provider_id', $providerID)
                                    ->where('user_type', 'Hospital')
                                    ->first();

    // Log::info($hospital->accept_eloa);
    // Log::info(asset('images/infographics-eloa.jpg'));


    $name = ucwords(strtolower($name));
    $dependent = $dependent === null ? null : ucwords(strtolower($dependent));
    $remarks = $data['remarks'];
    $ref = $data['refno'];
    // $provider_email2 = $data['provider_email2'];
    $provider_email2 = 'testllibi1@yopmail.com';
    $is_send_to_provider = $data['is_send_to_provider'];
    $company_code = $data['company_code'];
    $member_id = $data['member_id'];
    $request_id = $data['request_id'];

    $loanumber = (!empty($data['loa_number']) ? $data['loa_number'] : '');
    $approvalcode = (!empty($data['approval_code']) ? $data['approval_code'] : '');

    if (!empty($email)) {

      $attachment = [];
      if ($data['status'] == 3) {
        $attach = $data['encryptedLOA'];
        $attachment = [$attach];
      }

      //$numbers = $data['status'] === 3 ? "LOA #: <b>$loanumber</b> <br /> Approval Code: <b>$approvalcode</b>" : ''; <br /><br /> Password to LOA is requestor birth date: <b style="color:red;">YYYYMMDD i.e., 19500312</b>

      $homepage = env('FRONTEND_URL');
      $feedbackLink = '
        <div>
          We value your feedback: <a href="' . $homepage . '/feedback/?q=' . Str::random(64) . '&rid=' . $request_id . '&compcode=' . $company_code . '&memid=' . $member_id . '&reqstat=' . $data['status'] . '">
            Please click here
          </a>
        </div>
        <div>
          <a href="' . $homepage . '/feedback/?q=' . Str::random(64) . '&rid=' . $request_id . '&compcode=' . $company_code . '&memid=' . $member_id . '&reqstat=' . $data['status'] . '">
          <img src="' . env('APP_URL', 'https://portal.llibi.app') . '/storage/ccportal_1.jpg" alt="Feedback Icon" width="300">
          </a>
        </div>
      <br /><br />';

      if ($data['status'] === 3) {
        // $statusRemarks = 'Your LOA request is <b>approved</b>. Please print a copy LOA and present to the accredited provider upon availment.';



        $statusRemarksProvider = 'LOA Request for ' . '<b>' . $name . '</b>' . ' is <b>approved</b>. You may print LOA and issue to the patient.';

        if($accept_eloa){
            // $statusRemarks = 'Your LOA request has been approved. Your LOA Number is ' . '<b>'. $data['loa_number'] . '</b>' . '. '. '<br /><br />' .'You may print a copy of your LOA and present it to the accredited provider upon availment or you may present your (1) ER card or (2) LOA number together with any valid government ID as this provider now accepts e-LOA';

            $statusRemarks = 'Your LOA request has been approved. You may now notify the ' . '<b>' . $hospital->name . '</b>' . ' that it was already sent to their email. Alternatively, we also sent you a copy and you may forward it to the clinic/hospital email. ' . '<br /><br />' . 'You may print a copy of your LOA and present it to the accredited provider upon availment or you may present your (1) ER card or (2) LOA number together with any valid government ID as this provider now accepts e-LOA';


        }else{
            // $statusRemarks = 'Your LOA request has been approved. Your LOA Number is ' . '<b>'. $data['loa_number'] . '</b>' . '. '. '<br /><br />' .'Please print a copy of your LOA and present it to the accredited provider upon availment.';

            $statusRemarks = 'Your LOA request has been approved. You may now notify the ' . '<b>' . $hospital->name . '</b>' . ' that it was already sent to their email. Alternatively, we also sent you a copy and you may forward it to the clinic/hospital email.';
        }

        // switch ($data['email_format_type']) {
        //   case 'consultation':
        //     break;
        //   case 'laboratory':
        //     $statusRemarks = '
        //     <p>Your LOA request is <b>approved</b>. Please print a copy of LOA and present to the accredited provider upon availment with doctor’s laboratory referral.</p>
        //     <p>This is a pre-approved Outpatient Procedure LOA with approval code for guaranteed amount indicated. If the guaranteed amount is less than the actual laboratory cost or there are additional laboratory procedures as advised by the doctor, please contact our Client Care Hotline for re-approval.</p>';
        //     break;
        //   case '2n1-standalone':
        //     $statusRemarks = '
        //     <p>Please print a copy of LOA and present to the accredited provider upon availment.</p>
        //     <p>Consultation LOA is pre-approved. Outpatient Procedure LOA is subject for Client Care’s approval based on doctor’s laboratory referral and evaluation of the diagnosis.</p>';
        //     break;
        //   case 'pre-approved-laboratory':
        //     $statusRemarks = '
        //     <p>Please print a copy of LOA and present to the accredited provider upon availment with doctor’s laboratory referral.</p>
        //     <p>This is a pre-approved Outpatient Procedure LOA with approval code for guaranteed amount indicated. If the guaranteed amount is less than the actual laboratory cost or there are additional laboratory procedures as advised by the doctor, please contact our Client Care Hotline for re-approval.</p>';
        //     break;

        //   default:
        //     throw new Exception("Email format is not supported", 1);
        //     break;
        // }
      } else {
        $statusRemarks = 'Your LOA request is <b>disapproved</b> with remarks: ' . $remarks;
        $feedbackLink = '';
      }


      // $mailMsg =
      //   '<p style="font-weight:normal;">
      //           Hi <b>' . $name . ',</b><br /><br />
      //           ' . $statusRemarks . '<br /><br />
      //           For further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.<br /><br />
      //           Manila Line: (02) 8236-6492<br/>
      //           Mobile number for Calls Only:<br />
      //           0917-8055424<br />
      //           0917-8855424<br />
      //           0919-0749433<br />

      //           Email: clientcare@llibi.com<br /><br />

      //           Your reference number is <b>' . $ref . '</b>.<br />
      //           ' . $feedbackLink . '
      //           <b>This is an auto-generated Email. Doesn’t support replies and calls.</b>
      //       </p>';

      $bodyProvider = array(
        'body' => view('send-request-loa-hospital', [
          'hospital_name' => $hospital->name,
          'statusRemarks' => $statusRemarksProvider,
          'is_accept_eloa' => $accept_eloa,
          'ref' => $ref,
          'feedbackLink' => $feedbackLink,
        ]),
        'attachment' => $attachment
      );

      $bodyPatient = array(
        'body' => view('send-request-loa-patient', [
          'name' => $name,
          'dependent' => $dependent,
          'statusRemarks' => $statusRemarks,
          'is_accept_eloa' => $accept_eloa,
          'ref' => $ref,
          'feedbackLink' => $feedbackLink,
        ]),
        'attachment' => $attachment
      );

      switch (GetActiveEmailProvider::getProvider()) {
        case 'infobip':
          $mail = (new NotificationController)->EncryptedPDFMailNotification($name, $email, $bodyProvider);
          if (!empty($altEmail)) {
            $altMail = (new NotificationController)->EncryptedPDFMailNotification($name, $altEmail, $bodyPatient);
          }
          break;

        default:
          $mail = (new NotificationController)->NewMail($name, $email, $bodyProvider);
          if (!empty($altEmail)) {
            $altMail = (new NotificationController)->NewMail($name, $altEmail, $bodyPatient);
          }
          break;
      }

      // if ($is_send_to_provider == 1 && !empty($provider_email2)) {
      // $emailer = new SendingEmail(email: $provider_email2, body: $mailMsg, subject: 'CLIENT CARE PORTAL - NOTIFICATION', attachments: $attachment);
      // $emailer->send();
      // $altMail = (new NotificationController)->EncryptedPDFMailNotification($name, $provider_email2, $body);
      // }
    }

    if (!empty($contact)) {
      if ($data['status'] === 3) {

        if(isset($provider_portal->notification_sms) || $provider_portal->notification_sms != 'undefined'){
            $smsProvider = 'Hi ' . $hospital->name . '\n\n' . 'LOA request for ' . ($dependent == null ? $name : $dependent) . ' is approved. You may now print LOA and issue to the patient. \n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.'   ;
            $smsProvider = (new NotificationController)->SmsNotification($provider_portal->notification_sms, $smsProvider);

        }



        if($accept_eloa){
            // $sms =
            // 'From Lacson & Lacson:\n\nHi '. $name . ''. ($dependent !== null ? " and $dependent" : "") .',\n\nYour LOA request has been approved. Your LOA Number is ' . $data['loa_number'] . '. \n\n' .'You may print a copy of your LOA and present it to the accredited provider upon availment or you may present your (1) ER card or (2) LOA number together with any valid government ID as this provider now accepts e-LOA.\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference
            // number: ' . $ref . '\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.' ;

            $sms =
            'From Lacson & Lacson:\n\nHi '. $name . ''. ($dependent !== null ? " and $dependent" : "") .',\n\nYour LOA request is approved. You may now notify the ' . $hospital->name . ' that it was already sent to their email. Alternatively, we also sent you a copy and you may forward it to the clinic/hospital email.' . '\n\n' .'You may print a copy of your LOA and present it to the accredited provider upon availment or you may present your (1) ER card or (2) LOA number together with any valid government ID as this provider now accepts e-LOA.\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference number: ' . $ref . '\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.' ;
        }else{
            $sms =
            // 'From Lacson & Lacson:\n\nHi '. $name . ''. ($dependent !== null ? " and $dependent" : "") .',\n\nYour LOA request has been approved. Your LOA Number is ' . $data['loa_number'] . '. \n\n' .'Please print a copy LOA and present to the accredited provider upon availment.\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference number: ' . $ref . '\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.' ;

            $sms =
            'From Lacson & Lacson:\n\nHi '. $name . ''. ($dependent !== null ? " and $dependent" : "") .',\n\nYour LOA request is approved. You may now notify the ' . $hospital->name . ' that it was already sent to their email. Alternatively, we also sent you a copy and you may forward it to the clinic/hospital email.' . '\n\n' .'Please print a copy LOA and present to the accredited provider upon availment.\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference number: ' . $ref . '\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.' ;

        }
        // $sms =
        //   "From Lacson & Lacson:\n\nHi $name,\n\nYour LOA request is approved, Please print a copy LOA and present to the accredited provider upon availment.\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference number: $ref\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.";

      } else {
        $sms =
          "From Lacson & Lacson:\n\nHi $name" . ($dependent !== null ? " and $dependent" : "") .",\n\nYour LOA request is disapproved with remarks: $remarks\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference number is $ref\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.";
      }
      $sms = (new NotificationController)->SmsNotification($contact, $sms);


    }
  }

  private function sendNotificationApprovalCode($data, $name, $email, $altEmail, $contact, $dependent, $providerID){
    $hospital = Hospitals::where('id', $providerID)->first();
    $accept_eloa = $hospital->accept_eloa;

    $provider_portal = ProviderPortal::where('provider_id', $providerID)
                                    ->where('user_type', 'Hospital')
                                    ->first();


    // Log::info($hospital->accept_eloa);
    // Log::info(asset('images/infographics-eloa.jpg'));


    $name = ucwords(strtolower($name));
    $dependent = $dependent === null ? null : ucwords(strtolower($dependent));
    $remarks = $data['remarks'];
    $ref = $data['refno'];
    // $provider_email2 = $data['provider_email2'];
    $provider_email2 = 'testllibi1@yopmail.com';
    $is_send_to_provider = $data['is_send_to_provider'];
    $company_code = $data['company_code'];
    $member_id = $data['member_id'];
    $request_id = $data['request_id'];

    $loanumber = (!empty($data['loa_number']) ? $data['loa_number'] : '');
    $approvalcode = (!empty($data['approval_code']) ? $data['approval_code'] : '');

    if (!empty($email)) {

      //$numbers = $data['status'] === 3 ? "LOA #: <b>$loanumber</b> <br /> Approval Code: <b>$approvalcode</b>" : ''; <br /><br /> Password to LOA is requestor birth date: <b style="color:red;">YYYYMMDD i.e., 19500312</b>

      $homepage = env('FRONTEND_URL');
      $feedbackLink = '
        <div>
          We value your feedback: <a href="' . $homepage . '/feedback/?q=' . Str::random(64) . '&rid=' . $request_id . '&compcode=' . $company_code . '&memid=' . $member_id . '&reqstat=' . $data['status'] . '">
            Please click here
          </a>
        </div>
        <div>
          <a href="' . $homepage . '/feedback/?q=' . Str::random(64) . '&rid=' . $request_id . '&compcode=' . $company_code . '&memid=' . $member_id . '&reqstat=' . $data['status'] . '">
          <img src="' . env('APP_URL', 'https://portal.llibi.app') . '/storage/ccportal_1.jpg" alt="Feedback Icon" width="300">
          </a>
        </div>
      <br /><br />';

      if ($data['status'] === 3) {

        $statusRemarks = 'Your Approval Code request has been approved.';


        // if($accept_eloa){
        //     $statusRemarks = 'Your LOA request has been approved. Your LOA Number is ' . '<b>'. $data['loa_number'] . '</b>' . '. '. '<br /><br />' .'You may print a copy of your LOA and present it to the accredited provider upon availment or you may present your (1) ER card or (2) LOA number together with any valid government ID as this provider now accepts e-LOA';
        // }else{
        //     $statusRemarks = 'Your LOA request has been approved. Your LOA Number is ' . '<b>'. $data['loa_number'] . '</b>' . '. '. '<br /><br />' .'Please print a copy of your LOA and present it to the accredited provider upon availment.';
        // }


      } else {
        $statusRemarks = 'Your Approval Code request is <b>disapproved</b> with remarks: ' . $remarks;
        $feedbackLink = '';
      }


      $body = array(
        'body' => view('send-request-loa', [
          'name' => $name,
          'dependent' => $dependent,
          'statusRemarks' => $statusRemarks,
          'is_accept_eloa' => $accept_eloa,
          'ref' => $ref,
          'feedbackLink' => $feedbackLink,
        ]),
      );

      switch (GetActiveEmailProvider::getProvider()) {
        case 'infobip':
          $mail = (new NotificationController)->EncryptedPDFMailNotification($name, $email, $body);
          if (!empty($altEmail)) {
            $altMail = (new NotificationController)->EncryptedPDFMailNotification($name, $altEmail, $body);
          }
          break;

        default:
          $mail = (new NotificationController)->NewMail($name, $email, $body);
          if (!empty($altEmail)) {
            $altMail = (new NotificationController)->NewMail($name, $altEmail, $body);
          }
          break;
      }

      // if ($is_send_to_provider == 1 && !empty($provider_email2)) {
      // $emailer = new SendingEmail(email: $provider_email2, body: $mailMsg, subject: 'CLIENT CARE PORTAL - NOTIFICATION', attachments: $attachment);
      // $emailer->send();
      // $altMail = (new NotificationController)->EncryptedPDFMailNotification($name, $provider_email2, $body);
      // }
    }

    if(isset($provider_portal->notification_sms) || $provider_portal->notification_sms != 'undefined'){

        if($data['status'] === 3){
            $smsProvider = 'Hi ' . $hospital->name . '\n\n' . 'Approval Code Request for ' . ($dependent == null ? $name : $dependent) . ' is approved. You may now print LOA and issue to the patient. \n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.';
        }else{
            $smsProvider = 'Hi ' . $hospital->name . '\n\n' . 'Approval Code Request for ' . ($dependent == null ? $name : $dependent) . ' is disapproved with remarks: '.$remarks.'. \n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.';
        }

        $smsProvider = (new NotificationController)->SmsNotification($provider_portal->notification_sms, $smsProvider);
    }
  }

  private function sendNotification($data, $name, $email, $altEmail, $contact, $dependent, $providerID)


  {


    $hospital = Hospitals::where('id', $providerID)->first();
    $accept_eloa = $hospital->accept_eloa;

    // Log::info($hospital->accept_eloa);
    // Log::info(asset('images/infographics-eloa.jpg'));


    $name = ucwords(strtolower($name));
    $dependent = $dependent === null ? null : ucwords(strtolower($dependent));
    $remarks = $data['remarks'];
    $ref = $data['refno'];
    // $provider_email2 = $data['provider_email2'];
    $provider_email2 = 'testllibi1@yopmail.com';
    $is_send_to_provider = $data['is_send_to_provider'];
    $company_code = $data['company_code'];
    $member_id = $data['member_id'];
    $request_id = $data['request_id'];

    $loanumber = (!empty($data['loa_number']) ? $data['loa_number'] : '');
    $approvalcode = (!empty($data['approval_code']) ? $data['approval_code'] : '');

    if (!empty($email)) {

      $attachment = [];
      if ($data['status'] == 3) {
        $attach = $data['encryptedLOA'];
        $attachment = [$attach];
      }

      //$numbers = $data['status'] === 3 ? "LOA #: <b>$loanumber</b> <br /> Approval Code: <b>$approvalcode</b>" : ''; <br /><br /> Password to LOA is requestor birth date: <b style="color:red;">YYYYMMDD i.e., 19500312</b>

      $homepage = env('FRONTEND_URL');
      $feedbackLink = '
        <div>
          We value your feedback: <a href="' . $homepage . '/feedback/?q=' . Str::random(64) . '&rid=' . $request_id . '&compcode=' . $company_code . '&memid=' . $member_id . '&reqstat=' . $data['status'] . '">
            Please click here
          </a>
        </div>
        <div>
          <a href="' . $homepage . '/feedback/?q=' . Str::random(64) . '&rid=' . $request_id . '&compcode=' . $company_code . '&memid=' . $member_id . '&reqstat=' . $data['status'] . '">
          <img src="' . env('APP_URL', 'https://portal.llibi.app') . '/storage/ccportal_1.jpg" alt="Feedback Icon" width="300">
          </a>
        </div>
      <br /><br />';

      if ($data['status'] === 3) {
        // $statusRemarks = 'Your LOA request is <b>approved</b>. Please print a copy LOA and present to the accredited provider upon availment.';




        if($accept_eloa){
            $statusRemarks = 'Your LOA request has been approved. Your LOA Number is ' . '<b>'. $data['loa_number'] . '</b>' . '. '. '<br /><br />' .'You may print a copy of your LOA and present it to the accredited provider upon availment or you may present your (1) ER card or (2) LOA number together with any valid government ID as this provider now accepts e-LOA';
        }else{
            $statusRemarks = 'Your LOA request has been approved. Your LOA Number is ' . '<b>'. $data['loa_number'] . '</b>' . '. '. '<br /><br />' .'Please print a copy of your LOA and present it to the accredited provider upon availment.';
        }

        // switch ($data['email_format_type']) {
        //   case 'consultation':
        //     break;
        //   case 'laboratory':
        //     $statusRemarks = '
        //     <p>Your LOA request is <b>approved</b>. Please print a copy of LOA and present to the accredited provider upon availment with doctor’s laboratory referral.</p>
        //     <p>This is a pre-approved Outpatient Procedure LOA with approval code for guaranteed amount indicated. If the guaranteed amount is less than the actual laboratory cost or there are additional laboratory procedures as advised by the doctor, please contact our Client Care Hotline for re-approval.</p>';
        //     break;
        //   case '2n1-standalone':
        //     $statusRemarks = '
        //     <p>Please print a copy of LOA and present to the accredited provider upon availment.</p>
        //     <p>Consultation LOA is pre-approved. Outpatient Procedure LOA is subject for Client Care’s approval based on doctor’s laboratory referral and evaluation of the diagnosis.</p>';
        //     break;
        //   case 'pre-approved-laboratory':
        //     $statusRemarks = '
        //     <p>Please print a copy of LOA and present to the accredited provider upon availment with doctor’s laboratory referral.</p>
        //     <p>This is a pre-approved Outpatient Procedure LOA with approval code for guaranteed amount indicated. If the guaranteed amount is less than the actual laboratory cost or there are additional laboratory procedures as advised by the doctor, please contact our Client Care Hotline for re-approval.</p>';
        //     break;

        //   default:
        //     throw new Exception("Email format is not supported", 1);
        //     break;
        // }
      } else {
        $statusRemarks = 'Your LOA request is <b>disapproved</b> with remarks: ' . $remarks;
        $feedbackLink = '';
      }


      // $mailMsg =
      //   '<p style="font-weight:normal;">
      //           Hi <b>' . $name . ',</b><br /><br />
      //           ' . $statusRemarks . '<br /><br />
      //           For further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.<br /><br />
      //           Manila Line: (02) 8236-6492<br/>
      //           Mobile number for Calls Only:<br />
      //           0917-8055424<br />
      //           0917-8855424<br />
      //           0919-0749433<br />

      //           Email: clientcare@llibi.com<br /><br />

      //           Your reference number is <b>' . $ref . '</b>.<br />
      //           ' . $feedbackLink . '
      //           <b>This is an auto-generated Email. Doesn’t support replies and calls.</b>
      //       </p>';

      $body = array(
        'body' => view('send-request-loa', [
          'name' => $name,
          'dependent' => $dependent,
          'statusRemarks' => $statusRemarks,
          'is_accept_eloa' => $accept_eloa,
          'ref' => $ref,
          'feedbackLink' => $feedbackLink,
        ]),
        'attachment' => $attachment
      );

      switch (GetActiveEmailProvider::getProvider()) {
        case 'infobip':
          $mail = (new NotificationController)->EncryptedPDFMailNotification($name, $email, $body);
          if (!empty($altEmail)) {
            $altMail = (new NotificationController)->EncryptedPDFMailNotification($name, $altEmail, $body);
          }
          break;

        default:
          $mail = (new NotificationController)->NewMail($name, $email, $body);
          if (!empty($altEmail)) {
            $altMail = (new NotificationController)->NewMail($name, $altEmail, $body);
          }
          break;
      }

      // if ($is_send_to_provider == 1 && !empty($provider_email2)) {
      // $emailer = new SendingEmail(email: $provider_email2, body: $mailMsg, subject: 'CLIENT CARE PORTAL - NOTIFICATION', attachments: $attachment);
      // $emailer->send();
      // $altMail = (new NotificationController)->EncryptedPDFMailNotification($name, $provider_email2, $body);
      // }
    }

    if (!empty($contact)) {
      if ($data['status'] === 3) {
        if($accept_eloa){
            $sms =
            'From Lacson & Lacson:\n\nHi '. $name . ''. ($dependent !== null ? " and $dependent" : "") .',\n\nYour LOA request has been approved. Your LOA Number is ' . $data['loa_number'] . '. \n\n' .'You may print a copy of your LOA and present it to the accredited provider upon availment or you may present your (1) ER card or (2) LOA number together with any valid government ID as this provider now accepts e-LOA.\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference number: ' . $ref . '\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.' ;
        }else{
            $sms =
            'From Lacson & Lacson:\n\nHi '. $name . ''. ($dependent !== null ? " and $dependent" : "") .',\n\nYour LOA request has been approved. Your LOA Number is ' . $data['loa_number'] . '. \n\n' .'Please print a copy LOA and present to the accredited provider upon availment.\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference number: ' . $ref . '\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.' ;
        }
        // $sms =
        //   "From Lacson & Lacson:\n\nHi $name,\n\nYour LOA request is approved, Please print a copy LOA and present to the accredited provider upon availment.\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference number: $ref\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.";

      } else {
        $sms =
          "From Lacson & Lacson:\n\nHi $name" . ($dependent !== null ? " and $dependent" : "") .",\n\nYour LOA request is disapproved with remarks: $remarks\n\nFor further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.\n\nYour reference number is $ref\n\nThis is an auto-generated SMS. Doesn’t support replies and calls.";
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

    $client_request = Client::query()->with('clientRequest:id,client_id,loa_type')->where('id', $id)->first();

    return ['attachment' => $attachment, 'client_request' => $client_request];
  }

  public function getProcedure($id){
    $procedures = Procedure::where('request_id', $id)
                ->select('*')
                ->get();

    $client_request = Client::query()->with('clientRequest:id,client_id,loa_type')->where('id', $id)->first();

    return response()->json([
        'procedures' => $procedures,
        'client_request' => $client_request
    ], 200);
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

  public function previewExport(Request $request)
  {
    $request_status = $request->status;
    $request_search = $request->search;
    $request_from = $request->from;
    $request_to = $request->to;

    $records = $this->exportRecords($request_search, $request_status, $request_from, $request_to);

    return response()->json(['status' => true, 'message' => 'Fetching success', 'data' => $records]);
  }

  public function exportRecords($search = 0, $status = 2, $from = null, $to = null)
  {
    $request = DB::table('app_portal_clients as t1')
      ->join('app_portal_requests as t2', 't2.client_id', '=', 't1.id')
      ->leftJoin('users as user', 'user.id', '=', 't1.user_id')
      ->leftJoin('llibiapp_sync.masterlist as mlist', 'mlist.member_id', '=', 't1.member_id')
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
        't1.handling_time as elapse_minutes',
        // DB::raw('TIMESTAMPDIFF(MINUTE, t1.created_at, t1.approved_date) as elapse_minutes'),
        // DB::raw('TIMESTAMPDIFF(HOUR, t1.created_at, t1.approved_date) as elapse_hours'),
        'user.first_name as approved_by_first_name',
        'user.last_name as approved_by_last_name',
        'user.user_level',
        'mlist.company_name',
        't1.platform'
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
      });

    if ($from && $to) {
      $request = $request->whereDate('t1.created_at', '>=', $from)->whereDate('t1.created_at', '<=', $to);
    }

    $request = $request->orderBy('t1.id', 'DESC')->get();

    // foreach ($request as $key => $row) {
    //   $tat = 0;
    //   if ($row->approved_date) {
    //     $created_at = Carbon::parse($row->createdAt, 'Asia/Manila');
    //     $approved_at = Carbon::parse($row->approved_date, 'Asia/Manila');

    //     $valid_start = Carbon::parse('06:00'); // 6:00 AM
    //     $valid_end = Carbon::parse('18:00');   // 6:00 PM

    //     if ($created_at->isYesterday() && $approved_at->isToday()) {
    //       if ($created_at->format('H:i') > $valid_start->format('H:i') && $created_at->format('H:i') < $valid_end->format('H:i')) {
    //         $diff = Carbon::parse($created_at->format('H:i'))->diffInMinutes($valid_end);
    //         // Log::info('created ' . $diff);
    //         $tat += $diff;
    //       }

    //       // if ($approved_at->greaterThan($valid_start) && $approved_at->lessThan($valid_end)) {
    //       if ($approved_at->format('H:i') > $valid_start->format('H:i') && $approved_at->format('H:i') < $valid_end->format('H:i')) {
    //         $diff = Carbon::parse($valid_start)->diffInMinutes($approved_at->format('H:i'));
    //         // Log::info('approved ' . $diff);
    //         $tat += $diff;
    //       }
    //     }

    //     if ($created_at->isToday() && $approved_at->isToday()) {
    //       $diff = Carbon::parse($created_at)->diffInMinutes($approved_at);
    //       $tat += $diff;
    //     }
    //   }

    //   $request[$key]->elapse_minutes = $tat;
    //   $request[$key]->elapse_hours = $tat / 60;
    // }


    return $request;
  }

  public function viewBy(Request $request)
  {
    $user_id = request()->user()->id;

    $view_checker = Client::where('id', $request->id)->select('view_by')->first();

    if ($view_checker->view_by != NULL && ($view_checker->view_by != $user_id && $request->type == 'view')) {
      return response()->json(['status' => false, 'message' => 'This request is already handled by another CCE.']);
    }

    if ($request->type == 'view') {
      Client::where('id', $request->id)->update(['view_by' => $user_id]);
    } else {
      if ($view_checker->view_by == $user_id) {
        Client::where('id', $request->id)->update(['view_by' => null]);
      }
    }

    return response()->json(['status' => true, 'message' => 'Success.']);
  }

  private function emailIsValid($email)
  {
    $isValidEmail = preg_match('/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/', $email) === 1;
    return $isValidEmail;
  }

  function viewLogs(Request $request)
  {
    $result = DB::table('app_portal_clients as t1')
      ->join('app_portal_requests as t2', 't2.client_id', '=', 't1.id')
      ->leftJoin('llibiapp_sync.masterlist as mlist', 'mlist.member_id', '=', 't1.member_id')
      ->join('users as user', 'user.id', '=', 't1.view_by')
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
        't2.provider_id as providerID',
        't2.provider as providerName',
        't1.approved_date',
        DB::raw('TIMESTAMPDIFF(MINUTE, t1.created_at, t1.approved_date) as elapse_minutes'),
        DB::raw('TIMESTAMPDIFF(HOUR, t1.created_at, t1.approved_date) as elapse_hours'),
        'mlist.company_name',
        'mlist.company_code',
        't1.provider_email2',
        't1.is_send_to_provider',
        't1.view_by',
        'user.first_name as viewFirstname',
        'user.last_name as viewLastname',
        'user.email as viewEmail',
      )
      ->whereIn('t1.status', [2])
      ->orderBy('t1.id', 'DESC')
      ->limit(40)
      ->get();



    return $result;
  }

  public function renewImportCsv(Request $request)
  {
    $file = $request->file('file');

    $convertedToArray = $this->csvToArray($file->getRealPath());
    $data = [];
    for ($i = 0; $i < count($convertedToArray); $i++) {
      $birth_date = Carbon::createFromFormat('d/m/Y', $convertedToArray[$i]['birth_date']);
      $data[] = [
        'empid' => $convertedToArray[$i]['﻿employee_id'],
        'bday' => $birth_date,
        'name' => $convertedToArray[$i]['last_name'] . ', ' . $convertedToArray[$i]['first_name'],
      ];
    }

    // DB::connection('mysql_claims')->table('table_test')->insert($data);
    return 'Jobi done or what ever';
  }

  function csvToArray($filename = '', $delimiter = ',')
  {
    if (!file_exists($filename) || !is_readable($filename))
      return false;

    $header = null;
    $data = array();
    if (($handle = fopen($filename, 'r')) !== false) {
      while (($row = fgetcsv($handle, 1000, $delimiter)) !== false) {
        if (!$header) {
          $header = $row;
        } else {
          $data[] = array_combine($header, $row);
        }
      }
      fclose($handle);
    }

    return $data;
  }

  public function pendingCounter()
  {
    $request = DB::table('app_portal_clients as t1')
      ->join('app_portal_requests as t2', 't2.client_id', '=', 't1.id')
      ->leftJoin('llibiapp_sync.masterlist as mlist', 'mlist.member_id', '=', 't1.member_id')
      ->select('t1.id')
      ->where('t1.status', 2)
      ->limit(40)
      ->count();

    return ['pending' => $request];
  }

  public function updateTAT()
  {
    abort(418);
    $request = DB::table('app_portal_clients as t1')
      ->join('app_portal_requests as t2', 't2.client_id', '=', 't1.id')
      ->leftJoin('users as user', 'user.id', '=', 't1.user_id')
      ->leftJoin('llibiapp_sync.masterlist as mlist', 'mlist.member_id', '=', 't1.member_id')
      ->select(
        't1.id',
        't1.created_at as createdAt',
        't1.approved_date',
        't1.handling_time as elapse_minutes',
      )
      ->whereNotNull('t1.approved_date')
      ->orderByDesc('t1.id')
      ->whereDate('t1.created_at', '>=', '2023-09-01')
      ->whereDate('t1.created_at', '<=', '2023-09-24')
      ->get();

    foreach ($request as $key => $row) {
      $elapse_minutes = Carbon::parse($row->createdAt)->diffInMinutes($row->approved_date);

      DB::table('app_portal_clients')->where('status', 3)
        ->where('id', $row->id)
        ->whereDate('created_at', '>=', '2023-09-01')
        ->whereDate('created_at', '<=', '2023-09-24')->update([
          'handling_time' => $elapse_minutes
        ]);
    }

    return [count($request), $request];
  }

  // Get Company from DB
  public function getCompanies()
  {
    // put an alias for corporate_compcode as code
    $company = SyncCompanies::select('name', 'corporate_compcode as code')->get();

    return $company;
  }

}

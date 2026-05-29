<?php

namespace App\Http\Controllers\Self_service;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Self_service\LoaFilesInTransit;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GenerateLoaController extends Controller
{
    //

    public function LOAGenerate(
                                $corporate_compcode,
                                $company_id,
                                $employee_name,
                                $patient_name,
                                $patient_type,
                                $company_name,
                                $hospital_name,
                                $doctor_name,
                                $complaints,
                                $consultation_loa_template
    ){


        // Assign Document Number
        $document_number = $corporate_compcode . '-' . date("Y", time()) . '-p-';

        $result = LoaFilesInTransit::where('company_id', $company_id)
                            ->where('document_number', 'like', "%$document_number%")
                            ->orderBy('id', 'desc')
                            ->first();


        if(!empty($result)){
            $arrDoc = explode('-', $result->document_number);
            $num = $arrDoc[count($arrDoc) - 1];
            $removeAsterisk = explode('*', $num);

            $newNum = $removeAsterisk[0] + 1;
            $newNum = str_pad($newNum, 5, "0", STR_PAD_LEFT) . '*';

            $document_number = $document_number . $newNum;
        }else{
            $document_number = $document_number . '00001*';
        }

        $logoPath = public_path('llibi.png');
        $signaturePath = public_path('signature.png');
        $confidentialPath = public_path('confidential.jpg');


        if($consultation_loa_template == "standard"){
            $pdf = Pdf::loadView("pdf.outpatient", [
                'document_number' => $document_number,
                'document_datetime' => now()->format('M d, Y h:i A'),
                'doctor_name' => $doctor_name,
                'hospital_name' => $hospital_name,
                'employee_name' => $patient_type == "employee" ? strtoupper($patient_name) : strtoupper($employee_name),
                'company_name' => $company_name,
                'patient_name' => $patient_name,
                'logo' => $logoPath,
                'confidential' => $confidentialPath,
                'signature' => $signaturePath,
                'complaints' => $complaints,
            ]);
        }else{
            $pdf = Pdf::loadView("pdf.consultation2in1", [
                'document_number' => $document_number,
                'document_datetime' => now()->format('M d, Y h:i A'),
                'doctor_name' => $doctor_name,
                'hospital_name' => $hospital_name,
                'employee_name' => $patient_type == "employee" ? strtoupper($patient_name) : strtoupper($employee_name),
                'company_name' => $company_name,
                'patient_name' => $patient_name,
                'logo' => $logoPath,
                'confidential' => $confidentialPath,
                'signature' => $signaturePath,
                'complaints' => $complaints,
            ]);
        }

        $fileName = $document_number;
        $directory = 'loa/generated';
        $path = $directory . '/' . $fileName;



        $attachment = [[
            'contents' => $pdf->output(),
            'filename' => $fileName,
            'mime' => 'application/pdf',
        ]];

        $uploadPdfStatus = Storage::disk('llibiapp')->put($path, $pdf->output(), [
            'visibility' => 'public', // or 'public'
            'ContentType' => 'application/pdf',
        ]);

        $pdfContent = $pdf->output();

        $loaNumber = $document_number; // WFMSI-2026-p-00015*

        $cleanLoaNumber = str_replace('*', '', $loaNumber);

        $fileName = $cleanLoaNumber . '.pdf';
        $path = 'loa/generated/' . $fileName;

        $pdfContent = $pdf->output();

        $uploaded = Storage::disk('public')->put($path, $pdfContent);

        $filePath = Storage::path('public/' . $path);

        if($uploadPdfStatus){
            LoaFilesInTransit::create([
                'loa_files_id' => strtotime("now"),
                'type' => "Consultation",
                'document_number' => $document_number,
                'company_id' => $company_id,
                'employee_name' => $patient_type == "employee" ? strtoupper($patient_name) : strtoupper($employee_name),
                'patient_name' => $patient_name,
                'hospital_name' => $hospital_name,
                'doctor_name' => $doctor_name,
                'date' => date('Y-m-d'),
                'time' => date("H:i:s"),
                'status' => 1
            ]);
        }else{
            return response()->json([
                'message' => "Error uploading"
            ], 404);
        }

        return [
            'document_number' => $document_number,
            'attachment' => $attachment,
            'path' => $path,
            'filepath' => $filePath
        ];

    }
}

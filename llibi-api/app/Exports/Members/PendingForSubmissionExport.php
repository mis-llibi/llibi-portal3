<?php

namespace App\Exports\Members;

use App\Models\Members\hr_members;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;

use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;

use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;

use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;


class PendingForSubmissionExport implements FromCollection, WithEvents, WithHeadings, WithHeadingRow, WithCustomStartCell, ShouldAutoSize, WithColumnWidths
{
  private $data;

  public function __construct($data)
  {
    $this->data = $data;
  }

  /**
   * @return \Illuminate\Support\Collection
   */
  public function collection()
  {
    $new_members = [];

    if (!empty($this->data['members'])) {
      foreach ($this->data['members'] as $key => $row) {
        $principal = $row['relationship_id'] !== 'PRINCIPAL'
          ? hr_members::query()->where('member_id', $row['member_id'])->principal()->first()
          : '';

        $relationship_code = match ($row['relationship_id']) {
          'PRINCIPAL' => '0',
          'SPOUSE' => '1',
          'CHILD' => '2',
          'PARENT' => '3',
          'SIBLING' => '4',
          default => '5',
        };

        $data = [
          'sub_office_name' => '',
          'employee_number' => $row['member_id'],
          'last_name' => $row['last_name'],
          'first_name' => $row['first_name'],
          'middle_name' => $row['middle_name'],
          'principal' => $principal ? $principal->last_name . ", " . $principal->first_name : "",

          'birth_date' => $row['birth_date'] ? Carbon::parse($row['birth_date'])->format('m/d/Y') : '',

          'sex' => $row['gender'],
          'nationality' => '',
          'pccupation_job_position_rank' => '',
          'desired_plan' => '',
          'civil_status' => $row['civil_status'],
          'e_mail_address' => '',

          'hiring_date' => $row['date_hired'] ? Carbon::parse($row['date_hired'])->format('m/d/Y') : '',

          'regularization_date' => $row['reg_date'] ? Carbon::parse($row['reg_date'])->format('m/d/Y') : '',

          'dental_code' => '',
          'desired_action_code' => '',
          'relationship_code' => $relationship_code,

          'effective_date' => $row['effective_date'] ? Carbon::parse($row['effective_date'])->format('m/d/Y') : '',

          'remarks' => '',
          'mobile_number' => '',
          'address1' => 'address1',
          'address2' => 'address2',
          'city' => 'city',
        ];

        array_push($new_members, $data);
      }
    }



    return collect($new_members);
  }

  // public function drawings()
  // {
  /**
   * add image in excel
   */
  // $drawing = new Drawing();
  // $drawing->setName('Philcare Logo');
  // $drawing->setPath(Storage::path('public/philcare/images/philcarelogo.png'));
  // $drawing->setHeight(90);
  // $drawing->setCoordinates('A1');

  // return $drawing;
  // }

  public function registerEvents(): array
  {
    return [
      AfterSheet::class => function (AfterSheet $event) {
        $sheet = $event->sheet->getDelegate();

        // HEADER
        $sheet->setCellValue('A1', 'SubOffice Name');
        $sheet->setCellValue('B1', 'Employee Number');

        $sheet->setCellValue('C1', 'Enrollee\'s Name');
        $sheet->mergeCells('C1:E1');

        $sheet->setCellValue('F1', 'Name of Principal (Lastname,FIRSTNAME)');
        $sheet->setCellValue('G1', 'Birthdate');
        $sheet->setCellValue('H1', 'Sex');
        $sheet->setCellValue('I1', 'Nationality');
        $sheet->setCellValue('J1', 'Occupation/Job Position/Rank');
        $sheet->setCellValue('K1', 'Desired Plan');
        $sheet->setCellValue('L1', 'Civil Status');
        $sheet->setCellValue('M1', 'E-mail Address');
        $sheet->setCellValue('N1', 'Hiring Date');
        $sheet->setCellValue('O1', 'Regularization Date');
        $sheet->setCellValue('P1', 'Dental Code');
        $sheet->setCellValue('Q1', 'Desired Action Code');
        $sheet->setCellValue('R1', 'Relationship Code');
        $sheet->setCellValue('S1', 'Effective Date');
        $sheet->setCellValue('T1', 'Remarks');
        $sheet->setCellValue('U1', 'Mobile Number');
        $sheet->setCellValue('V1', 'Address');
        $sheet->mergeCells('V1:X1');

        /** 
         * set bg to yellow
         */
        $cellRange = 'A1:X1';
        $sheet->getStyle($cellRange)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FFFF00');

        /** 
         * back to bg white
         */
        $sheet->getStyle('J1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $sheet->getStyle('P1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $sheet->getStyle('T1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');

        /**
         * set font styles
         */
        $sheet->getStyle($cellRange)->getFont()->setBold(true);
        $sheet->getStyle($cellRange)->getAlignment()->setHorizontal('center')->setVertical('center');

        /**
         * set row height base on specific row
         */
        $sheet->getRowDimension('1')->setRowHeight(40);
      },
    ];
  }

  // public function styles(Worksheet $sheet)
  // {
  //   $sheet->getStyle('A16')->getFont()->setBold(true);
  // }

  public function headings(): array
  {
    return [];
  }

  public function columnWidths(): array
  {
    return [];
  }

  public function startCell(): string
  {
    return 'A2';
  }
}

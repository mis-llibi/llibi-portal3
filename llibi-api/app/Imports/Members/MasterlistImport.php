<?php

namespace App\Imports\Members;

use App\Models\Members\hr_members;
use App\Models\Members\hr_contact;
use App\Models\Members\hr_philhealth;

use Maatwebsite\Excel\Concerns\ToModel;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;

use Illuminate\Support\Facades\Validator;

class MasterlistImport implements ToCollection, WithHeadingRow, WithBatchInserts
{
    /**
    * @param Collection $collection
    */
    public function  __construct($comp)
    {
        $this->comp = $comp;
    }

    public function collection(Collection $rows)
    {
        foreach($rows as $row) 
        {
            $this->importToMasterlist($row);
        }
    }

    private function importToMasterlist($row)
    {
        if(trim(!empty($row['empno']))) {
            $members = [
                'employee_no' => $row['empno'],
                'last_name' => strtolower($row['lastname']),
                'first_name' => strtolower($row['firstname']),
                'middle_name' => strtolower($row['middlename']),
                'extension' => strtoupper($row['extension']),
                'gender' => strtoupper($row['gender']),
                'member_type' => strtoupper($row['membertype']),
                'birth_date' => $this->changeDateFormat($row['birthdate']),
                'relationship_id' => $row['relationshipid'],
                'civil_status' => $row['civilstat'],
                'effective_date' => $this->changeDateFormat($row['effectivedate']),
                'date_hired' =>$this->changeDateFormat($row['datehired']),
                'reg_date' => $this->changeDateFormat($row['regdate']),
                'if_enrollee_is_a_philhealth_member' => strtoupper($row['if_enrollee_is_a_philhealth_member']),
                'client_remarks' => $row['client_remarks'],
                'status' => 1,
            ];
            $member = hr_members::create($members);

            $contact = [
                'link_id' => $member->id,
                'street' => $row['street'],
                'city' => $row['city'],
                'province' => $row['province'],
                'zip_code' => $row['zipcode'],
                'email' => $row['email'],
                'mobile_no' => $row['mobileno'],
            ];
            hr_contact::create($contact);

            $philHealth = [
                'link_id' => $member->id,
                'philhealth_conditions' => $row['philhealth_conditions'],
                'position' => $row['position'],
                'plan_type' => $row['plan_type'],
                'branch_name' => $row['branch_name'],
                'philhealth_no' => $row['philhealth_no'],
                'senior_citizen_id_no' => $row['senior_citizen_id_no'],
            ];
            hr_philhealth::create($philHealth);
        } else {
            return response()->json([
                'message' => 'error'
            ], 402);
        }
    }

    private function changeDateFormat($oldDate)
    {
        $dateYear = date('Y', strtotime('-1 year'));
        $date = $dateYear.'-01-01';

        if(strlen(str_replace(" ", "", $oldDate)) == 5) {
            $unix_date = ($oldDate - 25569) * 86400;
            $date = gmdate('Y-m-d', $unix_date);
        } else if(strlen(trim($oldDate)) >= 10) {
            $date = date('Y-m-d', strtotime($oldDate));
        }

        return $date;
    }

    public function headingRow(): int
    {
        return 2;
    }

    public function batchSize(): int
    {
        return 1000;
    }
    
}

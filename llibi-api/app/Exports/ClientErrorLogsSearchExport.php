<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ClientErrorLogsSearchExport implements FromArray, WithHeadings, ShouldAutoSize
{
    protected $records;

    public function __construct($records)
    {
        $this->records = $records;
    }

    public function headings(): array
    {
        return [
            'ID',
            'REQUEST TYPE',
            'EMAIL',
            'IS DEPENDENT',
            'CREATED AT',
            'MEMBER ID',
            'FIRST NAME',
            'LAST NAME',
            'DOB',
            'DEPENDENT MEMBER ID',
            'DEPENDENT FIRST NAME',
            'DEPENDENT LAST NAME',
            'DEPENDENT DOB',
        ];
    }

    public function array(): array
    {
        $rows = [];

        foreach ($this->records as $record) {
            // $record might be an array or an object; normalize to array access.
            $r = is_array($record) ? $record : (array) $record;

            $rows[] = [
                $r['id'] ?? null,
                $r['request_type'] ?? null,
                $r['email'] ?? null,
                $r['is_dependent'] ?? null,
                $r['created_at'] ?? null,
                $r['member_id'] ?? null,
                $r['first_name'] ?? null,
                $r['last_name'] ?? null,
                $r['dob'] ?? null,
                $r['dependent_member_id'] ?? null,
                $r['dependent_first_name'] ?? null,
                $r['dependent_last_name'] ?? null,
                $r['dependent_dob'] ?? null,
            ];
        }

        return $rows;
    }
}

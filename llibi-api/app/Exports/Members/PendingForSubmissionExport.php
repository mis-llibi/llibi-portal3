<?php

namespace App\Exports\Members;

use App\Models\Members\hr_members;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PendingForSubmissionExport implements FromCollection, WithHeadings, ShouldAutoSize
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
    $members = hr_members::query()
      ->select(
        'member_id',
        'first_name',
        'middle_name',
        'last_name',
        'gender'
      )
      ->whereIn('id', $this->data['id'])
      ->get();

    return $members;
  }

  public function headings(): array
  {
    return [
      'member_id',
      'first_name',
      'middle_name',
      'last_name',
      'gender',
    ];
  }
}

<?php

namespace App\Imports\PreApprove;

use App\Models\PreApprove\Utilization;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\ToModel;

use Maatwebsite\Excel\Concerns\WithChunkReading;
use PhpParser\Node\Stmt\TryCatch;

class UtilizationImport implements ToCollection, WithBatchInserts, WithChunkReading
{
  public function collection(Collection  $rows)
  {
    $i = 0;
    foreach ($rows as $row) {
      // skipping heading or row 1
      if ($i > 0) {
        $dateString = $row[6];
        $date  = Carbon::createFromFormat('m/d/Y', $dateString);
        try {
          $isExist = Utilization::where([
            'uniqcode' => trim($row[0]),
            'empcode' => trim($row[1]),
            'claimnumb' => trim($row[2]),
            'seriesnumb' => trim($row[3]),
            'compcode' => trim($row[4]),
          ])->exists();

          if (!$isExist) {
            Utilization::insert([
              'uniqcode' => trim($row[0]),
              'empcode' => trim($row[1]),
              'claimnumb' => trim($row[2]),
              'seriesnumb' => trim($row[3]),
              'compcode' => trim($row[4]),
              'claimtype' => trim($row[5]),
              'claimdate' => $date->format('Y-m-d'),
              'diagcode' => trim($row[7]),
              'diagname' => trim($row[8]),
              'eligible' => trim($row[9]),
            ]);
          }
        } catch (\Throwable $th) {
          Log::error($th);
          throw $th;
        }
      }
      $i++;
    }
  }

  public function batchSize(): int
  {
    return 1000;
  }

  public function chunkSize(): int
  {
    return 1000;
  }
}

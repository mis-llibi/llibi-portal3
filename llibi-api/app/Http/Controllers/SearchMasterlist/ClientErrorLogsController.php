<?php 

namespace App\Http\Controllers\SearchMasterlist;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Exports\ClientErrorLogsSearchExport;
use App\Models\Self_service\ClientErrorLog;
use Maatwebsite\Excel\Facades\Excel;

class ClientErrorLogsController extends Controller
{
  public function index()
  {
    $search = request()->query('search');

    $clients = ClientErrorLog::query()
      ->where(function ($q) use ($search) {
        $q->where('member_id', 'LIKE', "%" . strtoupper($search) . "%");
        $q->orWhere('first_name', 'LIKE', "%" . strtoupper($search) . "%");
        $q->orWhere('last_name', 'LIKE', "%" . strtoupper($search) . "%");
        $q->orWhere('birth_date', 'LIKE', "%" . strtoupper($search) . "%");
      })
      ->select('*')
      ->take(50)
      ->get();

    return $clients;
  }
  
  public function search(Request $request)
  {
    $firstName = strtoupper($request->input('first_name'));
    $lastName = strtoupper($request->input('last_name'));
    $export = $request->boolean('export');

    //Get first three letters of the first name and last name for prefix matching
    $first3 = $firstName ? substr($firstName, 0, 3) : null;
    $last3  = $lastName  ? substr($lastName,  0, 3) : null;

    //Pagination params
    $offset = $request->input('offset', 0);
    $limit = $request->input('limit', 50);

    $clients = ClientErrorLog::query()
    ->where(function ($q) use ($firstName, $lastName, $first3, $last3) {
      if ($firstName && $lastName) {
        $q->where(function ($subQ) use ($firstName, $lastName, $first3, $last3) {
          $subQ->where(function($s) use ($firstName, $first3) {
            $s->whereRaw('UPPER(first_name) = ?', [$firstName]);
            if ($first3) $s->orWhereRaw('UPPER(first_name) LIKE ?', ["{$first3}%"]);
          })
          ->where(function($s) use ($lastName, $last3) {
            $s->whereRaw('UPPER(last_name) = ?', [$lastName]);
            if ($last3) $s->orWhereRaw('UPPER(last_name) LIKE ?', ["{$last3}%"]);
          });

          $subQ->orWhere(function ($depQ) use ($firstName, $lastName, $first3, $last3) {
            $depQ->where(function($s) use ($firstName, $first3) {
                $s->whereRaw('UPPER(dependent_first_name) = ?', [$firstName]);
                if ($first3) $s->orWhereRaw('UPPER(dependent_first_name) LIKE ?', ["{$first3}%"]);
            })
            ->where(function($s) use ($lastName, $last3) {
                $s->whereRaw('UPPER(dependent_last_name) = ?', [$lastName]);
                if ($last3) $s->orWhereRaw('UPPER(dependent_last_name) LIKE ?', ["{$last3}%"]);
            });
          });
        });
      }    
      })
    ->select(
      'id', 'request_type', 'email', 'is_dependent', 'created_at',
      'member_id', 'first_name', 'last_name', 'dob',
      'dependent_member_id', 'dependent_first_name', 'dependent_last_name', 'dependent_dob'
    )
    ->offset($offset)
    ->limit($limit)
    ->orderBy('created_at', 'desc')
    ->get();

    // Map results so each clients only contains relevant fields for its type
    $clients = $clients->map(function ($r) {
      $base = [
        'id' => $r->id,
        'request_type' => $r->request_type,
        'email' => $r->email,
        'is_dependent' => $r->is_dependent,
        'created_at' => $r->created_at,
      ];

      if ($r->is_dependent == 1) {
        return $base + [
          'dependent_member_id' => $r->dependent_member_id,
          'dependent_first_name' => $r->dependent_first_name,
          'dependent_last_name' => $r->dependent_last_name,
          'dependent_dob' => $r->dependent_dob,
          'member_id' => $r->member_id,
          'first_name' => $r->first_name,
          'last_name' => $r->last_name,
          'dob' => $r->dob,
        ];
      }

      return $base + [
        'member_id' => $r->member_id,
        'first_name' => $r->first_name,
        'last_name' => $r->last_name,
        'dob' => $r->dob,
      ];
    });

    // Export to Excel if requested
    if ($export) {
      $lnameSegment = $lastName ? preg_replace('/[^A-Za-z0-9_-]/', '', $lastName) . '_' : '';
      $filename = $lnameSegment . 'error_logs_' . date('Ymd') . '.xlsx';
      return Excel::download(new ClientErrorLogsSearchExport($clients), $filename);
    }

    return response()->json($clients);
  }
}
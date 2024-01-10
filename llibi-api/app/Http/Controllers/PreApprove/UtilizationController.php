<?php

namespace App\Http\Controllers\PreApprove;

use App\Http\Controllers\Controller;
use App\Imports\Deel\DepsImport;
use App\Imports\PreApprove\UtilizationImport;
use App\Models\Corporate\Companies;
use App\Models\Corporate\Employees;
use App\Models\PreApprove\Laboratory;
use Illuminate\Http\Request;

use App\Models\PreApprove\Utilization;
use App\Models\Self_service\Sync;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class UtilizationController extends Controller
{
  public function index(Request $request)
  {
    $dd = Utilization::where('claimnumb', '0000016394')->first();

    return $dd->diagname;
  }

  function importUtilization(Request $request)
  {
    set_time_limit(0);
    foreach ($request->file as $key => $file) {
      Excel::import(new UtilizationImport, $file);
    }

    return 'done';
  }

  public function getEmployee(Request $request)
  {
    $employee_id = $request->query('employee_id', null);

    abort_if(!$employee_id, '400', 'Something Went Wrong.');

    $employees = Employees::where('id', $employee_id)
      ->select('id', 'company_id', 'code', 'given', 'middle', 'last', 'ipr', 'opr', 'birthdate')
      ->first();

    abort_if(!$employees, '404', 'Employee Not Found.');

    $companies = Companies::where('id', $employees->company_id)
      ->select('id', 'code', 'name', 'plantype', 'sharetype')
      ->first();

    abort_if(!$companies, '404', 'Company Not Found.');

    $employees['companies'] = $companies;

    $masterlist = Sync::query()
      ->whereDate('birth_date', Carbon::parse($employees->birthdate)->format('Y-m-d'))
      ->where('empcode', $employees->code)
      ->first();

    abort_if(!$masterlist, '404', 'Masterlist Not Found.');

    $utilization = Utilization::where('uniqcode', $masterlist->member_id)->get();
    $laboratory = Laboratory::query()->get();

    $employees['utilization'] = $utilization;
    $employees['laboratory'] = $laboratory;

    return response()->json($employees);
  }

  function importDeelUpload(Request $request)
  {
    Excel::import(new DepsImport, $request->file);

    return 'done';
  }
}

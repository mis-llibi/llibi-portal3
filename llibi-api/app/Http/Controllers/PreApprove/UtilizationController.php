<?php

namespace App\Http\Controllers\PreApprove;

use App\Http\Controllers\Controller;
use App\Imports\Deel\DepsImport;
use App\Imports\PreApprove\UtilizationImport;
use App\Models\Corporate\Companies;
use App\Models\Corporate\Employees;
use Illuminate\Http\Request;

use App\Models\PreApprove\Utilization;
use App\Models\Self_service\Sync;
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
    /**
     * NOTE:
     * The file must be csv and save as utf8 format
     * click file, save as, more options, tools, web options, encoding set to utf-8
     */
    Excel::import(new UtilizationImport, $request->file);

    return 'done';
  }

  public function getEmployee(Request $request)
  {
    $employee_id = $request->query('employee_id', null);

    abort_if(!$employee_id, '400', 'Something Went Wrong.');

    $employees = Employees::limit(100)
      ->where('id', $employee_id)
      ->select('id', 'company_id', 'code', 'given', 'middle', 'last', 'ipr', 'opr', 'birthdate')
      ->first();

    abort_if(!$employees, '404', 'Employee Not Found.');

    $companies = Companies::where('id', $employees->company_id)
      ->select('id', 'code', 'name', 'plantype', 'sharetype')
      ->first();

    abort_if(!$companies, '404', 'Company Not Found.');

    $employees['companies'] = $companies;

    $masterlist = Sync::where('birth_date', $employees->birthdate)
      ->where('empcode', $employees->code)
      ->first();

    abort_if(!$masterlist, '404', 'Masterlist Not Found.');

    $utilization = Utilization::where('uniqcode', $masterlist->member_id)->get();

    $employees['utilization'] = $utilization;

    return response()->json($employees);
  }

  function importDeelUpload(Request $request)
  {
    Excel::import(new DepsImport, $request->file);

    return 'done';
  }
}

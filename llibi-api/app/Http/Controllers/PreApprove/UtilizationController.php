<?php

namespace App\Http\Controllers\PreApprove;

use App\Http\Controllers\Controller;
use App\Imports\Deel\DepsImport;
use App\Imports\PreApprove\UtilizationImport;
use App\Models\Corporate\Companies;
use App\Models\Corporate\Dependents;
use App\Models\Corporate\Employees;
use App\Models\Corporate\LoaDependent;
use App\Models\Corporate\LoaEmployee;
use App\Models\Corporate\UtilizationLoa;
use App\Models\PreApprove\Laboratory;
use Illuminate\Http\Request;

use App\Models\PreApprove\Utilization;
use App\Models\Self_service\Sync;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
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
    $patient_id = $request->query('patient_id', null);

    abort_if(!$employee_id, '400', 'Something went wrong. Please check employee id');
    abort_if(!$patient_id, '400', 'Something went wrong. Please check patient id');

    if ($employee_id != $patient_id) {
      //dependents

      $dependents = Dependents::where('id', $patient_id)
        ->where('employee_id', $employee_id)
        ->select('id', 'employee_id', 'code', 'given', 'middle', 'last', 'ipr', 'opr', 'birthdate')
        ->first();

        if(!$dependents) {
          abort(404, 'Dependents not found.');
        }

      return $this->dependentPreApprovedDetails($dependents);
    } else {
      // employee

      $employees = Employees::where('id', $patient_id)
        ->select('id', 'company_id', 'code', 'given', 'middle', 'last', 'ipr', 'opr', 'birthdate')
        ->first();

        if(!$employees) {
          abort(404, 'Employee not found.');
        }

      return $this->employeePreApprovedDetails($employees);
    }

    abort(400, 'Something went wrong.');
  }

  private function employeePreApprovedDetails($employees)
  {
    $companies = Companies::where('id', $employees->company_id)
      ->select('id', 'code', 'name', 'plantype', 'sharetype')
      ->first();

    $masterlist = $this->getMasterList($employees->code, $employees->birthdate);

    abort_if(!$masterlist, '404', 'Masterlist Not Found.');

    $utilization = Utilization::query()->where('compcode', $masterlist->company_code);
    // Plan 1: base uniqcode
    // Plan 2: base empcode per family
    // Plan 3: base empcode except relation employee
    if ($masterlist->plantype == 1) {
      $utilization = $utilization->where('uniqcode', $masterlist->member_id)->get();
    } else if ($masterlist->plantype == 2) {
      $utilization = $utilization->where('empcode', $masterlist->empcode)->get();
    } else {
      // 3
      $utilization = $utilization->where('empcode', $masterlist->empcode)
        ->where('relation', '!=', 'EMPLOYEE')
        ->get();
    }

    $laboratory = Laboratory::query()->get();

    $loaUtilization = UtilizationLoa::query()
      ->whereIn('status', [1, 2])
      ->where('patcode', $employees->code)
      ->where('companycode', $companies->code)
      ->get();

    $reserving_amount = 0;

    if ($loaUtilization) {
      foreach ($loaUtilization as $key => $row) {
        $loa_employee = LoaEmployee::query()
          ->where('employee_id', $employees->id)
          ->where(function ($query) use ($row) {
            $query->whereDate('incepfrom', '<=', Carbon::parse($row->dateissued)->format('Y-m-d'));
            $query->whereDate('incepto', '>=', Carbon::parse($row->dateissued)->format('Y-m-d'));
          })
          ->first();

        if ($loa_employee) {
          $reserving_amount += $row->amount;
        }
      }
    }

    $employees['companies'] = $companies;
    $employees['plan_type'] = $masterlist->plantype;
    $employees['utilization'] = $utilization;
    $employees['laboratory'] = $laboratory;
    // $employees['loa_util'] = $loaUtilization;
    $employees['reserving_amount'] = $masterlist->plantype === 2 ? '5542.00' : $reserving_amount;
    $employees['masterlist'] = $masterlist;

    return response()->json($employees);
  }

  private function dependentPreApprovedDetails($dependents)
  {
    $employees = Employees::where('id', $dependents->employee_id)
      ->select('id', 'company_id', 'code', 'given', 'middle', 'last', 'ipr', 'opr', 'birthdate')
      ->first();

    $companies = Companies::where('id', $employees->company_id)
      ->select('id', 'code', 'name', 'plantype', 'sharetype')
      ->first();

    $masterlist = $this->getMasterList($employees->code, $dependents->birthdate);

    abort_if(!$masterlist, '404', 'Masterlist Not Found.');

    $utilization = Utilization::query()->where('compcode', $masterlist->company_code);
    // Plan 1: base uniqcode
    // Plan 2: base empcode per family
    // Plan 3: base empcode except relation employee
    if ($masterlist->plantype == 1) {
      $utilization = $utilization->where('uniqcode', $masterlist->member_id)->get();
    } else if ($masterlist->plantype == 2) {
      $utilization = $utilization->where('empcode', $masterlist->empcode)->get();
    } else {
      // 3
      $utilization = $utilization->where('empcode', $masterlist->empcode)
        ->where('relation', '!=', 'EMPLOYEE')
        ->get();
    }

    $laboratory = Laboratory::query()->get();

    $loaUtilization = UtilizationLoa::query()
      ->whereIn('status', [1, 2])
      ->where('patcode', $employees->code)
      ->where('companycode', $companies->code)
      ->get();

    $reserving_amount = 0;

    if ($loaUtilization) {
      foreach ($loaUtilization as $key => $row) {
        $loa_dependent = LoaDependent::query()
          ->where('dependent_id', $dependents->id)
          ->where(function ($query) use ($row) {
            $query->whereDate('incepfrom', '<=', Carbon::parse($row->dateissued)->format('Y-m-d'));
            $query->whereDate('incepto', '>=', Carbon::parse($row->dateissued)->format('Y-m-d'));
          })
          ->first();

        if ($loa_dependent) {
          $reserving_amount += $row->amount;
        }
      }
    }

    $employees['companies'] = $companies;
    $employees['plan_type'] = $masterlist->plantype;
    $employees['utilization'] = $utilization;
    $employees['laboratory'] = $laboratory;
    // $employees['loa_util'] = $loaUtilization;
    $employees['reserving_amount'] = $masterlist->plantype === 2 ? '5542.00' : $reserving_amount;
    $employees['masterlist'] = $masterlist;

    return response()->json($employees);
  }

  private function getMasterList($empcode, $birthdate)
  {
    return Sync::query()
      ->whereDate('birth_date', Carbon::parse($birthdate)->format('Y-m-d'))
      ->where('empcode', $empcode)
      ->first();
  }

  function importDeelUpload(Request $request)
  {
    Excel::import(new DepsImport, $request->file);

    return 'done';
  }
}

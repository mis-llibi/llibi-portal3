<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
  |--------------------------------------------------------------------------
  | API Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register API routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | is assigned the "api" middleware group. Enjoy building your API!
  |
*/

use App\Http\Controllers\Members\ManageMemberController;
use App\Http\Controllers\Members\ManageEnrolleeController;
use App\Http\Controllers\Self_service_mobile\MobileAuthenticatedSessionController;
use App\Http\Controllers\Self_enrollment\ManageSelfEnrollmentController as SelfEnrollmentController;
use App\Http\Controllers\Dental_insurance\DentalInsuranceAuthController;
use App\Http\Controllers\Dental_insurance\DentalInsuranceManageMemberController;
use App\Http\Controllers\Da_extract\ManageDaMemberController;
use App\Http\Controllers\Corporate\MembersController as CorporateMembers;
use App\Http\Controllers\Self_service\AdminController as SelfService;
use App\Http\Controllers\Self_service\AutoSendPendingNotMoving;
use App\Http\Controllers\SettingController;
use App\Models\User;
use App\Http\Controllers\Feedback\FeedbackController;
use App\Http\Controllers\PreApprove\UtilizationController;
use App\Http\Controllers\PreApprove\LaboratoryController;

use App\Http\Controllers\Api_third_party\MobileApiAccessController;
use App\Http\Controllers\Feedback\FeedbackCorporateController;
use App\Http\Controllers\SearchMasterlist\MasterlistController;
use App\Http\Controllers\Self_service\ComplaintController;

use App\Http\Controllers\Api_third_party\BenadEncryptor;


Route::group(['middleware' => ['auth:sanctum']], function () {

  Route::get('/user', function (Request $request) {
    if ($request->user()->is_logout == 0) {
      User::where(['id' => $request->user()->id])->update(['is_logout' => 1]);

      $request->session()->invalidate();

      $request->session()->regenerateToken();

      return response()->json([
        'message' => 'account is inactive'
      ], 404);
    }
    if ($request->user()->status == 1) return $request->user();
    return response()->json([
      'message' => 'account is inactive'
    ], 404);
  });

  //HR ENROLLMENT
  Route::get('/get-enrollees/{status}', [ManageEnrolleeController::class, 'getEnrollees']);
  Route::get('/get-correction/{id}', [ManageEnrolleeController::class, 'getCorrection']);

  //SELF ENROLLMENT ADMIN
  Route::get('/self-enrollment/get-submitted-and-approved-clients/{memberid}/{company}', [SelfEnrollmentController::class, 'getSubmittedAndApprovedClients']);
  Route::get('/self-enrollment/get-all-principal-clients/{status}/{company}', [SelfEnrollmentController::class, 'getAllPrincipalClients']);
  Route::get('/self-enrollment/export-clients/{company}', [SelfEnrollmentController::class, 'exportClients']);

  //SELF ENROLLMENT FOR LIFE INSURANCE
  Route::get('/self-enrollment/get-clients-for-life-insurance/{status}', [SelfEnrollmentController::class, 'getClientsForLifeInsurance']);
});

Route::get('/self-enrollment/testing', [SelfEnrollmentController::class, 'testing']);

//SELF ENROLLMENT CLIENTS
Route::get('/self-enrollment/get-client-info/{id}/{company}', [SelfEnrollmentController::class, 'checkClient']);
Route::get('/self-enrollment/get-uploaded-files/{id}', [SelfEnrollmentController::class, 'getFiles']);
Route::get('/self-enrollment/check-reminders/{company}/{date}/{finalWarning}/{locked}', [SelfEnrollmentController::class, 'checkReminders']);

//SELF-SERVICE
Route::get('/self-service/download-pdf', [SelfService::class, 'encryptPdf']);
Route::get('/self-service/get-uploaded-files/{id}', [SelfService::class, 'getFiles']);
Route::get('/self-service/admin-search-request/{search}/{id}', [SelfService::class, 'SearchRequest']);
Route::get('/self-service/admin-search-request/pending-counter', [SelfService::class, 'pendingCounter']);
Route::post('/self-service/admin/export', [SelfService::class, 'export']);
Route::post('/self-service/admin/export-records', [SelfService::class, 'exportRecords']);
Route::post('/self-service/admin/preview-export-records', [SelfService::class, 'previewExport']);
Route::get('/self-service/admin/update-tat', [SelfService::class, 'updateTAT']);

//MOBILE SELF-SERVICE LOGIN
// Route::get('/user-mobile', [MobileAuthenticatedSessionController::class, 'checkSession']);

//DENTAL INSURANCE
Route::get('/dental-insurance/member', [DentalInsuranceAuthController::class, 'checkSession']);
Route::get('/dental-insurance/{enrolled}', [DentalInsuranceManageMemberController::class, 'viewMembers']);

//DA EXTRACT
Route::get('/da-extract-members', [ManageDaMemberController::class, 'getMembers']);

//CORPORATE API
Route::get('/corporate/employees/{status}/{lastname}/{firstname}', [CorporateMembers::class, 'GetEmployees']);
Route::get('/corporate/dependents/{status}/{lastname}/{firstname}', [CorporateMembers::class, 'GetDependents']);

//COMPANIES SYNC API
Route::get('/ebdencrypt/show-companies', [BenadEncryptor::class, 'GetCompanies']);
Route::post('/ebdencrypt/update-password', [BenadEncryptor::class, 'UpdateCompanyPassword']);

Route::get('/create-client-portal-account', [AuthenticatedSessionController::class, 'createUser']);
Route::get('/auto-send', [AutoSendPendingNotMoving::class, 'autoSendEmail']);
Route::post('/view-by', [SelfService::class, 'viewBy']);
Route::get('/view-logs', [SelfService::class, 'viewLogs']);
Route::get('/settings', [SettingController::class, 'index']);
Route::put('/settings', [SettingController::class, 'update']);

require __DIR__ . '/feedback.php';
require __DIR__ . '/pre-approved.php';

//THIRD PARTY APP API
Route::get('/third-party/member', [MobileApiAccessController::class, 'GetMemberData']);
Route::post('/renew/upload-csv', [SelfService::class, 'renewImportCsv']);
Route::get('/environment-checker', fn () => config('app.env'));
Route::get('/search-masterlist', [MasterlistController::class, 'index']);
Route::get('/export-enrolled', [ManageEnrolleeController::class, 'exportEnrolled']);
Route::post('/upload-file', [ManageEnrolleeController::class, 'uploadFile']);
Route::get('/retrieve-file', [ManageEnrolleeController::class, 'retrieveFile']);


Route::controller(ComplaintController::class)->group(function () {
  Route::get('/complaint', 'index');
  Route::get('/complaint/{id}', 'show');
  Route::post('/complaint', 'store');
});

//require __DIR__ . '/hris.php';

Route::get('/excel-template', [ManageEnrolleeController::class, 'excelTemplate']);

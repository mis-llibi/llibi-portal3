<?php

use App\Http\Controllers\Members\AdminController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Members\ManageEnrolleeController;

Route::group(['middleware' => ['auth:sanctum']], function () {
  Route::controller(ManageEnrolleeController::class)
    ->prefix('members-enrollment')
    ->group(function () {
      Route::post('/submit-for-enrollment', 'submitForEnrollment');
      Route::delete('/delete-pending/{id}', 'deletePending');
      Route::post('/new-enrollment', 'newEnrollment');
      Route::put('/new-enrollment/{id}', 'updateEnrollment');
      Route::post('/submit-for-deletion', 'submitForDeletion');
      Route::get('/principals', 'fetchPrincipal');
      Route::get('/members', 'index');

      Route::patch('/change-plan/{id}', 'changePlan');
      Route::patch('/delete-members/{id}', 'deleteMember');
    });
});

Route::group(['middleware' => ['auth:sanctum']], function () {
  Route::controller(AdminController::class)
    ->prefix('admin')
    ->group(function () {
      Route::patch('/approve-members/{id}', 'approveMember');
      Route::patch('/approve-delettion/{id}', 'approveDeletion');
    });
});

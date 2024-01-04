<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PreApprove\UtilizationController;
use App\Http\Controllers\PreApprove\LaboratoryController;

Route::get('/pre-approve/utilization', [UtilizationController::class, 'index']);
Route::post('/pre-approve/utilization', [UtilizationController::class, 'importUtilization']);
Route::get('/pre-approve/get-employees', [UtilizationController::class, 'getEmployee']);

Route::post('/pre-approve/deel/upload', [UtilizationController::class, 'importDeelUpload']);

Route::get('/pre-approve/laboratory/export', [LaboratoryController::class, 'export']);
Route::get('/pre-approve/laboratory', [LaboratoryController::class, 'index']);
Route::post('/pre-approve/laboratory', [LaboratoryController::class, 'store']);
Route::put('/pre-approve/laboratory/{id}', [LaboratoryController::class, 'update']);
Route::delete('/pre-approve/laboratory/{id}', [LaboratoryController::class, 'destroy']);

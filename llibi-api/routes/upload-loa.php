<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadLOA\UploadLOAController;

Route::post('/upload-loa/validate-client', [UploadLOAController::class, 'validateClient']);
Route::get('/upload-loa/get-request/{loaType}/{refno}', [UploadLOAController::class, 'GetRequest']);

Route::post('/upload-loa/update-request', [UploadLOAController::class, 'updateRequest']);

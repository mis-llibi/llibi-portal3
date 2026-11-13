<?php

use App\Http\Controllers\Api_third_party\FundManagementController;
use Illuminate\Support\Facades\Route;

Route::post('/fund-management/send-email', [FundManagementController::class, 'sendEmail']);

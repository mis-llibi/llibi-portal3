<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Feedback\FeedbackController;
use App\Http\Controllers\Feedback\FeedbackCorporateController;

// feedback client portal
Route::post('/feedbacks', [FeedbackController::class, 'store']);
Route::get('/feedbacks/{request_id}', [FeedbackController::class, 'checkingIfAlreadyFeedback']);
Route::get('/feedbacks/is-expired/{request_id}', [FeedbackController::class, 'checkingIfFeedbackLinkIsExpired']);
Route::get('/feedbacks', [FeedbackController::class, 'index']);
// feedback corporate
Route::get('/corporate/feedbacks', [FeedbackCorporateController::class, 'index']);
Route::post('/corporate/feedbacks', [FeedbackCorporateController::class, 'sendLoa']);
Route::post('/corporate/feedbacks/save', [FeedbackCorporateController::class, 'store']);
Route::get('/corporate/feedbacks/employee', [FeedbackCorporateController::class, 'showEmployee']);

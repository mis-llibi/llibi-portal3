<?php

namespace App\Http\Controllers\Api_third_party;

use App\Http\Controllers\Controller;
use App\Services\SendingEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class FundManagementController extends Controller
{
  public function sendEmail(Request $request)
  {
    $validated = $request->validate([
      'email' => ['required', 'email'],
      'cc' => ['nullable', 'string'],
    ]);

    $ccRecipients = [];
    if (isset($validated['cc'])) {
      $ccRecipients = array_map('trim', explode(',', $validated['cc']));
      $ccValidator = Validator::make(
        ['cc' => $ccRecipients],
        ['cc.*' => ['required', 'email']]
      );

      if ($ccValidator->fails()) {
        throw ValidationException::withMessages([
          'cc' => ['Each CC entry must be a valid email address.'],
        ]);
      }
    }

    $body = view('fund-management.sample-email');
    $sending = new SendingEmail(
      $validated['email'],
      $body,
      'LLIBI FUND MANAGEMENT - SAMPLE EMAIL',
      cc: $ccRecipients
    );

    ob_start();
    $sent = $sending->sendLlibiBenAd();
    ob_end_clean();

    if (!$sent) {
      return response()->json(['message' => 'Unable to send email.'], 502);
    }

    return response()->noContent();
  }
}

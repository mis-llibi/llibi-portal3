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
      'email'          => ['required', 'email'],
      'cc'             => ['nullable', 'string'],
      'name'           => ['required', 'string'],
      'user'           => ['required', 'string'],
      'adjustment'     => ['required', 'string'],
      'transmittal_doc'=> ['required', 'string'],
      'code'           => ['required', 'string'],
      'tracking'       => ['required', 'string'],
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

    $body = view('fund-management.sample-email', [
      'name'            => $validated['name'],
      'user'            => $validated['user'],
      'adjustment'      => $validated['adjustment'],
      'transmittal_doc' => $validated['transmittal_doc'],
      'code'            => $validated['code'],
      'tracking'        => $validated['tracking'],
    ]);
    $sending = new SendingEmail(
      $validated['email'],
      $body,
      'Transmittal Adjustment(s) Mailer',
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

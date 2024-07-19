<?php

namespace App\Http\Controllers\Members;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Members\PendingDocument;

class PendingDocumentController extends Controller
{
  public function pendingDocuments($member_id)
  {
    $documents = PendingDocument::query()->where('link_id', $member_id)->get();

    return response()->json($documents);
  }

  public function uploadPendingDocuments(Request $request)
  {

    return response()->json($request->all());
  }
}

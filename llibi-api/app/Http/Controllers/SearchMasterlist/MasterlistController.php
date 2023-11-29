<?php

namespace App\Http\Controllers\SearchMasterlist;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Self_service\Sync;

class MasterlistController extends Controller
{
  public function index()
  {
    $search = request()->query('search');

    $clients = Sync::query()
      ->where('member_id', 'LIKE', "%{$search}%")
      ->select('*')
      ->take(50)
      ->get();

    return $clients;
  }
}

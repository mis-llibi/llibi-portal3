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
      ->where(function ($q) use ($search) {
        $q->where('member_id', 'LIKE', "%{$search}%");
        $q->orWhere('first_name', 'LIKE', "%{$search}%");
        $q->orWhere('last_name', 'LIKE', "%{$search}%");
        $q->orWhere('birth_date', 'LIKE', "%{$search}%");
      })
      ->select('*')
      ->take(50)
      ->get();

    return $clients;
  }
}

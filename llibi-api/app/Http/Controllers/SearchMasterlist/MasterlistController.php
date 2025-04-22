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
        $q->where('member_id', 'LIKE', "%" . strtoupper($search) . "%");
        $q->orWhere('first_name', 'LIKE', "%" . strtoupper($search) . "%");
        $q->orWhere('last_name', 'LIKE', "%" . strtoupper($search) . "%");
        $q->orWhere('birth_date', 'LIKE', "%" . strtoupper($search) . "%");
      })
      ->select('*')
      ->take(50)
      ->get();

    return $clients;
  }
  public function SearchBirthdateByName(Request $request){

    $lastName = strtoupper($request->input('last_name'));
    $firstName = strtoupper($request->input('first_name'));
    $offset = $request->input('offset', 0);
    $limit = $request->input('limit', 50);
    $clients = Sync::query()
      // ->whereNotNull('last_name')
      ->where(function ($q) use ($firstName, $lastName) {
          // If both names are provided, match in both orders
          if ($firstName && $lastName) {
              $q->where(function ($subQ) use ($firstName, $lastName) {
                  $subQ->whereRaw('UPPER(first_name) LIKE ?', ["%$firstName%"])
                      ->whereRaw('UPPER(last_name) LIKE ?', ["%$lastName%"]);
              })->orWhere(function ($subQ) use ($firstName, $lastName) {
                  $subQ->whereRaw('UPPER(first_name) LIKE ?', ["%$lastName%"])
                      ->whereRaw('UPPER(last_name) LIKE ?', ["%$firstName%"]);
              });
          }
          // If only one is provided, search either field
          elseif ($firstName || $lastName) {
              $term = strtoupper($firstName ?: $lastName);
              $q->whereRaw('UPPER(first_name) LIKE ?', ["%$term%"])
                ->orWhereRaw('UPPER(last_name) LIKE ?', ["%$term%"]);
          }
      })
      ->select('member_id', 'first_name', 'last_name','company_name','birth_date')
      ->offset($offset)
      ->limit($limit)
      ->get();


    return response()->json($clients);
  }
}

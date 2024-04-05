<?php

namespace App\Http\Controllers\Api_third_party;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Corporate\CompaniesSync;

class BenadEncryptor extends Controller
{
    public function GetCompanies()
    {
        $request = CompaniesSync::get(['id','ebd_compcode','name', 'benad_password']);

        return (count($request) > 0 ? $request : '');
    }

    public function UpdateCompanyPassword(Request $request)
    {
        $update = [
            'benad_password' => $request->password,
        ];

        $update = CompaniesSync::where('id', $request->id)
            ->update($update);
    }
}

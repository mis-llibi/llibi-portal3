<?php

namespace App\Http\Controllers\Api_third_party;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Models\Self_service\Sync;

class MobileApiAccessController extends Controller
{
    public function GetMemberData(Request $request)
    {
        $memberId = $request->query('member_id');
        $birthdate = $request->query('birth_date');

        if ($memberId && $birthdate) {
            $memberData = Sync::where('member_id', $memberId)
                                ->where('birth_date', $birthdate)
                                ->get(['member_id', 'first_name', 'last_name', 'middle_name', 'relation', 'birth_date', 'incepfrom', 'incepto', 'company_code', 'company_name'])
                                ->first();
        } else {
            $memberData = Sync::selectRaw('member_id , first_name, last_name, middle_name, relation, birth_date, incepfrom, incepto, company_code, company_name')
                ->paginate();   

            /* $sortedResult = $memberData->getCollection()->sortBy('key_name')->values();
            $memberData->setCollection($sortedResult); */
        }

        return response()->json($memberData);
    }
}
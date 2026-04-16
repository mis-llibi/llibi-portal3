<?php

namespace App\Http\Controllers\Company_policies;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Company_policies\Company_policies;
use App\Models\Self_service\SyncCompaniesV2;
use Illuminate\Support\Facades\Storage;

class PoliciesController extends Controller
{
    //Get all companies
    public function getAllCompanies()
    {
        $companies = SyncCompaniesV2::select('name')->get();
        return response()->json($companies);
    }
    //Get only searched company
    public function searchCompanies(Request $request)
    {
        $query = SyncCompaniesV2::select('name');
        
        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $companies = $query->get();
        return response()->json($companies);
    }

    //
    public function getPolicies()
    {
        $policies = Company_policies::all();
        return response()->json($policies);
    }

    public function getPolicy($company_name)
    {
        $company = SyncCompaniesV2::where('name', $company_name)->first();
        
        if ($company) {
            $policy = SyncCompaniesV2::where('id', $company->id)->first();
            
            if ($policy && $policy->policypath) {
                // Expires in 5 minutes
                $url = Storage::disk('llibiapp')->temporaryUrl('Claims-Policy/'. $policy->policyname, now()->addMinutes(5));
                return response()->json(['policypath' => $url]);
            }
        }

        return response()->json(['policypath' => null], 404);
    }

    //upload policies use llibiapp
    public function uploadPolicies(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:2048',
        ]);
        $company_id = $request->company_id;

        // Insert data in company_policies
        


        $file = $request->file('file');
        $path = $file->store('Policies', 'llibiapp');
        $url = config('filesystems.disks.llibiapp.cdn_endpoint')."/".$path;
        return response()->json(['url' => $url]);
    }

}

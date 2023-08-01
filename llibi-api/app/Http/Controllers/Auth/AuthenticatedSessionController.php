<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     *
     * @param  \App\Http\Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LoginRequest $request)
    {   
        $request->authenticate();

        $request->session()->regenerate();

        if($request->verified > '')
            User::where('email', $request->email)
            ->update([
                'email_verified_at' => date('Y-m-d H:i:s'),
            ]);
            
        return response()->noContent();
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'firstName' => ['required', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
        ]);

        $user = [
            'first_name' => strtoupper($request->firstName),
            'last_name' => strtoupper($request->lastName),
        ];

        if(!empty($request->email)) {
            $request->validate(['email' => ['required', 'string', 'email', 'max:255', 'unique:users']]);
            $user['email'] = $request->email;
        }

        if(!empty($request->password)) {
            $request->validate(['password' => ['required', 'confirmed', Rules\Password::defaults()]]);
            $user['password'] = Hash::make($request->password);
        }

        User::where('id', $request->id)
            ->update($user);
    }

    /**
     * Destroy an authenticated session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }

    
}

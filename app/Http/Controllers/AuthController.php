<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create($data); // password is hashed by the model cast

        return response()->json([
            'user'  => $user,
            'token' => $user->createToken('web', ['web'])->accessToken,
        ], 201);
    }

    // React (web)
    public function login(Request $request)
    {
        $user = $this->checkCredentials($request);

        if (! $user) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        return [
            'user'  => $user,
            'token' => $user->createToken('web', ['web'])->accessToken,
        ];
    }

    // Flutter (only if the user has a mobile-key)
    public function mobileLogin(Request $request)
    {
        $user = $this->checkCredentials($request);

        if (! $user) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        $hasKey = $user->tokens()
            ->where('name', 'mobile-key')
            ->where('revoked', false)
            ->where('expires_at', '>', now())
            ->exists();

        if (! $hasKey) {
            return response()->json(['message' => 'Mobile login is not enabled for this account'], 403);
        }

        return [
            'user'  => $user,
            'token' => $user->createToken('mobile', ['mobile'])->accessToken,
        ];
    }

    public function user(Request $request)
    {
        return $request->user();
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return ['message' => 'Logged out'];
    }

    private function checkCredentials(Request $request): ?User
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        return ($user && Hash::check($request->password, $user->password)) ? $user : null;
    }
}
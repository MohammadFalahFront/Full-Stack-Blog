<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function allUsers()
    {
        return User::all();
    }
    public function register(Request $request)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|string|email|max:255",
            "password" => "required|string|max:255|min:8",
        ]);

        $user = User::create([
            "name"  => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password)
        ]);

        return response()->json([
            "message" => "Registration Success",
            "user" => $user
        ], 201);
    }
    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|string|email|max:255",
            "password" => "required|string|max:255|min:8",
        ]);

        if (!Auth::attempt($request->only(["email", "password"])))
            return response()->json(["message" => "Unauthorized"], 401);

        $user = User::where("email", $request->email)->firstOrFail();
        $token = $user->createToken("auth_token")->plainTextToken;

        return response()->json([
            "massage" => "Login Success",
            "user" => $user,
            "token" => $token
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            "message" => "Logout Success"
        ], 200);
    }

    public function toggleAdmin($id)
    {
        $user = User::findOrFail($id);

        $isAdmin = $user->role == 'admin';
        if ($isAdmin) {
            $user->role = 'user';
        } else {
            $user->role = 'admin';
        }

        $user->save();
        return response()->json([
            "message" => "Admin status updated",
            "user" => $user
        ], 200);
    }
}

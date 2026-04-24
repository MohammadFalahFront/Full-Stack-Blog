<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use GuzzleHttp\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::get('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');

Route::patch('user/{id}/toggle-admin', [UserController::class, 'toggleAdmin'])->middleware(['auth:sanctum', 'isAdmin']);
Route::get('allUsers', [UserController::class, 'allUsers'])->middleware(['auth:sanctum', 'isAdmin']);

Route::group(['middleware' => 'auth:sanctum'], function () {

    // posts
    Route::apiResource('posts', PostController::class);
    Route::post('posts/{id}', [PostController::class, 'update']);
    Route::get('allPosts', [PostController::class, 'getAllPosts']);

    // like post
    Route::post('posts/{id}/toggle-like', [PostController::class, 'toggleLike']);

    // comments
    Route::post('posts/{id}/comments', [PostController::class, 'storeComment']);
});

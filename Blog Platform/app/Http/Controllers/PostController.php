<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        $userPosts = Auth::user()->posts()->withCount('likes')->get();

        return response()->json([
            "data" => $userPosts
        ], 200);
    }

    public function store(Request $request)
    {
        $userId = Auth::user()->id;
        $validatedDate =  $request->validate([
            "title" => "required|string|max:255",
            "content" => "required|string|nullable",
            "image" => "nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048",
        ]);
        $validatedDate['user_id'] = $userId;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('users images', 'public');
            $validatedDate['image'] = $path;
        };
        $post = Post::create($validatedDate);

        return response()->json([
            "data" => $post
        ], 201);
    }

    public function show(string $id)
    {
        try {
            $user_id = Auth::user()->id;
            $post = Post::withCount('likes')->with('comments.user')->findOrFail($id);
            if ($user_id == $post->user_id) {
                return response()->json([
                    "data" => $post
                ], 200);
            } else {
                return response()->json([
                    "message" => "Not Found post with id " . $id
                ], 401);
            }
        } catch (Exception $e) {
            return response()->json([
                "message" => "Not Found post with id " . $id,
                "error" => $e
            ], 400);
        }
    }

    public function update(Request $request, string $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('posts', 'public');
        }

        $post->update($validated);

        return response()->json([
            'message' => 'Post updated successfully',
            'data' => $post
        ], 200);
    }

    public function destroy(string $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }
        $post->delete();
        return response()->json([
            'message' => 'Post deleted successfully'
        ], 200);
    }

    public function toggleLike(string $id)
    {
        $postId = Post::findOrFail($id)->id;
        $userId = Auth::user()->id;

        $like = Like::where('user_id', $userId)->where('post_id', $postId)->first();

        if ($like) {
            $like->delete();
            return response()->json([
                "message" => "Unlike Post successfully"
            ], 200);
        } else {
            Like::create([
                'user_id' => $userId,
                'post_id' => $postId
            ]);
            return response()->json([
                "message" => "Like Post successfully"
            ], 201);
        }
    }

    public function storeComment(Request $request, string $id)
    {
        $request->validate([
            "content" => "required|string|max:255",
        ]);
        Comment::create([
            "content" => $request->content,
            "post_id" => $id,
            "user_id" => Auth::id()
        ]);

        return response()->json([
            "message" => "Comment created successfully",
        ], 201);
    }

    public function getAllPosts()
    {
        $posts = Post::orderBy("created_at", "desc")->withCount(["likes", "comments"])->get();
        return response()->json([
            "data" => $posts
        ], 200);
    }
}

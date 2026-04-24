import { defineStore } from 'pinia';
import { ref } from 'vue';
import { postService } from '@/api/post.service';
import type { Post } from '@/types';

export const usePostStore = defineStore('posts', () => {
  const allPosts = ref<Post[]>([]);
  const userPosts = ref<Post[]>([]);
  const currentPost = ref<Post | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** Fetch all posts for the public feed */
  async function fetchAllPosts() {
    loading.value = true;
    error.value = null;
    try {
      allPosts.value = await postService.getAllPosts();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch posts';
    } finally {
      loading.value = false;
    }
  }

  /** Fetch only the current user's posts (for dashboard) */
  async function fetchUserPosts() {
    loading.value = true;
    error.value = null;
    try {
      userPosts.value = await postService.getUserPosts();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch your posts';
    } finally {
      loading.value = false;
    }
  }

  /** Fetch a single post by ID */
  async function fetchPost(id: number | string) {
    loading.value = true;
    error.value = null;
    currentPost.value = null;
    try {
      currentPost.value = await postService.getPost(id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load post';
    } finally {
      loading.value = false;
    }
  }

  /** Create a new post */
  async function createPost(payload: { title: string; content?: string; image?: File }) {
    loading.value = true;
    error.value = null;
    try {
      const post = await postService.createPost(payload);
      userPosts.value.unshift(post);
      return post;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create post';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /** Update an existing post */
  async function updatePost(id: number | string, payload: { title?: string; content?: string; image?: File }) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await postService.updatePost(id, payload);
      const idx = userPosts.value.findIndex(p => p.id === Number(id));
      if (idx !== -1) userPosts.value[idx] = updated;
      return updated;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update post';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /** Delete a post */
  async function deletePost(id: number | string) {
    loading.value = true;
    error.value = null;
    try {
      await postService.deletePost(id);
      userPosts.value = userPosts.value.filter(p => p.id !== Number(id));
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete post';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /** Toggle like on a post */
  async function toggleLike(id: number | string) {
    try {
      await postService.toggleLike(id);
      // Refresh the post to get updated count
      const idx = allPosts.value.findIndex(p => p.id === Number(id));
      if (idx !== -1) {
        const count = allPosts.value[idx].likes_count ?? 0;
        // Optimistic toggle — the API doesn't tell us the new state, so we toggle
        allPosts.value[idx].likes_count = count > 0 ? count - 1 : count + 1;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to toggle like';
    }
  }

  /** Add a comment to a post */
  async function addComment(postId: number | string, content: string) {
    try {
      await postService.addComment(postId, content);
      // Refresh the current post to get the new comments
      if (currentPost.value && currentPost.value.id === Number(postId)) {
        await fetchPost(postId);
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add comment';
      throw err;
    }
  }

  return {
    allPosts, userPosts, currentPost, loading, error,
    fetchAllPosts, fetchUserPosts, fetchPost,
    createPost, updatePost, deletePost, toggleLike, addComment,
  };
});

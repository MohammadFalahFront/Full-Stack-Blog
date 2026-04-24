import api from './axios';
import type { Post, ApiResponse, MessageResponse } from '@/types';

export const postService = {
  /** Get ALL posts (public feed) — ordered by created_at desc, with likes_count & comments_count */
  async getAllPosts(): Promise<Post[]> {
    const { data } = await api.get<ApiResponse<Post[]>>('/allPosts');
    return data.data;
  },

  /** Get current authenticated user's posts only */
  async getUserPosts(): Promise<Post[]> {
    const { data } = await api.get<ApiResponse<Post[]>>('/posts');
    return data.data;
  },

  /** Get a single post by ID — includes comments.user */
  async getPost(id: number | string): Promise<Post> {
    const { data } = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    return data.data;
  },

  /** Create a new post — uses FormData for image upload */
  async createPost(payload: { title: string; content?: string; image?: File }): Promise<Post> {
    const formData = new FormData();
    formData.append('title', payload.title);
    if (payload.content) formData.append('content', payload.content);
    if (payload.image) formData.append('image', payload.image);

    const { data } = await api.post<ApiResponse<Post>>('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  /** Update a post — backend uses POST /posts/{id} (not PUT) for FormData support */
  async updatePost(id: number | string, payload: { title?: string; content?: string; image?: File }): Promise<Post> {
    const formData = new FormData();
    if (payload.title) formData.append('title', payload.title);
    if (payload.content) formData.append('content', payload.content);
    if (payload.image) formData.append('image', payload.image);

    const { data } = await api.post<ApiResponse<Post>>(`/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  /** Delete a post by ID */
  async deletePost(id: number | string): Promise<MessageResponse> {
    const { data } = await api.delete<MessageResponse>(`/posts/${id}`);
    return data;
  },

  /** Toggle like on a post */
  async toggleLike(id: number | string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>(`/posts/${id}/toggle-like`);
    return data;
  },

  /** Add a comment to a post */
  async addComment(postId: number | string, content: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>(`/posts/${postId}/comments`, { content });
    return data;
  },
};

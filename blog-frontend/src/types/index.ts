// Types derived from the Laravel backend models and API responses

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string | null;
  image: string | null;
  user_id: number;
  user?: User;
  likes_count?: number;
  comments_count?: number;
  comments?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface LoginResponse {
  massage: string; // Note: backend typo "massage" instead of "message"
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface MessageResponse {
  message: string;
}

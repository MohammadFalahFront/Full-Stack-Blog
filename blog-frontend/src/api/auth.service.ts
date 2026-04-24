import api from './axios';
import type { LoginPayload, RegisterPayload, LoginResponse, RegisterResponse, MessageResponse, User } from '@/types';

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/login', payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>('/register', payload);
    return data;
  },

  async logout(): Promise<MessageResponse> {
    const { data } = await api.get<MessageResponse>('/logout');
    return data;
  },

  async getUser(): Promise<User> {
    const { data } = await api.get<User>('/user');
    return data;
  },
};

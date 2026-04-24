import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/api/auth.service';
import type { User, LoginPayload, RegisterPayload } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  // Restore user from localStorage on init
  const storedUser = localStorage.getItem('auth_user');
  if (storedUser) {
    try { user.value = JSON.parse(storedUser); } catch { /* ignore */ }
  }

  async function login(payload: LoginPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await authService.login(payload);
      token.value = res.token;
      user.value = res.user;
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await authService.register(payload);
      // Auto-login after register
      user.value = res.user;
      // Backend register doesn't return a token — need to login
      const loginRes = await authService.login({ email: payload.email, password: payload.password });
      token.value = loginRes.token;
      user.value = loginRes.user;
      localStorage.setItem('auth_token', loginRes.token);
      localStorage.setItem('auth_user', JSON.stringify(loginRes.user));
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } catch { /* ignore if already expired */ }
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      user.value = await authService.getUser();
      localStorage.setItem('auth_user', JSON.stringify(user.value));
    } catch {
      // Token invalid
      await logout();
    }
  }

  return { user, token, loading, error, isAuthenticated, isAdmin, login, register, logout, fetchUser };
});

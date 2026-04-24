import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/pages/BlogListing.vue'),
  },
  {
    path: '/blog/:id',
    name: 'BlogDetails',
    component: () => import('@/pages/BlogDetails.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/Login.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/auth/Register.vue'),
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Navigation guard
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('auth_token');

  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' });
  } else if (to.meta.guest && token) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;

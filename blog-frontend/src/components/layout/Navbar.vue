<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDark, useToggle } from '@vueuse/core';
import { useAuthStore } from '@/store/auth.store';
import { MenuIcon, XIcon, MoonIcon, SunIcon, LogOutIcon } from 'lucide-vue-next';

const { t, locale } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const isDark = useDark();
const toggleDark = useToggle(isDark);

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const toggleLocale = () => {
  locale.value = locale.value === 'en' ? 'ar' : 'en';
};

const handleLogout = async () => {
  await authStore.logout();
  isMobileMenuOpen.value = false;
  router.push('/login');
};
</script>

<template>
  <header 
    class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
    :class="[isScrolled ? 'glass py-3' : 'bg-transparent py-5']"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
            B
          </div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            Nexus
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <router-link to="/" class="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium transition-colors">
            {{ t('nav.home') }}
          </router-link>
          <router-link to="/blog" class="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium transition-colors">
            {{ t('nav.blog') }}
          </router-link>
          <router-link v-if="authStore.isAuthenticated" to="/dashboard" class="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium transition-colors">
            {{ t('nav.dashboard') }}
          </router-link>
        </nav>

        <!-- Actions -->
        <div class="hidden md:flex items-center gap-3">
          <!-- Language Toggle -->
          <button @click="toggleLocale" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 font-medium text-sm">
            {{ locale === 'en' ? 'ع' : 'EN' }}
          </button>
          
          <!-- Theme Toggle -->
          <button @click="toggleDark()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
            <SunIcon v-if="isDark" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>
          
          <!-- Auth Buttons -->
          <template v-if="authStore.isAuthenticated">
            <span class="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {{ authStore.user?.name }}
            </span>
            <button @click="handleLogout" class="px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors">
              <LogOutIcon class="w-4 h-4" />
              {{ t('nav.logout') }}
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="px-5 py-2.5 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transition-all transform hover:-translate-y-0.5">
              {{ t('nav.login') }}
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 text-gray-600 dark:text-gray-300">
          <MenuIcon v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <XIcon v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden absolute top-full left-0 right-0 glass-card mx-4 mt-2 p-4 flex flex-col gap-3">
        <router-link @click="isMobileMenuOpen = false" to="/" class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
          {{ t('nav.home') }}
        </router-link>
        <router-link @click="isMobileMenuOpen = false" to="/blog" class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
          {{ t('nav.blog') }}
        </router-link>
        <router-link v-if="authStore.isAuthenticated" @click="isMobileMenuOpen = false" to="/dashboard" class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
          {{ t('nav.dashboard') }}
        </router-link>
        
        <div class="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
        
        <div class="flex items-center justify-between px-4">
          <button @click="toggleLocale" class="flex-1 py-2 text-center text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm">
            {{ locale === 'en' ? 'العربية' : 'English' }}
          </button>
          <button @click="toggleDark()" class="flex-1 py-2 flex justify-center items-center gap-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm">
            <template v-if="isDark">
              <SunIcon class="w-4 h-4" />
              <span>Light</span>
            </template>
            <template v-else>
              <MoonIcon class="w-4 h-4" />
              <span>Dark</span>
            </template>
          </button>
        </div>
        
        <template v-if="authStore.isAuthenticated">
          <button @click="handleLogout" class="w-full text-center py-3 mt-2 rounded-lg font-medium text-red-600 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
            {{ t('nav.logout') }}
          </button>
        </template>
        <template v-else>
          <router-link @click="isMobileMenuOpen = false" to="/login" class="w-full text-center py-3 mt-2 rounded-lg font-medium bg-primary-600 text-white">
            {{ t('nav.login') }}
          </router-link>
        </template>
      </div>
    </transition>
  </header>
</template>

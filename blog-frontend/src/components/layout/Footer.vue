<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 transition-colors duration-300">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="col-span-1 md:col-span-2">
          <router-link to="/" class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
              B
            </div>
            <span class="text-xl font-bold dark:text-white">Nexus</span>
          </router-link>
          <p class="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            A modern blog platform built with Vue 3, Tailwind CSS, and Framer Motion. 
            Delivering high-performance reading experiences.
          </p>
        </div>
        
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
          <ul class="space-y-3">
            <li><router-link to="/" class="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">{{ t('nav.home') }}</router-link></li>
            <li><router-link to="/blog" class="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">{{ t('nav.blog') }}</router-link></li>
            <li><router-link to="/dashboard" class="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">{{ t('nav.dashboard') }}</router-link></li>
          </ul>
        </div>
        
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
          <ul class="space-y-3">
            <li><a href="#" class="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Privacy Policy</a></li>
            <li><a href="#" class="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {{ currentYear }} Blog Nexus. All rights reserved.</p>
        <p class="mt-2 md:mt-0 text-sm">Crafted with Vue 3 & TypeScript</p>
      </div>
    </div>
  </footer>
</template>

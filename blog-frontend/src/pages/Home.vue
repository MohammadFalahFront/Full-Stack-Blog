<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { usePostStore } from '@/store/post.store';
import { useAuthStore } from '@/store/auth.store';
import BlogCard from '@/components/blog/BlogCard.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import { ArrowRightIcon, SparklesIcon } from 'lucide-vue-next';

const { t } = useI18n();
const postStore = usePostStore();
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.isAuthenticated) {
    postStore.fetchAllPosts();
  }
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative isolate overflow-hidden py-20 sm:py-32 mb-16">
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true">
        <div
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
        </div>
      </div>

      <div class="container mx-auto px-4 text-center" v-motion :initial="{ opacity: 0, y: 40 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, type: 'spring', stiffness: 100 } }">
        <div
          class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
          <SparklesIcon class="w-4 h-4" />
          {{ t('home.badge') }}
        </div>
        <h1
          class="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400 leading-tight mb-6">
          {{ t('home.hero_title') }}
        </h1>
        <p class="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400">
          {{ t('home.hero_subtitle') }}
        </p>
        <div class="flex gap-4 justify-center mt-10">
          <router-link to="/blog"
            class="px-8 py-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 flex items-center gap-2">
            {{ t('home.explore_btn') }}
            <ArrowRightIcon class="w-5 h-5" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Latest Posts -->
    <section class="container mx-auto px-4 pb-20">
      <div class="flex items-center justify-between mb-10">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('home.latest_posts') }}</h2>
        <router-link to="/blog"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium flex items-center gap-1 text-sm">
          {{ t('home.view_all') }}
          <ArrowRightIcon class="w-4 h-4" />
        </router-link>
      </div>

      <!-- Loading Skeletons -->
      <div v-if="postStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="glass-card overflow-hidden">
          <Skeleton class="h-56 rounded-none" />
          <div class="p-6 space-y-3">
            <Skeleton class="h-4 w-2/3" />
            <Skeleton class="h-6 w-full" />
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-1/2" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="postStore.error" class="text-center py-16">
        <p class="text-red-500 dark:text-red-400 text-lg font-medium">{{ postStore.error }}</p>
        <button @click="postStore.fetchAllPosts()" class="mt-4 text-primary-600 hover:text-primary-700 font-medium">
          {{ t('common.retry') }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="postStore.allPosts.length === 0 && !postStore.loading"
        class="text-center py-16 text-gray-500 dark:text-gray-400">
        <p class="text-xl font-medium">{{ t('home.no_posts') }}</p>
      </div>

      <!-- Real Posts Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="post in postStore.allPosts.slice(0, 6)" :key="post.id">
          <BlogCard :post="post" />
        </div>
      </div>

      <!-- Not authenticated prompt -->
      <div v-if="!authStore.isAuthenticated" class="text-center mt-12 glass-card p-8 max-w-lg mx-auto">
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('home.login_prompt') }}</p>
        <router-link to="/login"
          class="px-6 py-2.5 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors">
          {{ t('nav.login') }}
        </router-link>
      </div>
    </section>
  </div>
</template>

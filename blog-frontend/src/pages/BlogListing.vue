<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePostStore } from '@/store/post.store';
import BlogCard from '@/components/blog/BlogCard.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import { SearchIcon, FilterIcon } from 'lucide-vue-next';

const { t } = useI18n();
const postStore = usePostStore();

const searchQuery = ref('');

onMounted(() => {
  if (postStore.allPosts.length === 0) {
    postStore.fetchAllPosts();
  }
});

const filteredPosts = computed(() => {
  let result = postStore.allPosts;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(p =>
      (p.title?.toLowerCase().includes(q)) ||
      (p.content?.toLowerCase().includes(q))
    );
  }
  return result;
});
</script>

<template>
  <div class="container mx-auto px-4 pb-16">
    <!-- Header -->
    <div class="mb-12 text-center max-w-2xl mx-auto" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">{{ t('nav.blog') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg">{{ t('blog.listing_subtitle') }}</p>
    </div>
    
    <!-- Search -->
    <div class="mb-12 flex justify-center" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 200 } }">
      <div class="relative w-full max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all glass hover:shadow-md text-gray-900 dark:text-white" 
          :placeholder="t('blog.search_placeholder')" 
        >
      </div>
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
      <button @click="postStore.fetchAllPosts()" class="mt-4 text-primary-600 hover:text-primary-700 font-medium">{{ t('common.retry') }}</button>
    </div>

    <!-- Grid -->
    <TransitionGroup 
      v-else
      name="list" 
      tag="div" 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div 
        v-for="post in filteredPosts" 
        :key="post.id"
      >
        <BlogCard :post="post" />
      </div>
    </TransitionGroup>
    
    <!-- Empty State -->
    <div v-if="!postStore.loading && !postStore.error && filteredPosts.length === 0" class="py-20 text-center text-gray-500 dark:text-gray-400">
      <div class="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
        <FilterIcon class="w-8 h-8 opacity-50" />
      </div>
      <p class="text-xl font-medium mb-2">{{ t('blog.no_posts') }}</p>
      <p>{{ t('blog.adjust_search') }}</p>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
</style>

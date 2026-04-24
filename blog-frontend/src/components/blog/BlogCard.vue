<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { HeartIcon, MessageCircleIcon, ArrowRightIcon } from 'lucide-vue-next';
import type { Post } from '@/types';

const props = defineProps<{
  post: Post;
}>();

const { locale, t } = useI18n();
const router = useRouter();

const cardType = computed(() => {
  const hasImage = !!props.post.image;
  const hasText = !!props.post.content || !!props.post.title;
  
  if (hasImage && hasText) return 'mixed';
  if (hasImage && !hasText) return 'image-only';
  return 'text-only';
});

const imageUrl = computed(() => {
  if (!props.post.image) return '';
  // If the image path is a full URL, use it directly; otherwise prepend storage URL
  if (props.post.image.startsWith('http')) return props.post.image;
  return `http://localhost:8000/storage/${props.post.image}`;
});

const formattedDate = computed(() => {
  return new Date(props.post.created_at).toLocaleDateString(locale.value === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
});

const authorName = computed(() => props.post.user?.name ?? t('common.unknown'));
</script>

<template>
  <!-- Image + Text Type -->
  <article 
    v-if="cardType === 'mixed'"
    class="group flex flex-col glass-card overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
    @click="router.push(`/blog/${post.id}`)"
  >
    <div class="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img :src="imageUrl" :alt="post.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
    </div>
    
    <div class="p-6 flex flex-col grow">
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span class="font-medium text-gray-900 dark:text-gray-200">{{ authorName }}</span>
        <span>&bull;</span>
        <span>{{ formattedDate }}</span>
      </div>
      
      <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
        {{ post.title }}
      </h3>
      
      <p v-if="post.content" class="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 grow">
        {{ post.content }}
      </p>
      
      <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
          <div class="flex items-center gap-1.5 group/like hover:text-red-500 transition-colors">
            <HeartIcon class="w-4 h-4 group-hover/like:fill-red-500 transition-all" />
            <span>{{ post.likes_count ?? 0 }}</span>
          </div>
          <div class="flex items-center gap-1.5 hover:text-primary-500 transition-colors">
            <MessageCircleIcon class="w-4 h-4" />
            <span>{{ post.comments_count ?? 0 }}</span>
          </div>
        </div>
        <ArrowRightIcon class="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" :class="{'rotate-180': locale === 'ar'}" />
      </div>
    </div>
  </article>

  <!-- Title & Text Only Type -->
  <article 
    v-else-if="cardType === 'text-only'"
    class="group flex flex-col glass-card p-6 md:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full border-l-4 border-l-primary-500"
    @click="router.push(`/blog/${post.id}`)"
  >
    <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
      {{ post.title }}
    </h3>
    
    <p v-if="post.content" class="text-lg text-gray-600 dark:text-gray-300 mb-8 grow leading-relaxed font-serif">
      {{ post.content }}
    </p>
    
    <div class="flex items-center justify-between mt-auto">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          {{ authorName.charAt(0) }}
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ authorName }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ formattedDate }}</p>
        </div>
      </div>
      
      <div class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm font-medium">
        <HeartIcon class="w-4 h-4" />
        <span>{{ post.likes_count ?? 0 }}</span>
      </div>
    </div>
  </article>

  <!-- Image Only Type -->
  <article 
    v-else-if="cardType === 'image-only'"
    class="group relative h-80 glass-card overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl"
    @click="router.push(`/blog/${post.id}`)"
  >
    <img :src="imageUrl" alt="Visual post" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
    <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
    
    <div class="absolute inset-0 p-6 flex flex-col justify-between z-10">
      <div class="flex justify-end items-start">
        <div class="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-medium border border-white/10">
          <HeartIcon class="w-3.5 h-3.5 fill-white" />
          <span>{{ post.likes_count ?? 0 }}</span>
        </div>
      </div>
      
      <div class="flex items-center gap-3 mt-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div class="text-white">
          <p class="text-sm font-bold">{{ authorName }}</p>
          <p class="text-xs text-white/80">{{ formattedDate }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

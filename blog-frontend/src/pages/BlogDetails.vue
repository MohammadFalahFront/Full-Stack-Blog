<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { usePostStore } from '@/store/post.store';
import Skeleton from '@/components/ui/Skeleton.vue';
import Button from '@/components/ui/Button.vue';
import { HeartIcon, LinkIcon, SendIcon, MessageCircleIcon } from 'lucide-vue-next';

const route = useRoute();
const { t, locale } = useI18n();
const postStore = usePostStore();

const scrollProgress = ref(0);
const commentText = ref('');
const commentLoading = ref(false);
const likeLoading = ref(false);
const showCopied = ref(false);

onMounted(() => {
  postStore.fetchPost(route.params.id as string);
  window.addEventListener('scroll', updateScroll);
});

const updateScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (scrollHeight > 0) {
    scrollProgress.value = (scrollTop / scrollHeight) * 100;
  }
};

const imageUrl = computed(() => {
  if (!postStore.currentPost?.image) return '';
  const img = postStore.currentPost.image;
  return img.startsWith('http') ? img : `http://localhost:8000/storage/${img}`;
});

const formattedDate = computed(() => {
  if (!postStore.currentPost) return '';
  return new Date(postStore.currentPost.created_at).toLocaleDateString(locale.value === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
});

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  showCopied.value = true;
  setTimeout(() => showCopied.value = false, 2000);
};

const handleLike = async () => {
  likeLoading.value = true;
  await postStore.toggleLike(route.params.id as string);
  // Refresh the post to get updated count
  await postStore.fetchPost(route.params.id as string);
  likeLoading.value = false;
};

const handleComment = async () => {
  if (!commentText.value.trim()) return;
  commentLoading.value = true;
  try {
    await postStore.addComment(route.params.id as string, commentText.value);
    commentText.value = '';
  } catch { /* handled in store */ }
  commentLoading.value = false;
};
</script>

<template>
  <div>
    <!-- Reading Progress Bar -->
    <div class="fixed top-0 left-0 w-full h-1.5 bg-gray-200 dark:bg-gray-800 z-60">
      <div 
        class="h-full bg-gradient-to-r from-primary-500 to-purple-600 transition-all duration-75 ease-out"
        :style="{ width: `${scrollProgress}%` }"
      ></div>
    </div>

    <!-- Loading State -->
    <div v-if="postStore.loading && !postStore.currentPost" class="container mx-auto px-4 max-w-4xl mt-8">
      <Skeleton class="h-8 w-1/4 mb-4" />
      <Skeleton class="h-14 w-full mb-4" />
      <Skeleton class="h-6 w-1/2 mb-8" />
      <Skeleton class="h-[400px] w-full rounded-2xl mb-8" />
      <div class="space-y-4">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-3/4" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="postStore.error" class="container mx-auto px-4 max-w-4xl mt-16 text-center">
      <p class="text-red-500 text-xl font-medium mb-4">{{ postStore.error }}</p>
      <button @click="postStore.fetchPost(route.params.id as string)" class="text-primary-600 hover:text-primary-700 font-medium">{{ t('common.retry') }}</button>
    </div>

    <!-- Real Post Content -->
    <template v-else-if="postStore.currentPost">
      <!-- Post Header -->
      <header class="container mx-auto px-4 max-w-4xl mt-8 mb-12">
        <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ formattedDate }}</span>
          </div>
          
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8">
            {{ postStore.currentPost.title }}
          </h1>
          
          <div class="flex items-center justify-between border-y border-gray-100 dark:border-gray-800 py-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {{ postStore.currentPost.user?.name?.charAt(0) ?? '?' }}
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">{{ postStore.currentPost.user?.name ?? t('common.unknown') }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formattedDate }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <button 
                @click="handleLike" 
                :disabled="likeLoading"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors"
              >
                <HeartIcon class="w-5 h-5" />
              </button>
              <span class="text-sm text-gray-500 font-medium">{{ postStore.currentPost.likes_count ?? 0 }}</span>
              <button @click="copyLink" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-primary-50 dark:bg-gray-800 dark:hover:bg-primary-900/20 text-gray-500 hover:text-primary-600 transition-colors">
                <LinkIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Cover Image -->
      <div 
        v-if="imageUrl" 
        class="container mx-auto px-4 max-w-5xl mb-16 h-[50vh] min-h-[300px] max-h-[600px] rounded-2xl overflow-hidden shadow-2xl" 
        v-motion :initial="{ opacity: 0, scale: 0.95 }" :enter="{ opacity: 1, scale: 1, transition: { duration: 600, delay: 200 } }"
      >
        <img :src="imageUrl" :alt="postStore.currentPost.title" class="w-full h-full object-cover" />
      </div>

      <!-- Article Content -->
      <div class="container mx-auto px-4 max-w-4xl mb-16">
        <article class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400 whitespace-pre-wrap">
          {{ postStore.currentPost.content }}
        </article>
      </div>

      <!-- Comments Section -->
      <div class="container mx-auto px-4 max-w-4xl mb-20">
        <div class="glass-card p-6 md:p-8">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <MessageCircleIcon class="w-5 h-5" />
            {{ t('blog.comments') }} ({{ postStore.currentPost.comments?.length ?? 0 }})
          </h3>

          <!-- Add Comment Form -->
          <form @submit.prevent="handleComment" class="flex gap-3 mb-8">
            <input 
              v-model="commentText"
              :placeholder="t('blog.add_comment')"
              class="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              required
            />
            <Button type="submit" :isLoading="commentLoading" class="shrink-0 flex items-center gap-2">
              <SendIcon class="w-4 h-4" />
              {{ t('blog.send') }}
            </Button>
          </form>

          <!-- Comments List -->
          <div v-if="postStore.currentPost.comments && postStore.currentPost.comments.length > 0" class="space-y-6">
            <div 
              v-for="comment in postStore.currentPost.comments" 
              :key="comment.id" 
              class="flex gap-3"
            >
              <div class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm shrink-0">
                {{ comment.user?.name?.charAt(0) ?? '?' }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ comment.user?.name ?? t('common.unknown') }}
                  <span class="text-gray-400 dark:text-gray-500 font-normal ml-2 text-xs">
                    {{ new Date(comment.created_at).toLocaleDateString() }}
                  </span>
                </p>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{ comment.content }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-center text-gray-500 dark:text-gray-400 py-6">{{ t('blog.no_comments') }}</p>
        </div>
      </div>
    </template>

    <!-- Copied Toast -->
    <Transition name="fade">
      <div v-if="showCopied" class="fixed bottom-6 right-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl shadow-lg text-sm font-medium z-50">
        {{ t('blog.link_copied') }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

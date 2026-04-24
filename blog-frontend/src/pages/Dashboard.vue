<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePostStore } from '@/store/post.store';
import { useAuthStore } from '@/store/auth.store';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Modal from '@/components/ui/Modal.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import { 
  PlusIcon, FileTextIcon, EyeIcon, HeartIcon,
  Edit2Icon, Trash2Icon, SearchIcon, ImageIcon
} from 'lucide-vue-next';

const { t } = useI18n();
const postStore = usePostStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const deleteTargetId = ref<number | null>(null);

// Create form
const createForm = ref({ title: '', content: '', image: null as File | null });
const createLoading = ref(false);

// Edit form
const editForm = ref({ id: 0, title: '', content: '', image: null as File | null });
const editLoading = ref(false);

onMounted(() => {
  postStore.fetchUserPosts();
});

const handleCreate = async () => {
  createLoading.value = true;
  try {
    await postStore.createPost({
      title: createForm.value.title,
      content: createForm.value.content || undefined,
      image: createForm.value.image || undefined,
    });
    showCreateModal.value = false;
    createForm.value = { title: '', content: '', image: null };
  } catch { /* handled in store */ }
  createLoading.value = false;
};

const openEdit = (post: any) => {
  editForm.value = { id: post.id, title: post.title, content: post.content || '', image: null };
  showEditModal.value = true;
};

const handleEdit = async () => {
  editLoading.value = true;
  try {
    await postStore.updatePost(editForm.value.id, {
      title: editForm.value.title,
      content: editForm.value.content || undefined,
      image: editForm.value.image || undefined,
    });
    showEditModal.value = false;
  } catch { /* handled in store */ }
  editLoading.value = false;
};

const confirmDelete = (id: number) => {
  deleteTargetId.value = id;
  showDeleteConfirm.value = true;
};

const handleDelete = async () => {
  if (deleteTargetId.value === null) return;
  try {
    await postStore.deletePost(deleteTargetId.value);
  } catch { /* handled in store */ }
  showDeleteConfirm.value = false;
  deleteTargetId.value = null;
};

const onFileChange = (e: Event, target: 'create' | 'edit') => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    if (target === 'create') createForm.value.image = input.files[0];
    else editForm.value.image = input.files[0];
  }
};

const filteredPosts = () => {
  if (!searchQuery.value) return postStore.userPosts;
  const q = searchQuery.value.toLowerCase();
  return postStore.userPosts.filter(p => p.title?.toLowerCase().includes(q));
};
</script>

<template>
  <div class="container mx-auto px-4 pb-16">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0 }">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('nav.dashboard') }}</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">{{ t('dashboard.subtitle') }}</p>
      </div>
      <Button @click="showCreateModal = true" class="shrink-0 flex items-center gap-2">
        <PlusIcon class="w-4 h-4" />
        {{ t('dashboard.create_post') }}
      </Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="glass-card p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
          <FileTextIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('dashboard.total_posts') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ postStore.userPosts.length }}</p>
        </div>
      </div>
      <div class="glass-card p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
          <HeartIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('dashboard.total_likes') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ postStore.userPosts.reduce((sum, p) => sum + (p.likes_count ?? 0), 0) }}</p>
        </div>
      </div>
      <div class="glass-card p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
          <EyeIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('dashboard.welcome') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ authStore.user?.name }}</p>
        </div>
      </div>
    </div>

    <!-- Posts Table -->
    <div class="glass-card overflow-hidden">
      <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('dashboard.my_posts') }}</h2>
        <div class="relative max-w-sm w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon class="h-4 w-4 text-gray-400" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm text-gray-900 dark:text-white" 
            :placeholder="t('dashboard.search_posts')" 
          >
        </div>
      </div>
      
      <!-- Loading -->
      <div v-if="postStore.loading" class="p-8 space-y-4">
        <Skeleton v-for="i in 4" :key="i" class="h-16 w-full" />
      </div>

      <!-- Error -->
      <div v-else-if="postStore.error" class="p-8 text-center text-red-500">
        {{ postStore.error }}
        <button @click="postStore.fetchUserPosts()" class="block mx-auto mt-2 text-primary-600">{{ t('common.retry') }}</button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 dark:bg-gray-800/20 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
              <th class="p-4 font-medium first:pl-6">{{ t('dashboard.col_title') }}</th>
              <th class="p-4 font-medium">{{ t('dashboard.col_date') }}</th>
              <th class="p-4 font-medium">{{ t('dashboard.col_likes') }}</th>
              <th class="p-4 font-medium text-right last:pr-6">{{ t('dashboard.col_actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="post in filteredPosts()" :key="post.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
              <td class="p-4 first:pl-6">
                <div class="flex items-center gap-3">
                  <div v-if="post.image" class="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                    <img :src="post.image.startsWith('http') ? post.image : `http://localhost:8000/storage/${post.image}`" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <ImageIcon class="w-5 h-5 text-gray-400" />
                  </div>
                  <p class="font-medium text-gray-900 dark:text-white line-clamp-1">{{ post.title }}</p>
                </div>
              </td>
              <td class="p-4 text-gray-500 dark:text-gray-400 text-sm">{{ new Date(post.created_at).toLocaleDateString() }}</td>
              <td class="p-4 text-gray-500 dark:text-gray-400 text-sm">{{ post.likes_count ?? 0 }}</td>
              <td class="p-4 text-right last:pr-6">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openEdit(post)" class="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" :title="t('common.edit')">
                    <Edit2Icon class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(post.id)" class="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" :title="t('common.delete')">
                    <Trash2Icon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty -->
        <div v-if="filteredPosts().length === 0" class="py-16 text-center text-gray-500 dark:text-gray-400">
          <FileTextIcon class="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p class="font-medium">{{ t('dashboard.no_posts') }}</p>
        </div>
      </div>
    </div>

    <!-- Create Post Modal -->
    <Modal v-model="showCreateModal" :title="t('dashboard.create_post')">
      <form @submit.prevent="handleCreate" class="space-y-4">
        <Input v-model="createForm.title" :label="t('dashboard.field_title')" placeholder="Post title..." required />
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('dashboard.field_content') }}</label>
          <textarea v-model="createForm.content" rows="5" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm" :placeholder="t('dashboard.field_content_placeholder')"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('dashboard.field_image') }}</label>
          <input type="file" accept="image/*" @change="e => onFileChange(e, 'create')" class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-300" />
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="showCreateModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm">{{ t('common.cancel') }}</button>
          <Button type="submit" :isLoading="createLoading">{{ t('dashboard.create_btn') }}</Button>
        </div>
      </form>
    </Modal>

    <!-- Edit Post Modal -->
    <Modal v-model="showEditModal" :title="t('dashboard.edit_post')">
      <form @submit.prevent="handleEdit" class="space-y-4">
        <Input v-model="editForm.title" :label="t('dashboard.field_title')" required />
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('dashboard.field_content') }}</label>
          <textarea v-model="editForm.content" rows="5" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('dashboard.field_image') }}</label>
          <input type="file" accept="image/*" @change="e => onFileChange(e, 'edit')" class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="showEditModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm">{{ t('common.cancel') }}</button>
          <Button type="submit" :isLoading="editLoading">{{ t('dashboard.save_btn') }}</Button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirm Modal -->
    <Modal v-model="showDeleteConfirm" :title="t('dashboard.delete_confirm_title')">
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ t('dashboard.delete_confirm_msg') }}</p>
      <template #footer>
        <button @click="showDeleteConfirm = false" class="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm">{{ t('common.cancel') }}</button>
        <Button @click="handleDelete" class="bg-red-600 hover:bg-red-700">{{ t('common.delete') }}</Button>
      </template>
    </Modal>
  </div>
</template>

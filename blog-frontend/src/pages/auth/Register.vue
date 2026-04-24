<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/store/auth.store';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import { UserIcon, LockIcon, MailIcon } from 'lucide-vue-next';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const errorMsg = ref('');

const handleRegister = async () => {
  errorMsg.value = '';
  try {
    await authStore.register({ name: name.value, email: email.value, password: password.value });
    router.push('/dashboard');
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || t('auth.register_failed');
  }
};
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center p-4">
    <div 
      class="w-full max-w-md glass-card p-8 md:p-10"
      v-motion
      :initial="{ opacity: 0, scale: 0.95, y: 20 }"
      :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 400, type: 'spring' } }"
    >
      <div class="text-center mb-8">
        <div class="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary-500/30">
          B
        </div>
        <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
          {{ t('auth.create_account') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">{{ t('auth.register_subtitle') }}</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMsg" class="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <Input v-model="name" type="text" :label="t('auth.full_name')" placeholder="Jane Doe" required>
          <template #icon><UserIcon class="w-5 h-5 text-gray-400" /></template>
        </Input>

        <Input v-model="email" type="email" :label="t('auth.email')" placeholder="you@example.com" required>
          <template #icon><MailIcon class="w-5 h-5 text-gray-400" /></template>
        </Input>

        <Input v-model="password" type="password" :label="t('auth.password')" placeholder="••••••••" required>
          <template #icon><LockIcon class="w-5 h-5 text-gray-400" /></template>
        </Input>

        <Button type="submit" class="w-full h-11 mt-2" :isLoading="authStore.loading">
          {{ t('nav.register') }}
        </Button>
      </form>

      <div class="mt-8 text-center text-sm text-gray-500">
        {{ t('auth.has_account') }}
        <router-link to="/login" class="text-primary-600 hover:text-primary-500 font-medium">{{ t('auth.sign_in') }}</router-link>
      </div>
    </div>
  </div>
</template>

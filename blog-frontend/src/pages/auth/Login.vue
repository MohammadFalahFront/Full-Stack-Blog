<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/store/auth.store';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import { UserIcon, LockIcon } from 'lucide-vue-next';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMsg = ref('');

const handleLogin = async () => {
  errorMsg.value = '';
  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push('/dashboard');
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || t('auth.login_failed');
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
          {{ t('auth.welcome_back') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">{{ t('auth.login_subtitle') }}</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMsg" class="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <Input 
          v-model="email" 
          type="email" 
          :label="t('auth.email')" 
          placeholder="you@example.com"
          required
        >
          <template #icon>
            <UserIcon class="w-5 h-5 text-gray-400" />
          </template>
        </Input>

        <div>
          <Input 
            v-model="password" 
            type="password" 
            :label="t('auth.password')" 
            placeholder="••••••••"
            required
          >
            <template #icon>
              <LockIcon class="w-5 h-5 text-gray-400" />
            </template>
          </Input>
        </div>

        <Button type="submit" class="w-full h-11" :isLoading="authStore.loading">
          {{ t('nav.login') }}
        </Button>
      </form>

      <div class="mt-8 text-center text-sm text-gray-500">
        {{ t('auth.no_account') }}
        <router-link to="/register" class="text-primary-600 hover:text-primary-500 font-medium">{{ t('auth.create_now') }}</router-link>
      </div>
    </div>
  </div>
</template>

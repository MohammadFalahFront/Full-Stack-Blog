<script setup lang="ts">
import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';

const { locale } = useI18n();

watchEffect(() => {
  document.documentElement.lang = locale.value;
  document.documentElement.dir = locale.value === 'ar' ? 'rtl' : 'ltr';
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans">
    <DefaultLayout />
  </div>
</template>


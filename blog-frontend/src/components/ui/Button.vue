<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}>();

const emit = defineEmits(['click']);

const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 focus:ring-primary-500';
    case 'secondary': return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700';
    case 'danger': return 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 focus:ring-red-500';
    case 'ghost': return 'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-gray-800 focus:ring-primary-500';
    default: return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'; // primary default
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-sm px-3 py-1.5';
    case 'lg': return 'text-lg px-6 py-3';
    case 'md': default: return 'text-base px-4 py-2';
  }
});

const handleClick = (e: Event) => {
  if (!props.disabled && !props.isLoading) {
    emit('click', e);
  }
};
</script>

<template>
  <button
    :type="type || 'button'"
    :class="[baseClasses, variantClasses, sizeClasses]"
    :disabled="disabled || isLoading"
    @click="handleClick"
    v-motion
    :initial="{ scale: 1 }"
    :hover="{ scale: disabled || isLoading ? 1 : 1.02 }"
    :tap="{ scale: disabled || isLoading ? 1 : 0.98 }"
  >
    <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">

const props = defineProps<{
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const id = Math.random().toString(36).substr(2, 9);
</script>

<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type || 'text'"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :disabled="disabled"
        class="p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ease-in-out"
        :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': error, 'opacity-50 cursor-not-allowed': disabled }"
      />
      <!-- Slot for icons if needed -->
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <slot name="icon"></slot>
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600 animate-pulse">{{ error }}</p>
  </div>
</template>

<style scoped>
/* Focus animation */
input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06);
}
</style>

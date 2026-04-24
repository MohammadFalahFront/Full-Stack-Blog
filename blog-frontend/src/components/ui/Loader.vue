<template>
  <div class="flex justify-center items-center p-4">
    <div 
      class="animate-spin rounded-full border-b-2 border-primary-500"
      :class="{
        'h-6 w-6 border-2': size === 'sm',
        'h-10 w-10 border-4': size === 'md',
        'h-16 w-16 border-4': size === 'lg'
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md'
});
</script>

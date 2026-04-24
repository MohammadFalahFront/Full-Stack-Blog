<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { XIcon, CheckCircleIcon, AlertCircleIcon, InfoIcon } from 'lucide-vue-next';

const props = defineProps<{
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}>();

const emit = defineEmits(['close']);

let timer: number | null = null;
const isVisible = ref(true);

const close = () => {
  isVisible.value = false;
  setTimeout(() => emit('close'), 300); // Wait for transition
};

onMounted(() => {
  if (props.duration !== 0) {
    timer = window.setTimeout(close, props.duration || 3000);
  }
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <Transition name="toast">
    <div v-if="isVisible" 
         class="fixed bottom-4 right-4 rtl:right-auto rtl:left-4 z-50 flex items-center w-full max-w-sm p-4 space-x-3 text-gray-500 bg-white rounded-xl shadow-lg dark:text-gray-300 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 glass"
         v-motion
         :initial="{ opacity: 0, y: 50, scale: 0.9 }"
         :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', bounce: 0.4 } }"
         :leave="{ opacity: 0, x: 100, transition: { duration: 200 } }"
         role="alert">
      
      <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
           :class="{
             'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200': type === 'success',
             'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200': type === 'error',
             'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200': type === 'info' || !type
           }">
        <CheckCircleIcon v-if="type === 'success'" class="w-5 h-5" />
        <AlertCircleIcon v-else-if="type === 'error'" class="w-5 h-5" />
        <InfoIcon v-else class="w-5 h-5" />
      </div>
      
      <div class="ml-3 text-sm font-normal flex-grow ltr:ml-3 rtl:mr-3">{{ message }}</div>
      
      <button @click="close" type="button" class="ltr:-mx-1.5 ltr:-my-1.5 rtl:-mx-1.5 focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-lg justify-center items-center">
        <span class="sr-only">Close</span>
        <XIcon class="w-4 h-4" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
/* Handle RTL exit animation differently */
[dir="rtl"] .toast-leave-to {
  transform: translateX(-100px);
}
</style>

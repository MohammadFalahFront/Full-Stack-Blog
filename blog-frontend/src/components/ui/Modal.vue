<script setup lang="ts">
import { watch } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import { XIcon } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  maxWidth?: string;
}>();

const emit = defineEmits(['update:modelValue', 'close']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

onKeyStroke('Escape', (e) => {
  if (props.modelValue) {
    e.preventDefault();
    close();
  }
});

watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
          @click="close"
          aria-hidden="true"
        ></div>

        <!-- Modal panel -->
        <div 
          class="relative w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all"
          :class="[maxWidth || 'max-w-xl']"
          v-motion
          :initial="{ opacity: 0, y: 20, scale: 0.95 }"
          :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }"
          :leave="{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 200 } }"
        >
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur z-10">
            <h3 v-if="title" class="text-xl font-semibold text-gray-900 dark:text-white" id="modal-title">
              {{ title }}
            </h3>
            <button @click="close" class="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors ml-auto rtl:mr-auto rtl:ml-0">
              <span class="sr-only">Close</span>
              <XIcon class="h-6 w-6" />
            </button>
          </div>
          
          <div class="px-6 py-6 text-gray-600 dark:text-gray-300">
            <slot></slot>
          </div>
          
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl flex justify-end gap-3 rounded-b-lg">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

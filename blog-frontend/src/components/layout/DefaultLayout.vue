<script setup lang="ts">
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

const onBeforeLeave = () => {
  document.body.style.overflowX = 'hidden';
};

const onAfterEnter = () => {
  document.body.style.overflowX = '';
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <!-- Added pt-24 to offset the fixed navbar -->
    <main class="flex-grow pt-24 pb-12 w-full">
      <router-view v-slot="{ Component }">
        <transition 
          name="page" 
          mode="out-in"
          @before-leave="onBeforeLeave"
          @after-enter="onAfterEnter"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<style>
/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>

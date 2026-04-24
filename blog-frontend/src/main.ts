import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import i18n from './i18n'
import { MotionPlugin } from '@vueuse/motion'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(i18n)
app.use(MotionPlugin)

app.mount('#app')

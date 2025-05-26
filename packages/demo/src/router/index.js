import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Demo from '@/views/Demo.vue'
import Doc from '@/views/Doc.vue'
import cnManual from '@/docs/manual.zh_CN.md?raw'
import enManual from '@/docs/manual.en.md?raw'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  //  history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/demo',
      component: Demo,
    },
    {
      path: '/cn',
      component: Doc,
      props: {
        cnt: cnManual,
      },
    },
    {
      path: '/en',
      component: Doc,
      props: {
        cnt: enManual,
      },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router

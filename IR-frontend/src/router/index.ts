import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import FoodDetailView from '@/views/FoodDetailView.vue'
import BookmarksView from '@/views/BookmarksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,  // เพิ่มเส้นทางไปที่ LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,  // เพิ่มเส้นทางไปที่ RegisterView
    },
    {
      path: '/food/:name',
      name: 'food-detail',
      component: FoodDetailView, // หน้าแสดงรายละเอียดอาหาร
    },
    {
      path: '/bookmarks',  // เพิ่มเส้นทางใหม่สำหรับหน้า bookmark
      name: 'bookmarks-view',
      component: BookmarksView
    },
  ],
})

export default router

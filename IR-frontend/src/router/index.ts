import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import FoodDetailView from '@/views/FoodDetailView.vue'
import BookmarksView from '@/views/BookmarksView.vue'
import { useAuthStore } from '@/stores/auth'
import ProfileView from '@/views/ProfileView.vue'

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
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/food/:name',
      name: 'food-detail',
      component: FoodDetailView,
    },
    {
      path: '/bookmarks',
      name: 'bookmarks-view',
      component: BookmarksView,
      meta: { requiresAuth: true } // ⬅️ ต้อง login ก่อน
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true } // ต้อง login ก่อน
    },
  ],
})

// ⬇️ Navigation Guard เพื่อป้องกัน route ที่ต้อง login
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // redirect ไป login ถ้ายังไม่ได้ login
  } else {
    next()
  }
})

export default router

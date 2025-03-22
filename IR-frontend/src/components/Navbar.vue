<script setup lang="ts">
import { Search, Heart, User } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-300 via-gray-100 to-white shadow-md">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink to="/" class="text-orange-600 font-bold text-2xl flex items-center gap-1 animate-fade-in">
            Food
          </RouterLink>
        </div>

        <!-- Desktop Categories -->
        <div class="hidden md:flex space-x-4 items-center animate-slide-down">
          <button class="food-category-pill text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-4 py-2">
            All
          </button>
          <button class="food-category-pill text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-4 py-2">
            Breakfast
          </button>
          <button class="food-category-pill text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-4 py-2">
            Lunch
          </button>
          <button class="food-category-pill text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-4 py-2">
            Dinner
          </button>
          <button class="food-category-pill text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-4 py-2">
            Desserts
          </button>
        </div>

        <!-- Search and User Actions -->
        <div class="flex items-center gap-3 animate-fade-in">
          <!-- Search Box -->
          <div class="relative hidden sm:block">
            <Search class="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              placeholder="Search recipes..."
              class="pl-9 pr-4 h-9 w-[180px] md:w-[220px] rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <!-- Right-side buttons -->
          <div class="hidden sm:flex items-center gap-1">
            <RouterLink to="/bookmarks">
              <button class="rounded-full hover:bg-gray-200 p-2">
                <Heart class="h-5 w-5" />
              </button>
            </RouterLink>

            <!-- แสดงตามสถานะ login -->
            <template v-if="authStore.isAuthenticated">
              <RouterLink to="/profile">
                <button class="rounded-full hover:bg-gray-200 p-2">
                  <User class="h-5 w-5" />
                </button>
              </RouterLink>
              <button @click="handleLogout" class="text-sm text-gray-600 hover:underline px-2">
                Logout
              </button>
            </template>
            <template v-else>
              <RouterLink to="/login">
                <button class="rounded-full hover:bg-gray-200 p-2">
                  <User class="h-5 w-5" />
                </button>
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* เพิ่มเติมถ้าต้องการ */
</style>

<script setup>
import { Search, Heart, User } from 'lucide-vue-next';  // ไอคอนจาก Lucide
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-300 via-gray-100 to-white shadow-md">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="/" class="text-orange-600 font-bold text-2xl flex items-center gap-1 animate-fade-in">
            Food
          </a>
        </div>
        
        <!-- Desktop Categories -->
        <div class="hidden md:flex space-x-4 items-center overflow-x-auto no-scrollbar animate-slide-down">
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
          <div class="relative hidden sm:block">
            <Search class="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <!-- ใช้ Input ทั่วไป -->
            <input 
              type="search"
              placeholder="Search recipes..."
              class="pl-9 pr-4 h-9 w-[180px] md:w-[220px] rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        
          <!-- Desktop Navigation Icons -->
          <div class="hidden sm:flex items-center gap-1">
            <RouterLink to="/bookmarks">
              <button class="rounded-full hover:bg-gray-200 p-2">
                <Heart class="h-5 w-5" />
              </button>
            </RouterLink>
            <RouterLink to="/login">
              <button class="rounded-full hover:bg-gray-200 p-2">
                <User class="h-5 w-5" />
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* สามารถเพิ่มสไตล์เพิ่มเติมถ้าต้องการ */
</style>

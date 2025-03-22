<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
    <div class="flex flex-col items-center">
      <!-- Welcome Icon -->
      <div class="bg-green-100 p-3 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <!-- Welcome Message -->
      <h2 class="text-3xl font-bold mb-2 text-gray-800">Welcome Back!</h2>
      <p class="text-gray-600 mb-8">You have successfully logged in to your account.</p>
      
      <!-- Divider -->
      <div class="w-full border-t border-gray-200 my-4"></div>
      
      <!-- Logout Button -->
      <button 
        @click="logout" 
        class="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center gap-2 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  </div>
</template>
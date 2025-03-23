<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value
    })
    
    const token = response.data.token
    if (token) {
      console.log('Login successful, token received');
      authStore.setToken(token) // This will also save to localStorage
      router.push('/')
    } else {
      console.error('No token in response', response.data);
      error.value = 'Authentication failed. Server did not return a token.'
    }
  } catch (err: any) {
    console.error('Login error:', err);
    
    if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else if (err.message) {
      error.value = `Error: ${err.message}`
    } else {
      error.value = 'Invalid email or password'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-form max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
      
      <div>
        <label for="email" class="block text-gray-700">Email</label>
        <input type="email" v-model="email" id="email" required class="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      
      <div>
        <label for="password" class="block text-gray-700">Password</label>
        <input type="password" v-model="password" id="password" required class="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      
      <button 
        type="submit" 
        class="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        :disabled="loading"
      >
        <span v-if="loading">Logging in...</span>
        <span v-else>Login</span>
      </button>
    </form>

    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <router-link to="/register" class="text-blue-500 hover:underline">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-form {
  /* เพิ่มเติมได้ */
}
</style>

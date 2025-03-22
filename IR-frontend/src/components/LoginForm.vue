<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // สมมุติว่าใช้ Pinia

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      email: email.value,
      password: password.value
    })
    const token = response.data.token
    if (token) {
      authStore.setToken(token) // บันทึก token ลงใน store/localStorage
      router.push('/') // เปลี่ยน route
    }
  } catch (error) {
    alert('Invalid email or password')
    console.error(error)
  }
}
</script>

<template>
  <div class="login-form max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email" class="block text-gray-700">Email</label>
        <input type="email" v-model="email" id="email" required class="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <div>
        <label for="password" class="block text-gray-700">Password</label>
        <input type="password" v-model="password" id="password" required class="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Login</button>
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

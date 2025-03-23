<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const username = ref('') // ไม่ใช้จริงใน backend ตอนนี้
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const handleRegister = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const response = await api.post('/register', {
      email: email.value,
      password: password.value
    })
    
    alert('Register successful. You can now log in.')
    router.push('/login')
  } catch (err: any) {
    if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else {
      error.value = 'Registration failed. Please try again.'
    }
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-form max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
      
      <div>
        <label for="username" class="block text-gray-700">Username</label>
        <input type="text" v-model="username" id="username" required class="w-full p-2 border border-gray-300 rounded-md" />
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
        <span v-if="loading">Registering...</span>
        <span v-else>Register</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.register-form {
  /* ปรับแต่งเพิ่มเติมได้ */
}
</style>

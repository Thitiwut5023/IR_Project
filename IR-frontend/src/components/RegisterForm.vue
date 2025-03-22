<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('') // ไม่ใช้จริงใน backend ตอนนี้
const email = ref('')
const password = ref('')
const router = useRouter()

const handleRegister = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/register', {
      email: email.value,
      password: password.value
    })
    alert('Register successful. You can now log in.')
    router.push('/login')
  } catch (error) {
    alert('Registration failed.')
    console.error(error)
  }
}
</script>

<template>
  <div class="register-form max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
    <form @submit.prevent="handleRegister" class="space-y-4">
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
      <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Register</button>
    </form>
  </div>
</template>

<style scoped>
.register-form {
  /* ปรับแต่งเพิ่มเติมได้ */
}
</style>

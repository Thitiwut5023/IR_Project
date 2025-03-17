<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      console.log('Email:', this.email)
      console.log('Password:', this.password)
      // Add login logic here
    }
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

    <!-- Link to Register Page -->
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
  /* สามารถปรับสไตล์เพิ่มเติมได้ */
}
</style>

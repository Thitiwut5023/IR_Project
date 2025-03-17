<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      username: '',
      email: '',
      password: ''
    }
  },
  methods: {
    handleRegister() {
      console.log('Username:', this.username)
      console.log('Email:', this.email)
      console.log('Password:', this.password)
      // Add register logic here
    }
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
  /* สามารถปรับสไตล์เพิ่มเติมได้ */
}
</style>

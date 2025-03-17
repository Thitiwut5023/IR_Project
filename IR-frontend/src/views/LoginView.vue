<script>
import LoginForm from '../components/LoginForm.vue'  // นำเข้า LoginForm component

export default {
  name: 'LoginView',
  components: {
    LoginForm
  }
}
</script>

<template>
  <div class="login-view flex flex-col items-center bg-gradient-to-b from-gray-200 via-gray-300 to-white py-20">
    <div class="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-semibold text-center text-yellow-600 mb-6">Welcome</h2>
      <LoginForm /> <!-- ใช้ LoginForm component -->
    </div>
  </div>
</template>

<style scoped>
/* คุณสามารถปรับแต่ง CSS ได้ตามต้องการ */
</style>

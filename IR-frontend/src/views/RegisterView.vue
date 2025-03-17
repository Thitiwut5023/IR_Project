<script>
import RegisterForm from '../components/RegisterForm.vue'  // นำเข้า RegisterForm component

export default {
  name: 'RegisterView',
  components: {
    RegisterForm  // ลงทะเบียน RegisterForm component
  }
}
</script>

<template>
  <div class="register-view flex flex-col items-center bg-gradient-to-b from-gray-200 via-gray-300 to-white py-20">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-3xl font-semibold text-center text-yellow-600 mb-6">Register</h2>
      <RegisterForm /> <!-- ใช้ RegisterForm component -->
    </div>
  </div>
</template>

<style scoped>
/* คุณสามารถปรับแต่ง CSS ได้ตามต้องการ */
</style>

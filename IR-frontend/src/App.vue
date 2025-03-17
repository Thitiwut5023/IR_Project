<script>
import Navbar from './components/Navbar.vue';  // นำเข้า Navbar component

export default {
  name: 'App',
  components: {
    Navbar,  // ลงทะเบียน Navbar component
  },
};
</script>

<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navbar /> <!-- ใช้ Navbar component -->
    <main class="flex-grow">
      <router-view></router-view> <!-- ใช้สำหรับแสดง view ตาม router -->
    </main>
    <footer class="bg-gray-800 p-4 text-white text-center mt-auto">
      <p>2025 IR-Project &copy; Thitiwut Thitnuea</p>
    </footer>
  </div>
</template>

<style scoped>
/* สามารถใส่ styles อื่น ๆ ที่ต้องการได้ */
</style>

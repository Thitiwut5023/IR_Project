<script setup>
import { ref, onMounted } from 'vue';
import { Search } from 'lucide-vue-next';  // ใช้ไอคอน Search จาก lucide
import Card from '@/components/Card.vue';

const items = ref([]);
const loading = ref(true);
const searchQuery = ref("pasta");  // คำค้นหาจากช่อง input

// ฟังก์ชันดึงข้อมูลจาก API
const fetchData = async (query = "") => {
  try {
    const response = await fetch(`http://localhost:5000/api/search?query=${query}`);  // ส่งค่า query ไปใน URL
    const data = await response.json();
    items.value = data;  // ใช้ข้อมูลจาก API มาฝากใน items
    loading.value = false;
    console.log("data",data)
    console.log(items)

  } catch (error) {
    console.error('Error fetching data:', error);
    loading.value = false;
    console.log(items)
  }
};

// เรียกใช้เมื่อ component ถูก mount
onMounted(() => {
  fetchData(searchQuery.value);
});

// ฟังก์ชันสำหรับการค้นหา
const handleSearch = () => {
  fetchData(searchQuery.value);  // ส่งคำค้นหาที่พิมพ์
};
</script>

<template>
  <div class="home flex flex-col items-center bg-gradient-to-b from-gray-200 via-gray-300 to-white py-20">
    <!-- Main Content -->
    <div class="text-center text-gray-800 max-w-7xl mx-auto px-4">
      <h2 class="text-5xl font-extrabold mb-4 animate-fade-in text-gray-900">
        Find & Save Your Next Culinary Inspiration
      </h2>
      <p class="text-lg mb-6 animate-fade-in text-gray-600">
        Discover recipes, save your favorites, and get inspired for your next kitchen adventure.
      </p>

      <!-- Search Box with Search Icon -->
      <div class="relative mb-8">
        <input 
          v-model="searchQuery"
          @input="handleSearch"
          type="search"
          placeholder="Search for menu or recipes..."
          class="w-full max-w-xl p-4 pl-12 pr-6 rounded-full bg-white border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      <!-- Card Container with 4 columns -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
        <!-- Check if data is loading -->
        <div v-if="loading" class="w-full text-center">Loading...</div>

        <!-- Loop through the items and display them -->
        <div v-for="(item, index) in items" :key="index" class="w-full">
          <RouterLink :to="`/food/${item.Name}`">
            <Card 
              :image="item.image" 
              :title="item.name" 
              :description="item.description" 
            />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* สามารถเพิ่มสไตล์เพิ่มเติมได้ตามต้องการ */
</style>

<script setup>
import { ref, onMounted, provide, watch } from 'vue';
import { Search } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import Card from '@/components/Card.vue';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const items = ref([]);
const loading = ref(true);
const searchQuery = ref(route.query.search || "pasta");

// Provide searchQuery to be used by Navbar
provide('searchQuery', searchQuery);

// ฟังก์ชันดึงข้อมูลจาก API
const fetchData = async (query = "") => {
  // Set loading to true to show loading indicator
  loading.value = true;
  
  try {
    console.log(`Fetching data for query: "${query}"`);
    const response = await fetch(
      `http://localhost:5000/api/search?query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Search results:", data);
    
    // Clear previous results and populate with new data
    items.value = data;
    
  } catch (error) {
    console.error('Error fetching data:', error);
    items.value = []; // Clear items on error
  } finally {
    loading.value = false;
  }
};

// Watch for changes in route query params
watch(() => route.query, (newQuery) => {
  if (newQuery.search) {
    searchQuery.value = newQuery.search;
    fetchData(searchQuery.value);
  }
}, { deep: true });

// ฟังก์ชันสำหรับการค้นหา
const handleSearch = () => {
  console.log("Search triggered for:", searchQuery.value);
  // Don't trigger search if query is empty
  if (searchQuery.value.trim() !== "") {
    // Update URL to reflect the search
    router.push({ 
      path: '/', 
      query: { 
        search: searchQuery.value
      }
    });
    
    fetchData(searchQuery.value);
  }
};

// Throttled search handler to prevent too many API calls during typing
let searchTimeout;
const handleSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    handleSearch();
  }, 500); // 500ms delay
};

// เรียกใช้เมื่อ component ถูก mount
onMounted(() => {
  fetchData(searchQuery.value);
});
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

      <!-- Simple Search Box with Search Icon -->
      <div class="relative mb-8 max-w-2xl mx-auto">
        <div class="relative flex-1">
          <input 
            v-model="searchQuery"
            @input="handleSearchInput"
            @keyup.enter="handleSearch"
            type="search"
            placeholder="Search for recipes, ingredients, or cooking methods..."
            class="w-full p-4 pl-12 pr-6 rounded-full bg-white border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <!-- Card Container with 4 columns -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
        <!-- Check if data is loading -->
        <div v-if="loading" class="col-span-full text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p class="mt-2">Loading results...</p>
        </div>

        <!-- No results message -->
        <div v-else-if="items.length === 0" class="col-span-full text-center py-8">
          <p class="text-lg text-gray-600">No results found for "{{ searchQuery }}"</p>
          <p class="text-sm text-gray-500 mt-2">Try using different keywords or check for spelling.</p>
        </div>

        <!-- Loop through the items and display them -->
        <div v-else v-for="(item, index) in items" :key="`${index}-${item._id || item.id}`" class="w-full">
          <Card 
            :id="item._id || item.id"
            :image="item.Images || item.image" 
            :title="item.Name || item.name" 
            :description="item.Description || item.description"
            :category="item.category || item.RecipeCategory" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* สามารถเพิ่มสไตล์เพิ่มเติมได้ตามต้องการ */
</style>

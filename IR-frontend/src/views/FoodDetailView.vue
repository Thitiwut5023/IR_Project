<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import BookmarkButton from '@/components/BookmarkButton.vue';
import api from '@/services/api';

const route = useRoute();
const foodSlug = ref(route.params.name); // Convert to ref to allow reactivity

// State to hold food details and loading status
const foodDetails = ref(null);
const loading = ref(true);
const error = ref(null); 

// Fetch food details from API
const fetchFoodDetails = async () => {
  // Reset states
  loading.value = true;
  error.value = null;
  foodDetails.value = null;
  
  try {
    const response = await api.get(`/food/${foodSlug.value}`);
    foodDetails.value = response.data;
  } catch (err) {
    console.error('Error fetching food details:', err);
    error.value = 'Error fetching food details, please try again later.';
  } finally {
    loading.value = false;
  }
};

// Watch for changes in the route parameter
watch(() => route.params.name, (newSlug) => {
  if (newSlug && newSlug !== foodSlug.value) {
    foodSlug.value = newSlug;
    fetchFoodDetails();
  }
}, { immediate: false });

// Fetch data when the component is mounted
onMounted(() => {
  fetchFoodDetails();
});
</script>

<template>
  <div class="food-detail flex items-center justify-center bg-gradient-to-b from-gray-200 via-gray-300 to-white">
    <div class="max-w-3xl w-full px-4 py-8 bg-white rounded-lg shadow-lg mt-16">
      <!-- Display food name -->
      <h1 class="text-4xl font-bold text-center mb-6 text-gray-900">
        {{ foodDetails?.name || 'Food Details' }}
      </h1>

      <!-- Error message -->
      <div v-if="error" class="text-center text-red-500 mb-6">
        <p>{{ error }}</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center">Loading...</div>

      <!-- Display food image -->
      <div v-if="foodDetails" class="text-center">
        <img :src="foodDetails.image" alt="Food image" class="w-full h-64 object-cover rounded-lg mb-6" />
      </div>

      <!-- Bookmark Button -->
      <div v-if="foodDetails" class="text-center mb-6">
        <BookmarkButton
          :slug="foodDetails.id"
          :title="foodDetails.name"
          :image="foodDetails.image"
          :description="foodDetails.description"
        />
      </div>

      <!-- Display additional information -->
      <div class="space-y-6" v-if="foodDetails">
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">Description</h2>
          <p>{{ foodDetails.description || 'Not available' }}</p>
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">Instructions</h2>
          <p>{{ foodDetails.recipe_instructions || 'Not available' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.food-detail {
  background-color: #f9fafb;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 4rem);
  padding-top: 4rem;
}

.food-detail .max-w-3xl {
  width: 100%;
  max-width: 800px;
}

.food-detail h1 {
  font-size: 2.5rem;
}

.food-detail h2 {
  font-size: 1.5rem;
}

.food-detail img {
  border-radius: 1rem;
}

.food-detail .space-y-6 > div {
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.food-detail .space-y-6 > div:last-child {
  border-bottom: none;
}
</style>

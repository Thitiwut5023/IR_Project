<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BookmarkButton from '@/components/BookmarkButton.vue';

const route = useRoute();
const foodSlug = route.params.name; // Receive slug from URL

const formattedFoodName = foodSlug;

// State to hold food details and loading status
const foodDetails = ref(null);
const loading = ref(true);
const error = ref(null); // Add error state to show error message if something goes wrong

// Fetch food details from API
const fetchFoodDetails = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/data/${foodSlug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    if (data && data.length > 0) {
      foodDetails.value = data[0]; // Assuming the response is an array, get the first item
    } else {
      foodDetails.value = null;
      error.value = 'No data found for this item.';
    }
  } catch (err) {
    console.error('Error fetching food details:', err);
    error.value = 'Error fetching food details, please try again later.';
  } finally {
    loading.value = false;
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchFoodDetails();
});
</script>

<template>
  <div class="food-detail flex items-center justify-center bg-gradient-to-b from-gray-200 via-gray-300 to-white">
    <div class="max-w-3xl w-full px-4 py-8 bg-white rounded-lg shadow-lg mt-16">
      <!-- Display food name -->
      <h1 class="text-4xl font-bold text-center mb-6 text-gray-900">{{ formattedFoodName }}</h1>

      <!-- Error message -->
      <div v-if="error" class="text-center text-red-500 mb-6">
        <p>{{ error }}</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center">Loading...</div>

      <!-- Display food image -->
      <div v-if="foodDetails" class="text-center">
        <img :src="foodDetails.Images" alt="Food image" class="w-full h-64 object-cover rounded-lg mb-6" />
      </div>

      <!-- Bookmark Button -->
      <div v-if="foodDetails" class="text-center mb-6">
        <BookmarkButton
          :slug="foodSlug"
          :title="formattedFoodName"
          :image="foodDetails.Images"
          :description="foodDetails.Description"
        />
      </div>

      <!-- Display additional information -->
      <div class="space-y-6" v-if="foodDetails">
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">Country of Origin</h2>
          <p>{{ foodDetails['Country of Origin'] || 'Not available' }}</p>
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">Ingredients</h2>
          <p>{{ foodDetails.RecipeIngredientQuantities || 'Not available' }}</p>
          <p>{{ foodDetails.RecipeIngredientParts || 'Not available' }}</p>
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">Additional Information</h2>
          <p>{{ foodDetails.RecipeInstructions || 'Not available' }}</p>
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">Description</h2>
          <p>{{ foodDetails.Description || 'Not available' }}</p>
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

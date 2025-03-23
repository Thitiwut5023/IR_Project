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

// Format time (convert ISO duration or string to readable format)
const formatTime = (timeString) => {
  if (!timeString) return 'Not specified';
  
  // Handle ISO8601 duration format (PT1H30M)
  if (timeString.startsWith('PT')) {
    const hours = timeString.match(/(\d+)H/);
    const minutes = timeString.match(/(\d+)M/);
    
    let result = '';
    if (hours) result += `${hours[1]} hr `;
    if (minutes) result += `${minutes[1]} min`;
    
    return result || 'Not specified';
  }
  
  return timeString;
};

// Process ingredients to ensure proper display with quantities
const processIngredients = (ingredientsData) => {
  if (!ingredientsData) return [];
  
  // If ingredients is already an array of objects with name and quantity
  if (Array.isArray(ingredientsData) && ingredientsData.length > 0 && typeof ingredientsData[0] === 'object') {
    return ingredientsData;
  }
  
  // If ingredients is an array of strings
  if (Array.isArray(ingredientsData) && ingredientsData.length > 0 && typeof ingredientsData[0] === 'string') {
    return ingredientsData.map(item => ({
      name: item.trim(),
      quantity: ''
    }));
  }
  
  // If ingredients is a string, split it by comma
  if (typeof ingredientsData === 'string') {
    return ingredientsData.split(',')
      .map(item => ({
        name: item.trim(),
        quantity: ''
      }))
      .filter(item => item.name);
  }
  
  return [];
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
    <div class="max-w-4xl w-full px-4 py-8 bg-white rounded-lg shadow-lg mt-16 mb-16">
      <!-- Display food name -->
      <h1 class="text-4xl font-bold text-center mb-6 text-gray-900">
        {{ foodDetails?.name || 'Food Details' }}
      </h1>

      <!-- Error message -->
      <div v-if="error" class="text-center text-red-500 mb-6">
        <p>{{ error }}</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>

      <div v-if="foodDetails && !loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left column: Image and basic info -->
        <div class="col-span-1 md:col-span-2">
          <!-- Display food image -->
          <img :src="foodDetails.image" alt="Food image" class="w-full h-auto object-cover rounded-lg mb-6" />
          
          <!-- Bookmark Button -->
          <div class="text-center mb-6">
            <BookmarkButton
              :slug="foodDetails.id"
              :title="foodDetails.name"
              :image="foodDetails.image"
              :description="foodDetails.description"
            />
          </div>
          
          <!-- Description -->
          <div class="mb-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-2">Description</h2>
            <p class="text-gray-700">{{ foodDetails.description || 'No description available' }}</p>
          </div>
          
          <!-- Ingredients Section -->
          <div class="mb-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-2">Ingredients</h2>
            <ul class="list-disc pl-5 text-gray-700">
              <li v-for="(ingredient, index) in processIngredients(foodDetails.ingredients)" 
                  :key="index" 
                  class="mb-2 flex items-baseline">
                <span v-if="ingredient.quantity" class="font-medium text-gray-800 mr-2">
                  {{ ingredient.quantity }}
                </span>
                <span>{{ ingredient.name || ingredient }}</span>
              </li>
            </ul>
            
            <!-- Show message if no ingredients -->
            <p v-if="!foodDetails.ingredients || processIngredients(foodDetails.ingredients).length === 0" 
               class="text-gray-500 italic">
              No ingredients listed for this recipe
            </p>
          </div>
        </div>
        
        <!-- Right column: Recipe details -->
        <div class="col-span-1">
          <!-- Recipe Info Card -->
          <div class="bg-gray-100 rounded-lg p-4 mb-6">
            <h3 class="text-lg font-medium mb-2 text-gray-800">Recipe Information</h3>
            
            <div class="grid grid-cols-2 gap-2">
              <!-- Prep Time -->
              <div v-if="foodDetails.prep_time" class="flex flex-col">
                <span class="text-xs text-gray-500">Prep Time</span>
                <span class="font-medium">{{ formatTime(foodDetails.prep_time) }}</span>
              </div>
              
              <!-- Cook Time -->
              <div v-if="foodDetails.cook_time" class="flex flex-col">
                <span class="text-xs text-gray-500">Cook Time</span>
                <span class="font-medium">{{ formatTime(foodDetails.cook_time) }}</span>
              </div>
              
              <!-- Total Time -->
              <div v-if="foodDetails.total_time" class="flex flex-col">
                <span class="text-xs text-gray-500">Total Time</span>
                <span class="font-medium">{{ formatTime(foodDetails.total_time) }}</span>
              </div>
              
              <!-- Servings -->
              <div v-if="foodDetails.recipe_yield" class="flex flex-col">
                <span class="text-xs text-gray-500">Servings</span>
                <span class="font-medium">{{ foodDetails.recipe_yield }}</span>
              </div>
            </div>
          </div>
          
          <!-- Nutrition Info -->
          <div v-if="foodDetails.calories || foodDetails.fat_content || foodDetails.protein_content" 
               class="bg-gray-100 rounded-lg p-4 mb-6">
            <h3 class="text-lg font-medium mb-2 text-gray-800">Nutrition</h3>
            
            <div class="space-y-1">
              <div v-if="foodDetails.calories" class="flex justify-between">
                <span class="text-gray-600">Calories:</span>
                <span class="font-medium">{{ foodDetails.calories }}</span>
              </div>
              <div v-if="foodDetails.fat_content" class="flex justify-between">
                <span class="text-gray-600">Fat:</span>
                <span class="font-medium">{{ foodDetails.fat_content }}</span>
              </div>
              <div v-if="foodDetails.protein_content" class="flex justify-between">
                <span class="text-gray-600">Protein:</span>
                <span class="font-medium">{{ foodDetails.protein_content }}</span>
              </div>
            </div>
          </div>
          
          <!-- Category and Cuisine -->
          <div class="bg-gray-100 rounded-lg p-4 mb-6">
            <h3 class="text-lg font-medium mb-2 text-gray-800">Category</h3>
            <div v-if="foodDetails.category" class="mb-2">
              <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {{ foodDetails.category }}
              </span>
            </div>
            <div v-if="foodDetails.cuisine">
              <span class="text-gray-600">Cuisine:</span>
              <span class="ml-1 font-medium">{{ foodDetails.cuisine }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Instructions Section (Full Width) -->
      <div class="mt-6" v-if="foodDetails && !loading">
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Instructions</h2>
        <div class="prose max-w-none text-gray-700">
          <!-- Format instructions if they are a string -->
          <div v-if="typeof foodDetails.recipe_instructions === 'string'">
            <p v-for="(paragraph, i) in foodDetails.recipe_instructions.split('\n\n')" 
               :key="i" 
               class="mb-4"
               v-html="paragraph">
            </p>
          </div>
          <!-- If instructions are an array -->
          <ol v-else-if="Array.isArray(foodDetails.recipe_instructions)" class="list-decimal pl-5">
            <li v-for="(step, i) in foodDetails.recipe_instructions" 
                :key="i"
                class="mb-2">
              {{ step }}
            </li>
          </ol>
          <p v-else>No instructions available</p>
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
  padding: 6rem 1rem;
}

/* Other existing styles */
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

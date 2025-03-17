<script setup>
import { useRoute } from 'vue-router';
import BookmarkButton from '@/components/BookmarkButton.vue';

const route = useRoute();
const foodSlug = route.params.name; // รับ slug จาก URL

const formattedFoodName = foodSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
</script>

<template>
  <div class="food-detail flex items-center justify-center bg-gradient-to-b from-gray-200 via-gray-300 to-white">
    <div class="max-w-3xl w-full px-4 py-8 bg-white rounded-lg shadow-lg mt-16">
      <h1 class="text-4xl font-bold text-center mb-6 text-gray-900">{{ formattedFoodName }}</h1>
      <div class="text-center">
        <img :src="`https://via.placeholder.com/800x400?text=${foodSlug}`" alt="Food image" class="w-full h-64 object-cover rounded-lg mb-6" />
      </div>

      <!-- ใช้ BookmarkButton component -->
      <div class="text-center mb-6">
        <BookmarkButton
          :slug="foodSlug"
          :title="formattedFoodName"
          :image="`https://via.placeholder.com/800x400?text=${foodSlug}`"
          :description="'Description here...'"
          :category="'Category here...'"
        />
      </div>

      <div class="space-y-6">
        <div><h2 class="text-2xl font-semibold text-gray-800 mb-2">Country of Origin</h2></div>
        <div><h2 class="text-2xl font-semibold text-gray-800 mb-2">Ingredients</h2></div>
        <div><h2 class="text-2xl font-semibold text-gray-800 mb-2">Additional Information</h2></div>
        <div><h2 class="text-2xl font-semibold text-gray-800 mb-2">Description</h2></div>
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

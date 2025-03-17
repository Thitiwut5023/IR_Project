<script setup>
import { RouterLink } from 'vue-router';
import BookmarkButton from './BookmarkButton.vue'; // นำเข้า BookmarkButton component

const props = defineProps({
  image: String,
  title: String,
  description: String,
  category: String
});

const slug = props.title.replace(/\s+/g, '-').toLowerCase();
</script>

<template>
  <div class="card max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl">
    <RouterLink :to="`/food/${slug}`">
      <img :src="props.image" alt="Card image" class="w-full h-56 object-cover rounded-t-xl" />
    </RouterLink>
    <div class="p-6">
      <RouterLink :to="`/food/${slug}`">
        <h3 class="text-2xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-all">{{ props.title }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ props.description }}</p>
      </RouterLink>
    </div>
    <div class="flex justify-between items-center p-4 border-t border-gray-200">
      <span class="text-sm font-semibold text-gray-700">{{ props.category }}</span>
      <!-- ใช้ BookmarkButton component -->
      <BookmarkButton
        :slug="slug"
        :title="props.title"
        :image="props.image"
        :description="props.description"
        :category="props.category"
      />
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
}

img {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}
</style>

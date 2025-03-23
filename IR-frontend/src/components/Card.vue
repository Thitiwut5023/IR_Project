<script setup>
import { RouterLink } from 'vue-router';
import BookmarkButton from './BookmarkButton.vue'; // นำเข้า BookmarkButton component
import { computed } from 'vue';

const props = defineProps({
  image: String,
  title: String,
  description: String,
  id: String, // Add id prop to receive the food id
  category: String,
});

// ใช้ id หรือ title เป็น slug
const slug = props.id || props.title;

// Truncate title text to ensure a consistent height
const truncatedTitle = computed(() => {
  if (!props.title) return '';
  
  const maxLength = 50;
  if (props.title.length <= maxLength) {
    return props.title;
  }
  
  return props.title.substring(0, maxLength).trim() + '...';
});

// Truncate description text to a consistent length
const truncatedDescription = computed(() => {
  if (!props.description) return '';
  
  // Set max length for description (adjust as needed)
  const maxLength = 100;
  
  if (props.description.length <= maxLength) {
    return props.description;
  }
  
  // Truncate and add ellipsis
  return props.description.substring(0, maxLength).trim() + '...';
});
</script>

<template>
  <div class="card max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl">
    <RouterLink :to="`/food/${slug}`">
      <img :src="props.image" alt="Card image" class="w-full h-56 object-cover rounded-t-xl" />
    </RouterLink>
    <div class="content p-6">
      <RouterLink :to="`/food/${slug}`">
        <!-- Fixed height for title with line-clamp -->
        <h3 class="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-all line-clamp-2 h-14">
          {{ truncatedTitle }}
        </h3>
        <!-- Fixed height for description with line-clamp -->
        <p class="text-sm text-gray-600 mb-4 line-clamp-3 h-16">
          {{ truncatedDescription }}
        </p>
      </RouterLink>
    </div>
    <div class="flex justify-between items-center p-4 border-t border-gray-200">
      <span v-if="props.category" class="text-sm font-semibold text-gray-700 truncate max-w-[120px]">
        {{ props.category }}
      </span>
      <span v-else class="text-sm text-gray-500">Uncategorized</span>
      <!-- ใช้ BookmarkButton component -->
      <BookmarkButton
        :slug="slug"
        :title="props.title"
        :image="props.image"
        :description="props.description"
      />
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%; /* Make all cards the same height */
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
}

.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

img {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  height: 200px;
  object-fit: cover;
  width: 100%;
}

/* Add Tailwind-style line clamp utility if not using Tailwind plugins */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

/* Ensure the category doesn't take too much space */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

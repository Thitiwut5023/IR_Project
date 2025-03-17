<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

// Store bookmarks in the state
const bookmarks = ref([]);

// Function to load bookmarks from localStorage
const loadBookmarks = () => {
  const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  bookmarks.value = storedBookmarks;
};

// Load bookmarks when the page is loaded
onMounted(() => {
  loadBookmarks();
});
</script>

<template>
  <div class="my-bookmarks py-20 px-4">
    <div class="max-w-7xl mx-auto text-center">
      <h2 class="text-5xl font-extrabold mb-4 text-gray-900">My Bookmarks</h2>
      <p class="text-lg mb-6 text-gray-600">Your saved favorite recipes.</p>

      <!-- Show message if there are no bookmarks -->
      <div v-if="bookmarks.length === 0" class="text-center text-gray-500">
        <p>No bookmarked recipes found!</p>
      </div>

      <!-- Show bookmarked recipes -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div v-for="(bookmark, index) in bookmarks" :key="index" class="w-full">
          <RouterLink :to="`/food/${bookmark.title.replace(/\s+/g, '-').toLowerCase()}`">
            <div class="card max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <!-- Show image and title -->
              <img :src="bookmark.image" alt="Card image" class="w-full h-56 object-cover" />
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ bookmark.title }}</h3>
                <p class="text-sm text-gray-600">{{ bookmark.description }}</p>
                <span class="text-sm text-gray-500">{{ bookmark.category }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-bookmarks {
  background-color: #f9fafb;
  border-radius: 1rem;
}
</style>

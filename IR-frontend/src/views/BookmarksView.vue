<script setup>
import { ref, onMounted, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { bookmarkService } from '@/services/api';

const authStore = useAuthStore();
const router = useRouter();
// Store bookmarks in the state
const bookmarks = ref([]);
const loading = ref(false);
const error = ref(null);

// Watch for authentication changes
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    loadBookmarks();
  } else {
    // Redirect to login if not authenticated
    router.push('/login');
  }
});

// Function to load bookmarks from API
const loadBookmarks = async () => {
  // Only fetch if user is authenticated
  if (!authStore.isAuthenticated) {
    error.value = 'Please login to view your bookmarks';
    return;
  }
  
  try {
    loading.value = true;
    error.value = null;
    const data = await bookmarkService.getBookmarks();
    bookmarks.value = data.map(bookmark => ({
      id: bookmark.recipe_id,
      slug: bookmark.recipe_id,
      title: bookmark.recipe_name,
      description: bookmark.recipe_description,
      image: bookmark.recipe_image,
      createdAt: new Date(bookmark.created_at).toLocaleDateString()
    }));
  } catch (err) {
    console.error('Error loading bookmarks:', err);
    error.value = 'Failed to load bookmarks. Please try again later.';
    
    // Handle authentication error
    if (err.response?.status === 401) {
      error.value = 'Your session has expired. Please login again.';
      authStore.logout();
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  } finally {
    loading.value = false;
  }
};

// Remove a bookmark
const removeBookmark = async (recipeId) => {
  try {
    loading.value = true;
    await bookmarkService.removeBookmark(recipeId);
    // Update the bookmarks list after successful deletion
    bookmarks.value = bookmarks.value.filter(bookmark => bookmark.id !== recipeId);
  } catch (err) {
    console.error('Error removing bookmark:', err);
    alert('Failed to remove bookmark. Please try again.');
    
    // Handle authentication error
    if (err.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    }
  } finally {
    loading.value = false;
  }
};

// Load bookmarks when the page is loaded
onMounted(() => {
  if (authStore.isAuthenticated) {
    loadBookmarks();
  }
});
</script>

<template>
  <div class="my-bookmarks py-20 px-4">
    <div class="max-w-7xl mx-auto text-center">
      <h2 class="text-5xl font-extrabold mb-4 text-gray-900">My Bookmarks</h2>
      <p class="text-lg mb-6 text-gray-600">Your saved favorite recipes.</p>

      <!-- Show loading state -->
      <div v-if="loading" class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>

      <!-- Show error message -->
      <div v-else-if="error" class="text-center text-red-500 p-4">
        <p>{{ error }}</p>
      </div>

      <!-- Show message if there are no bookmarks -->
      <div v-else-if="bookmarks.length === 0" class="text-center text-gray-500 p-8">
        <p class="text-xl">No bookmarked recipes found!</p>
        <RouterLink to="/" class="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
          Browse Recipes
        </RouterLink>
      </div>

      <!-- Show bookmarked recipes -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div v-for="bookmark in bookmarks" :key="bookmark.id" class="w-full">
          <div class="card max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Show image and title -->
            <RouterLink :to="`/food/${bookmark.slug}`">
              <img :src="bookmark.image" alt="Card image" class="w-full h-56 object-cover" />
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ bookmark.title }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ bookmark.description }}</p>
                <span class="text-xs text-gray-500">Saved on: {{ bookmark.createdAt }}</span>
              </div>
            </RouterLink>
            <!-- Remove bookmark button -->
            <div class="p-4 border-t border-gray-100">
              <button 
                @click="removeBookmark(bookmark.id)" 
                class="text-red-500 hover:text-red-700 text-sm"
              >
                Remove from bookmarks
              </button>
            </div>
          </div>
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

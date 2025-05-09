<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { bookmarkService, folderService } from '@/services/api';
import { useRouter } from 'vue-router';
import MoveBookmarkDialog from './MoveBookmarkDialog.vue'; // Import the dialog component

const props = defineProps({
  slug: String,       // slug ของอาหาร (now used as recipe_id)
  title: String,      // ชื่ออาหาร
  image: String,      // รูปภาพของอาหาร
  description: String // คำบรรยายของอาหาร
});

const authStore = useAuthStore();
const router = useRouter();
const isBookmarked = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const showMoveDialog = ref(false); // State for showing the modal
const currentFolderId = ref(null);
const bookmarkId = ref(null); // Store the bookmark ID
const rating = ref(0);

// Watch authentication state and reload bookmark status if it changes
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated && props.slug) {
    loadBookmarkState();
  } else if (!isAuthenticated) {
    isBookmarked.value = false;
    currentFolderId.value = null;
    bookmarkId.value = null;
    rating.value = 0; // Reset rating
  }
});

// Load bookmark state
const loadBookmarkState = async () => {
  if (!authStore.isAuthenticated || !props.slug) {
    isBookmarked.value = false;
    return;
  }
  
  try {
    isLoading.value = true;
    errorMessage.value = '';
    const response = await bookmarkService.checkBookmark(props.slug);
    isBookmarked.value = response.is_bookmarked;
    currentFolderId.value = response.folder_id || null;
    bookmarkId.value = response.bookmark_id || null; // Set the bookmark ID
    rating.value = response.rating || 0; // Set the rating value
    
    // Debug log to check the response
    console.log("Bookmark check response:", response);
    
    // If we know we're bookmarked but don't have a bookmark ID, fetch it
    if (isBookmarked.value && !bookmarkId.value) {
      await fetchBookmarkId();
    }
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    errorMessage.value = 'Could not check bookmark status';
    if (error.response?.status === 401) {
      authStore.logout();
    }
  } finally {
    isLoading.value = false;
  }
};

// Add this new function to fetch the bookmark ID if needed
const fetchBookmarkId = async () => {
  try {
    const bookmarks = await bookmarkService.getBookmarks();
    const bookmark = bookmarks.find(b => b.recipe_id === props.slug);
    if (bookmark) {
      bookmarkId.value = bookmark.bookmark_id;
      console.log("Found bookmark ID:", bookmarkId.value);
    }
  } catch (error) {
    console.error("Error fetching bookmark ID:", error);
  }
};

// Toggle bookmark status
const toggleBookmark = async () => {
  errorMessage.value = '';
  
  if (!authStore.isAuthenticated) {
    localStorage.setItem('bookmarkAfterLogin', JSON.stringify({
      slug: props.slug,
      action: 'add'
    }));
    router.push('/login');
    return;
  }
  
  try {
    isLoading.value = true;
    
    if (isBookmarked.value) {
      await bookmarkService.removeBookmark(props.slug);
      isBookmarked.value = false;
      currentFolderId.value = null;
      bookmarkId.value = null;
      rating.value = 0; // Reset rating
    } else {
      const response = await bookmarkService.addBookmark(props.slug);
      isBookmarked.value = true;
      bookmarkId.value = response.bookmark_id; // Set the bookmark ID after adding
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    errorMessage.value = 'Failed to update bookmark';
    if (error.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    }
  } finally {
    isLoading.value = false;
  }
};

// Handle moving bookmark to a folder
const handleMove = async ({ bookmarkId, folderId }) => {
  try {
    isLoading.value = true;
    await folderService.moveBookmark(bookmarkId, folderId);
    currentFolderId.value = folderId;
    showMoveDialog.value = false;
  } catch (error) {
    console.error('Error moving bookmark:', error);
    errorMessage.value = 'Failed to move bookmark';
  } finally {
    isLoading.value = false;
  }
};

// Rate bookmark
const rateBookmark = async (newRating) => {
  try {
    await bookmarkService.rateBookmark(props.slug, newRating); // Pass recipe_id (slug)
    rating.value = newRating;
  } catch (error) {
    console.error('Error rating bookmark:', error);
  }
};

onMounted(() => {
  if (props.slug) {
    loadBookmarkState();
  }
});
</script>

<template>
  <div>
    <button 
      @click="toggleBookmark" 
      class="text-red-500 transition-colors flex items-center"
      :disabled="isLoading"
    >
      <span v-if="isLoading">⏳</span>
      <span v-else>{{ isBookmarked ? '❤️ Bookmarked' : '🤍 Add to Bookmark' }}</span>
    </button>
    
    <button 
      v-if="isBookmarked" 
      @click="showMoveDialog = true" 
      class="ml-2 text-blue-500 hover:text-blue-700 text-sm"
    >
      Move to Folder
    </button>
    
    <div v-if="errorMessage" class="text-sm text-red-500 mt-1">{{ errorMessage }}</div>
    
    <!-- Move Bookmark Dialog -->
    <MoveBookmarkDialog 
      :is-open="showMoveDialog"
      :bookmark-id="bookmarkId"
      :current-folder-id="currentFolderId"
      @close="showMoveDialog = false"
      @move="handleMove"
    />
    
    <div v-if="isBookmarked" class="mt-2">
      <span class="mr-2">Rate:</span>
      <div class="inline-flex">
        <button 
          v-for="star in 5" 
          :key="star" 
          @click="rateBookmark(star)"
          class="text-xl px-1 focus:outline-none"
          :class="star <= rating ? 'text-yellow-500' : 'text-gray-300'"
        >
          ★
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:hover:not(:disabled) {
  color: #f56565;
}
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.text-yellow-500 {
  color: #f59e0b;
}

.text-gray-300 {
  color: #d1d5db;
}
</style>

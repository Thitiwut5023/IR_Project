<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { bookmarkService, folderService } from '@/services/api';
import { useRouter } from 'vue-router';
import { ChevronDown } from 'lucide-vue-next';

// กำหนด props สำหรับรับข้อมูลจาก parent component
const props = defineProps({
  slug: String,       // slug ของอาหาร (now used as recipe_id)
  title: String,      // ชื่ออาหาร
  image: String,      // รูปภาพของอาหาร
  description: String,// คำบรรยายของอาหาร
});

// Reference to auth store and router
const authStore = useAuthStore();
const router = useRouter();
// สร้าง state สำหรับเก็บสถานะของ bookmark
const isBookmarked = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const showFolderDropdown = ref(false);
const folders = ref([]);
const currentFolderId = ref(null);
const dropdownRef = ref(null);
const buttonRef = ref(null);

// Watch authentication state and reload bookmark status if it changes
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated && props.slug) {
    loadBookmarkState();
    loadFolders();
  } else if (!isAuthenticated) {
    isBookmarked.value = false;
    currentFolderId.value = null;
  }
});

// ฟังก์ชันในการโหลดสถานะ bookmark จาก API
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
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    errorMessage.value = 'Could not check bookmark status';
    // Handle token expiration - if we get 401, logout and redirect
    if (error.response?.status === 401) {
      authStore.logout();
    }
  } finally {
    isLoading.value = false;
  }
};

// Load available folders
const loadFolders = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    const response = await folderService.getFolders();
    folders.value = response.folders || [];
  } catch (error) {
    console.error('Error loading folders:', error);
  }
};

// ฟังก์ชันสำหรับสลับสถานะ bookmark เมื่อผู้ใช้คลิก
const toggleBookmark = async (event, folderId = null) => {
  event.stopPropagation();
  errorMessage.value = '';
  
  // Close dropdown after action
  if (showFolderDropdown.value) {
    // Don't close dropdown immediately if we're switching folders
    if (folderId === undefined) {
      showFolderDropdown.value = false;
    }
  }
  
  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    // Store the current path to redirect back after login
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
      if (folderId !== undefined) {
        // Move to a different folder
        const bookmarks = await bookmarkService.getBookmarks();
        const bookmark = bookmarks.find(b => b.recipe_id === props.slug);
        
        if (bookmark) {
          await folderService.moveBookmark(bookmark.bookmark_id, folderId);
          currentFolderId.value = folderId;
          // Close dropdown after successful folder change
          showFolderDropdown.value = false;
        }
      } else {
        // Remove bookmark
        await bookmarkService.removeBookmark(props.slug);
        isBookmarked.value = false;
        currentFolderId.value = null;
      }
    } else {
      // Add bookmark
      await bookmarkService.addBookmark(props.slug, folderId);
      isBookmarked.value = true;
      currentFolderId.value = folderId;
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    errorMessage.value = 'Failed to update bookmark';
    // Handle token expiration
    if (error.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    }
  } finally {
    isLoading.value = false;
  }
};

// Toggle dropdown visibility safely
const toggleDropdown = (event) => {
  event.stopPropagation();
  showFolderDropdown.value = !showFolderDropdown.value;
};

// Improved close dropdown when clicking outside
const closeDropdown = (event) => {
  // Check if dropdown is open and click is outside dropdown and button
  if (
    showFolderDropdown.value && 
    dropdownRef.value && 
    buttonRef.value && 
    !dropdownRef.value.contains(event.target) && 
    !buttonRef.value.contains(event.target)
  ) {
    showFolderDropdown.value = false;
  }
};

// Set up and clean up event listeners properly
onMounted(() => {
  if (props.slug) {
    loadBookmarkState();
    if (authStore.isAuthenticated) {
      loadFolders();
    }
  }
  
  // Add event listener after the component is mounted
  nextTick(() => {
    document.addEventListener('click', closeDropdown);
  });
});

// Clean up event listener on component unmount
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<template>
  <div class="relative" @click.stop>
    <div v-if="isBookmarked" class="flex items-center space-x-1">
      <button 
        @click="toggleBookmark($event)"
        class="text-red-500 transition-colors flex items-center"
        :disabled="isLoading"
      >
        <span v-if="isLoading">⏳</span>
        <span v-else>❤️</span>
        Bookmarked
      </button>
      
      <button 
        ref="buttonRef"
        @click="toggleDropdown"
        class="p-1 rounded hover:bg-gray-100"
      >
        <ChevronDown class="h-4 w-4" />
      </button>
      
      <!-- Folder dropdown -->
      <div 
        v-if="showFolderDropdown" 
        ref="dropdownRef"
        class="absolute right-0 mt-2 top-full z-20 w-48 bg-white shadow-lg rounded-md overflow-hidden border border-gray-200"
      >
        <div class="py-1">
          <p class="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">
            SAVE TO FOLDER
          </p>
          
          <!-- Uncategorized option -->
          <button 
            @click="toggleBookmark($event, null)"
            class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
          >
            <span class="w-4 h-4 mr-2">{{ currentFolderId === null ? '✓' : '' }}</span>
            <span>Uncategorized</span>
          </button>
          
          <!-- Folder options -->
          <button 
            v-for="folder in folders"
            :key="folder.id"
            @click="toggleBookmark($event, folder.id)"
            class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
          >
            <span class="w-4 h-4 mr-2">{{ currentFolderId === folder.id ? '✓' : '' }}</span>
            <span>{{ folder.name }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <button 
      v-else
      @click="toggleBookmark($event)"
      class="text-gray-400 hover:text-red-500 transition-colors"
      :disabled="isLoading"
    >
      <span v-if="isLoading">⏳</span>
      <span v-else>🤍</span> 
      Add to Bookmark
    </button>
    
    <div v-if="errorMessage" class="text-sm text-red-500 mt-1">{{ errorMessage }}</div>
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
</style>

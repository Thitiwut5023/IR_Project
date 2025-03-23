<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { bookmarkService, folderService } from '@/services/api';
import FolderDialog from '@/components/FolderDialog.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import MoveBookmarkDialog from '@/components/MoveBookmarkDialog.vue';
import { FolderPlus, Edit2, Trash2, Move } from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();

// State variables
const bookmarks = ref([]);
const folders = ref([]);
const uncategorizedCount = ref(0);
const loading = ref(false);
const error = ref(null);
const currentFolderId = ref(null);

// Dialog states
const folderDialogOpen = ref(false);
const folderDialogMode = ref('create');
const currentFolder = ref(null);
const confirmDialogOpen = ref(false);
const folderToDelete = ref(null);
const moveDialogOpen = ref(false);
const bookmarkToMove = ref(null);

// Computed property for current folder name
const currentFolderName = computed(() => {
  if (currentFolderId.value === null) {
    return "All Bookmarks";
  }
  const folder = folders.value.find(f => f.id === currentFolderId.value);
  return folder ? folder.name : "Unknown Folder";
});

// Watch for authentication changes
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    loadFolders();
    loadBookmarks();
  } else {
    // Redirect to login if not authenticated
    router.push('/login');
  }
});

// Function to load folders from API
const loadFolders = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    loading.value = true;
    const response = await folderService.getFolders();
    folders.value = response.folders || [];
    uncategorizedCount.value = response.uncategorized_count || 0;
  } catch (err) {
    console.error('Error loading folders:', err);
    // Handle authentication error
    if (err.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    }
  } finally {
    loading.value = false;
  }
};

// Function to load bookmarks from API
const loadBookmarks = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    loading.value = true;
    error.value = null;
    const data = await bookmarkService.getBookmarks(currentFolderId.value);
    bookmarks.value = data.map(bookmark => ({
      id: bookmark.bookmark_id,
      recipe_id: bookmark.recipe_id,
      slug: bookmark.recipe_id,
      title: bookmark.recipe_name,
      description: bookmark.recipe_description,
      image: bookmark.recipe_image,
      folder_id: bookmark.folder_id,
      folder_name: bookmark.folder_name,
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

// Change current folder
const changeFolder = (folderId, isUncategorized = false) => {
  currentFolderId.value = isUncategorized ? null : folderId;
  loadBookmarks();
};

// Remove a bookmark
const removeBookmark = async (recipeId) => {
  try {
    loading.value = true;
    await bookmarkService.removeBookmark(recipeId);
    // Update the bookmarks list after successful deletion
    bookmarks.value = bookmarks.value.filter(bookmark => bookmark.recipe_id !== recipeId);
    // Reload folders to update counts
    loadFolders();
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

// Open folder dialog
const openFolderDialog = (mode = 'create', folder = null) => {
  folderDialogMode.value = mode;
  currentFolder.value = folder;
  folderDialogOpen.value = true;
};

// Handle folder save
const handleFolderSave = async (folderData) => {
  try {
    loading.value = true;
    
    if (folderDialogMode.value === 'create') {
      await folderService.createFolder(folderData.name, folderData.description);
    } else {
      await folderService.updateFolder(currentFolder.value.id, folderData);
    }
    
    // Close dialog and reload folders
    folderDialogOpen.value = false;
    await loadFolders();
  } catch (err) {
    console.error('Error saving folder:', err);
    alert(`Failed to ${folderDialogMode.value} folder. ${err.response?.data?.error || ''}`);
    
    // Handle authentication error
    if (err.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    }
  } finally {
    loading.value = false;
  }
};

// Open confirm delete dialog
const openConfirmDeleteDialog = (folder) => {
  folderToDelete.value = folder;
  confirmDialogOpen.value = true;
};

// Handle folder deletion
const handleFolderDelete = async () => {
  if (!folderToDelete.value) return;
  
  try {
    loading.value = true;
    await folderService.deleteFolder(folderToDelete.value.id);
    
    // If we're viewing the deleted folder, go back to all bookmarks
    if (currentFolderId.value === folderToDelete.value.id) {
      currentFolderId.value = null;
    }
    
    // Reload data and close dialog
    await Promise.all([loadFolders(), loadBookmarks()]);
    confirmDialogOpen.value = false;
  } catch (err) {
    console.error('Error deleting folder:', err);
    alert('Failed to delete folder. Please try again.');
    
    // Handle authentication error
    if (err.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    }
  } finally {
    loading.value = false;
  }
};

// Open move bookmark dialog
const openMoveDialog = (bookmark) => {
  console.log("Opening move dialog for bookmark:", bookmark); // Debug log
  bookmarkToMove.value = bookmark;
  moveDialogOpen.value = true;
};

// Handle bookmark move
const handleBookmarkMove = async ({ bookmarkId, folderId }) => {
  console.log("Moving bookmark:", bookmarkId, "to folder:", folderId); // Debug log
  try {
    loading.value = true;
    await folderService.moveBookmark(bookmarkId, folderId);
    
    // Reload data and close dialog
    await Promise.all([loadFolders(), loadBookmarks()]);
    moveDialogOpen.value = false;
  } catch (err) {
    console.error('Error moving bookmark:', err);
    alert('Failed to move bookmark. Please try again.');
    
    // Handle authentication error
    if (err.response?.status === 401) {
      authStore.logout();
      router.push('/login');
    }
  } finally {
    loading.value = false;
  }
};

// Load data when the page is loaded
onMounted(() => {
  if (authStore.isAuthenticated) {
    loadFolders();
    loadBookmarks();
  }
});

const rankedFolders = ref([]);
const loadingRankings = ref(false);

const loadRankedFolders = async () => {
  try {
    loadingRankings.value = true;
    // Get the raw ranked folders data
    const rawRankedFolders = await folderService.getRankedFolders();
    
    // Process the data to include average scores
    rankedFolders.value = rawRankedFolders.map(folder => {
      // Get bookmark count in this folder
      const folderInfo = folders.value.find(f => f.id === folder.id);
      const bookmarkCount = folderInfo ? folderInfo.bookmark_count : 0;
      
      // Calculate average score (max 5)
      let averageScore = 0;
      if (bookmarkCount > 0 && folder.total_score > 0) {
        averageScore = Math.min(5, folder.total_score / bookmarkCount);
      }
      
      return {
        ...folder,
        bookmark_count: bookmarkCount,
        average_score: averageScore.toFixed(1) // Format to 1 decimal place
      };
    });
    
    // Sort by average score instead of total score
    rankedFolders.value.sort((a, b) => b.average_score - a.average_score);
  } catch (error) {
    console.error('Error loading ranked folders:', error);
  } finally {
    loadingRankings.value = false;
  }
};

// Make sure we load folders first, then ranked folders
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await loadFolders();
    await loadBookmarks();
    loadRankedFolders();
  }
});
</script>

<template>
  <div class="my-bookmarks py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl font-extrabold mb-2 text-gray-900 text-center">My Bookmarks</h2>
      <p class="text-lg mb-8 text-gray-600 text-center">Your saved favorite recipes.</p>

      <div class="flex flex-col md:flex-row gap-6">
        <!-- Folders Sidebar -->
        <div class="md:w-1/4 bg-white rounded-lg shadow p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Folders</h3>
            <button 
              @click="openFolderDialog('create')"
              class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              title="Add new folder"
            >
              <FolderPlus class="h-4 w-4" />
            </button>
          </div>
          
          <div class="space-y-2">
            <!-- All Bookmarks Option -->
            <div 
              @click="changeFolder(null)"
              class="p-3 rounded-md cursor-pointer flex justify-between items-center"
              :class="currentFolderId === null && !uncategorizedOnly ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'"
            >
              <span>All Bookmarks</span>
              <span class="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-full">
                {{ bookmarks.length }}
              </span>
            </div>
            
            <!-- Uncategorized Option - Fixed to navigate properly -->
            <div 
              @click="changeFolder(null, true)"
              class="p-3 rounded-md cursor-pointer flex justify-between items-center hover:bg-gray-100"
            >
              <span>Uncategorized</span>
              <span class="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-full">
                {{ uncategorizedCount }}
              </span>
            </div>
            
            <!-- Folder List -->
            <div 
              v-for="folder in folders" 
              :key="folder.id"
              class="p-3 rounded-md cursor-pointer flex justify-between items-center"
              :class="currentFolderId === folder.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'"
            >
              <div @click="changeFolder(folder.id)" class="flex-grow">
                <span>{{ folder.name }}</span>
                <span class="ml-2 bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded-full">
                  {{ folder.bookmark_count }}
                </span>
              </div>
              <div class="flex space-x-1">
                <button 
                  @click.stop="openFolderDialog('edit', folder)"
                  class="p-1 text-gray-500 hover:text-blue-600"
                  title="Edit folder"
                >
                  <Edit2 class="h-4 w-4" />
                </button>
                <button 
                  @click.stop="openConfirmDeleteDialog(folder)"
                  class="p-1 text-gray-500 hover:text-red-600"
                  title="Delete folder"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <!-- Empty state for folders -->
            <div v-if="folders.length === 0" class="text-center p-4 text-gray-500">
              No folders yet. Create one to organize your bookmarks!
            </div>
          </div>
        </div>
        
        <!-- Bookmarks Main Content -->
        <div class="md:w-3/4">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-xl font-semibold mb-6">{{ currentFolderName }}</h3>
            
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
              <p class="text-xl">No bookmarked recipes found in this folder!</p>
              <RouterLink to="/" class="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                Browse Recipes
              </RouterLink>
            </div>

            <!-- Show bookmarked recipes -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="bookmark in bookmarks" :key="bookmark.id" class="w-full">
                <div class="card bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                  <!-- Image and title -->
                  <RouterLink :to="`/food/${bookmark.slug}`">
                    <img :src="bookmark.image" :alt="bookmark.title" class="w-full h-48 object-cover" />
                    <div class="p-4">
                      <h4 class="text-lg font-semibold text-gray-900 line-clamp-1">
                        {{ bookmark.title }}
                      </h4>
                      <p class="text-sm text-gray-600 line-clamp-2 h-12 mb-2">
                        {{ bookmark.description }}
                      </p>
                      
                      <!-- Folder badge if in a folder -->
                      <div v-if="bookmark.folder_name" class="mb-2">
                        <span class="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {{ bookmark.folder_name }}
                        </span>
                      </div>
                      
                      <span class="text-xs text-gray-500">
                        Saved on: {{ bookmark.createdAt }}
                      </span>
                    </div>
                  </RouterLink>
                  
                  <!-- Actions -->
                  <div class="p-3 border-t border-gray-100 flex justify-between">
                    <button 
                      @click="openMoveDialog(bookmark)" 
                      class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <Move class="h-3 w-3 mr-1" />
                      Move
                    </button>
                    <button 
                      @click="removeBookmark(bookmark.recipe_id)" 
                      class="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Folder Dialog -->
  <FolderDialog 
    :is-open="folderDialogOpen"
    :mode="folderDialogMode"
    :folder="currentFolder"
    @close="folderDialogOpen = false"
    @save="handleFolderSave"
  />
  
  <!-- Confirm Delete Dialog -->
  <ConfirmDialog 
    :is-open="confirmDialogOpen"
    title="Delete Folder"
    :message="`Are you sure you want to delete the folder '${folderToDelete?.name || ''}'? All bookmarks will be moved to 'Uncategorized'.`"
    confirm-text="Delete"
    @confirm="handleFolderDelete"
    @cancel="confirmDialogOpen = false"
  />
  
  <!-- Move Bookmark Dialog -->
  <MoveBookmarkDialog 
    :is-open="moveDialogOpen"
    :bookmark-id="bookmarkToMove?.id" 
    :current-folder-id="bookmarkToMove?.folder_id"
    @close="moveDialogOpen = false"
    @move="handleBookmarkMove"
  />

  <!-- Update Folder Rankings section with average scores -->
  <div class="mt-8 bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
    <h3 class="text-xl font-semibold mb-4">Folder Rankings</h3>
    <div v-if="loadingRankings" class="text-center py-4">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
      <p class="mt-2">Loading rankings...</p>
    </div>
    <div v-else-if="rankedFolders.length === 0" class="text-gray-500 text-center py-4">
      No folders with ratings yet
    </div>
    <ul v-else class="space-y-3">
      <li v-for="(folder, index) in rankedFolders" :key="folder.id" 
          class="p-4 border rounded-lg flex justify-between items-center"
          :class="{'bg-yellow-50': index === 0, 'bg-gray-50': index === 1, 'bg-orange-50': index === 2}">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded-full font-bold">
            {{ index + 1 }}
          </span>
          <div>
            <span class="font-bold text-lg">{{ folder.name }}</span>
            <p class="text-sm text-gray-500">{{ folder.bookmark_count }} bookmarks</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex">
            <span v-for="i in 5" :key="i" class="text-xl"
                  :class="i <= Math.round(folder.average_score) ? 'text-yellow-500' : 'text-gray-300'">★</span>
          </div>
          <span class="font-semibold ml-2">{{ folder.average_score }}/5</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.my-bookmarks {
  background-color: #f9fafb;
  min-height: calc(100vh - 64px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.text-yellow-500 {
  color: #f59e0b;
}

.text-gray-300 {
  color: #d1d5db;
}
</style>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { folderService } from '@/services/api';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  bookmarkId: {
    type: [Number, String],  // Accept both number and string IDs
    default: null
  },
  currentFolderId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['close', 'move']);

const folders = ref([]);
const selectedFolderId = ref(null);
const loading = ref(false);
const error = ref('');

// Watch for dialog open to load folders
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    console.log("Dialog opened with bookmarkId:", props.bookmarkId, "currentFolderId:", props.currentFolderId); // Debug log
    selectedFolderId.value = props.currentFolderId;
    await loadFolders();
  }
});

// Load folders from API
const loadFolders = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await folderService.getFolders();
    folders.value = response.folders || [];
  } catch (err) {
    console.error('Error loading folders:', err);
    error.value = 'Failed to load folders. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Handle move bookmark
const handleMove = () => {
  if (!props.bookmarkId) {
    console.error("Missing bookmarkId:", props.bookmarkId);
    error.value = 'Bookmark ID not available. Please try refreshing the page.';
    return;
  }

  console.log("Emitting move event with bookmarkId:", props.bookmarkId, "folderId:", selectedFolderId.value); // Debug log
  emit('move', {
    bookmarkId: props.bookmarkId, // Pass the correct bookmarkId
    folderId: selectedFolderId.value
  });
};

// Handle close dialog
const handleClose = () => {
  emit('close');
};

onMounted(() => {
  if (props.isOpen) {
    loadFolders();
  }
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
      <!-- Dialog Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-900">
          Move to Folder
        </h3>
        <button 
          @click="handleClose"
          class="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center my-4">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
      
      <!-- Dialog Content -->
      <div v-else>
        <div class="mb-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Folder
            </label>
            
            <!-- Option for uncategorized (no folder) -->
            <div class="mb-2">
              <label class="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="folder"
                  :value="null"
                  v-model="selectedFolderId"
                  class="mr-2"
                />
                <span>Uncategorized</span>
              </label>
            </div>
            
            <!-- List of folders -->
            <div v-for="folder in folders" :key="folder.id" class="mb-2">
              <label class="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="folder"
                  :value="folder.id"
                  v-model="selectedFolderId"
                  class="mr-2"
                />
                <span>{{ folder.name }}</span>
                <span class="text-xs text-gray-500 ml-2">({{ folder.bookmark_count }} items)</span>
              </label>
            </div>
            
            <!-- Message when no folders exist -->
            <p v-if="folders.length === 0" class="text-gray-500 text-center py-4">
              No folders available. Create a folder first.
            </p>
          </div>
        </div>
        
        <!-- Dialog Actions -->
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="handleClose"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleMove"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Move
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

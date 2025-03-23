<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  folder: {
    type: Object,
    default: () => null
  },
  mode: {
    type: String,
    default: 'create' // 'create' or 'edit'
  }
});

const emit = defineEmits(['close', 'save']);

// Form data
const folderName = ref('');
const folderDescription = ref('');
const error = ref('');

// Reset form fields - moved up before it's used in watch
const resetForm = () => {
  folderName.value = '';
  folderDescription.value = '';
  error.value = '';
};

// Watch for changes in the folder prop to update the form
watch(() => props.folder, (newFolder) => {
  if (newFolder && props.mode === 'edit') {
    folderName.value = newFolder.name || '';
    folderDescription.value = newFolder.description || '';
  } else {
    resetForm();
  }
}, { immediate: true });

// Watch for dialog open/close to reset form
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.mode === 'create') {
    resetForm();
  }
});

// Handle form submission
const handleSubmit = () => {
  // Validate form
  if (!folderName.value.trim()) {
    error.value = 'Folder name is required';
    return;
  }

  // Emit save event with folder data
  emit('save', {
    name: folderName.value.trim(),
    description: folderDescription.value.trim()
  });
};

// Close dialog
const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
      <!-- Dialog Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-900">
          {{ mode === 'create' ? 'Create New Folder' : 'Edit Folder' }}
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
      
      <!-- Dialog Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Folder Name Field -->
        <div class="mb-4">
          <label for="folder-name" class="block text-sm font-medium text-gray-700 mb-1">
            Folder Name
          </label>
          <input
            id="folder-name"
            v-model="folderName"
            type="text"
            placeholder="Enter folder name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <!-- Folder Description Field -->
        <div class="mb-6">
          <label for="folder-description" class="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="folder-description"
            v-model="folderDescription"
            placeholder="Enter folder description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>
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
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {{ mode === 'create' ? 'Create Folder' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

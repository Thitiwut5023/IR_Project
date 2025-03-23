<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmClass: {
    type: String,
    default: 'bg-red-600 hover:bg-red-700'
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
      <!-- Dialog Header -->
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        {{ title }}
      </h3>
      
      <!-- Dialog Content -->
      <p class="text-gray-700 mb-6">{{ message }}</p>
      
      <!-- Dialog Actions -->
      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          @click="handleConfirm"
          :class="`px-4 py-2 text-white rounded-md ${confirmClass}`"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

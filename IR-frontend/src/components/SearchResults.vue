<script setup>
import { ref, computed } from 'vue';
import Card from '@/components/Card.vue';

// Props passed from parent component
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  searchQuery: {
    type: String,
    default: ''
  }
});

// Computed property to sort items by score (if available)
const sortedItems = computed(() => {
  if (!props.items || props.items.length === 0) {
    return [];
  }

  // Check if items have score property for sorting
  if (props.items[0].score !== undefined) {
    // Return copy of items sorted by score descending
    return [...props.items].sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  // If no score, return items as is
  return props.items;
});
</script>

<template>
  <div>
    <!-- Loading indicator -->
    <div v-if="loading" class="col-span-full text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      <p class="mt-2">Loading results...</p>
    </div>

    <!-- No results message -->
    <div v-else-if="items.length === 0" class="col-span-full text-center py-8">
      <p class="text-lg text-gray-600">No results found for "{{ searchQuery }}"</p>
      <p class="text-sm text-gray-500 mt-2">Try using different keywords or check for spelling.</p>
    </div>

    <!-- Results grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
      <!-- Loop through the items and display them -->
      <div v-for="(item, index) in sortedItems" :key="`${index}-${item._id || item.id}`" class="w-full">
        <Card 
          :id="item._id || item.id"
          :image="item.Images || item.image" 
          :title="item.Name || item.name" 
          :description="item.Description || item.description"
          :category="item.category || item.RecipeCategory" 
        />
      </div>
    </div>
  </div>
</template>

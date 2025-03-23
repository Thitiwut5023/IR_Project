<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { bookmarkService } from '@/services/api';
import { useRouter } from 'vue-router';

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

// Watch authentication state and reload bookmark status if it changes
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated && props.slug) {
    loadBookmarkState();
  } else if (!isAuthenticated) {
    isBookmarked.value = false;
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
    isBookmarked.value = await bookmarkService.checkBookmark(props.slug);
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

// ฟังก์ชันสำหรับสลับสถานะ bookmark เมื่อผู้ใช้คลิก
const toggleBookmark = async (event) => {
  event.stopPropagation();
  errorMessage.value = '';
  
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
      // Remove bookmark
      await bookmarkService.removeBookmark(props.slug);
      isBookmarked.value = false;
    } else {
      // Add bookmark
      await bookmarkService.addBookmark(props.slug);
      isBookmarked.value = true;
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
      class="transition-colors" 
      :class="isBookmarked ? 'text-red-500' : 'text-gray-400'"
      :disabled="isLoading"
    >
      <span v-if="isLoading">⏳</span>
      <span v-else-if="isBookmarked">❤️</span>
      <span v-else>🤍</span> 
      {{ isBookmarked ? 'Bookmarked' : 'Add to Bookmark' }}
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

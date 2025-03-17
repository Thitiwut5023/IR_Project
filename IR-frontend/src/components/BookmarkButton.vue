<script setup>
import { ref, onMounted } from 'vue';

// กำหนด props สำหรับรับข้อมูลจาก parent component
const props = defineProps({
  slug: String,       // slug ของอาหาร
  title: String,      // ชื่ออาหาร
  image: String,      // รูปภาพของอาหาร
  description: String,// คำบรรยายของอาหาร
  category: String    // หมวดหมู่ของอาหาร
});

// สร้าง state สำหรับเก็บสถานะของ bookmark
const isBookmarked = ref(false);

// ฟังก์ชันในการโหลดสถานะ bookmark จาก localStorage
const loadBookmarkState = () => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  // ตรวจสอบว่า slug นี้ถูก bookmark หรือไม่
  isBookmarked.value = bookmarks.some(bookmark => bookmark.slug === props.slug);
};

// ฟังก์ชันในการบันทึกสถานะ bookmark ลงใน localStorage
const saveBookmarkState = () => {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  const bookmark = { slug: props.slug, title: props.title, image: props.image, description: props.description, category: props.category };

  if (isBookmarked.value) {
    // ถ้าทำการบันทึก bookmark เพิ่มรายการใหม่เข้าไป
    if (!bookmarks.some(b => b.slug === props.slug)) {
      bookmarks.push(bookmark);
    }
  } else {
    // ถ้าลบ bookmark ออกให้ลบรายการที่มี slug เดียวกัน
    bookmarks = bookmarks.filter(b => b.slug !== props.slug);
  }
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};

// ฟังก์ชันสำหรับสลับสถานะ bookmark เมื่อผู้ใช้คลิก
const toggleBookmark = (event) => {
  event.stopPropagation();
  isBookmarked.value = !isBookmarked.value;
  saveBookmarkState();
};

onMounted(() => {
  loadBookmarkState();
});
</script>

<template>
  <button @click="toggleBookmark" class="transition-colors" :class="isBookmarked ? 'text-red-500' : 'text-gray-400'">
    <span v-if="isBookmarked">❤️</span>
    <span v-else>🤍</span> Add to Bookmark
  </button>
</template>

<style scoped>
button:hover {
  color: #f56565;
}
</style>

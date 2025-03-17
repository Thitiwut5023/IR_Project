<script setup>
import { RouterLink } from 'vue-router';
import SearchBox from '@/components/SearchBox.vue';
import Card from '@/components/Card.vue';

const items = [
  {
    name: 'neapolitan-pizza-with-fresh-basil',
    image: 'https://via.placeholder.com/400x300',
    title: 'Neapolitan Pizza with Fresh Basil',
    description: 'Delicious pizza with fresh basil and mozzarella cheese.',
    category: 'Italian'
  },
  {
    name: 'healthy-vegetable-salad-bowl',
    image: 'https://via.placeholder.com/400x300',
    title: 'Healthy Vegetable Salad Bowl',
    description: 'A healthy vegetable salad with fresh ingredients.',
    category: 'Healthy'
  },
  {
    name: 'pancakes-with-berries-and-maple-syrup',
    image: 'https://via.placeholder.com/400x300',
    title: 'Pancakes with Berries and Maple Syrup',
    description: 'Fluffy pancakes topped with fresh berries and syrup.',
    category: 'Breakfast'
  },
  {
    name: 'spaghetti-carbonara',
    image: 'https://via.placeholder.com/400x300',
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta with creamy sauce and pancetta.',
    category: 'Italian'
  },
  {
    name: 'vegan-buddha-bowl',
    image: 'https://via.placeholder.com/400x300',
    title: 'Vegan Buddha Bowl',
    description: 'A colorful and healthy bowl with quinoa, veggies, and hummus.',
    category: 'Vegan'
  },
  {
    name: 'french-toast-with-berries',
    image: 'https://via.placeholder.com/400x300',
    title: 'French Toast with Berries',
    description: 'Crispy French toast served with fresh berries and syrup.',
    category: 'Breakfast'
  }
];
</script>

<template>
  <div class="home flex flex-col items-center bg-gradient-to-b from-gray-200 via-gray-300 to-white py-20">
    <!-- Main Content -->
    <div class="text-center text-gray-800 max-w-7xl mx-auto px-4">
      <h2 class="text-5xl font-extrabold mb-4 animate-fade-in text-gray-900">
        Find & Save Your Next Culinary Inspiration
      </h2>
      <p class="text-lg mb-6 animate-fade-in text-gray-600">
        Discover recipes, save your favorites, and get inspired for your next kitchen adventure.
      </p>

      <!-- Use SearchBox Component -->
      <SearchBox />

      <!-- Browse Categories -->
      <h3 class="text-xl text-gray-800 font-semibold mb-4">Browse by Category</h3>
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <button class="bg-gray-100 text-gray-800 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200">Quick Dinner</button>
        <button class="bg-gray-100 text-gray-800 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200">Vegetarian</button>
        <button class="bg-gray-100 text-gray-800 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200">Desserts</button>
        <button class="bg-gray-100 text-gray-800 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200">Gluten Free</button>
      </div>

      <!-- Card Container with 4 columns -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
        <div v-for="(item, index) in items" :key="index" class="w-full">
          <!-- RouterLink ครอบแค่รูปภาพและชื่ออาหาร -->
          <div :to="`/food/${item.name}`">
            <Card 
              :image="item.image" 
              :title="item.title" 
              :description="item.description" 
              :category="item.category"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* สามารถเพิ่มสไตล์เพิ่มเติมได้ตามต้องการ */
</style>

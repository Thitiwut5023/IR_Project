import axios from 'axios';

// Create a base axios instance for authenticated requests
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Create a public API instance without auth requirements
export const publicApi = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    // Make sure headers object exists and set the Authorization header with Bearer prefix
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Handle unauthorized error (e.g., token expired)
      console.log('Authorization error:', error.response.data);
      // Could redirect to login or refresh token here
    }
    return Promise.reject(error);
  }
);

export default api;

// Bookmark related API calls
export const bookmarkService = {
  // Get all bookmarks for logged in user
  getBookmarks: async () => {
    try {
      const response = await api.get('/bookmarks');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  },
  
  // Add a bookmark
  addBookmark: async (recipeId: string) => {
    try {
      const response = await api.post('/bookmarks', { recipe_id: recipeId });
      return response.data;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },
  
  // Remove a bookmark
  removeBookmark: async (recipeId: string) => {
    try {
      const response = await api.delete(`/bookmarks/${recipeId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },
  
  // Check if a recipe is bookmarked - handle gracefully when not logged in
  checkBookmark: async (recipeId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false; // Not bookmarked if not logged in
      }
      
      const response = await api.get(`/bookmarks/check/${recipeId}`);
      return response.data.is_bookmarked;
    } catch (error) {
      // Specifically handle authentication errors differently
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('User not authenticated for bookmark check');
        return false; // Not bookmarked if not authenticated
      }
      console.error('Error checking bookmark status:', error);
      return false;
    }
  }
};

// Food search and detail API calls that don't require authentication
export const foodService = {
  search: async (query: string) => {
    try {
      const response = await publicApi.get(`/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  },
  
  getDetail: async (id: string) => {
    try {
      const response = await publicApi.get(`/food/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      throw error;
    }
  }
};

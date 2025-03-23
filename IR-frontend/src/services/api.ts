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
  getBookmarks: async (folderId?: number) => {
    try {
      let url = '/bookmarks';
      if (folderId !== undefined) {
        url += `?folder_id=${folderId}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  },
  
  // Add a bookmark with optional folder
  addBookmark: async (recipeId: string, folderId?: number) => {
    try {
      const payload: { recipe_id: string; folder_id?: number } = { 
        recipe_id: recipeId 
      };
      
      if (folderId !== undefined) {
        payload.folder_id = folderId;
      }
      
      const response = await api.post('/bookmarks', payload);
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
        return { is_bookmarked: false };
      }
      
      const response = await api.get(`/bookmarks/check/${recipeId}`);
      return response.data; // Return the full response which includes folder_id
    } catch (error) {
      // Specifically handle authentication errors differently
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('User not authenticated for bookmark check');
        return { is_bookmarked: false };
      }
      console.error('Error checking bookmark status:', error);
      return { is_bookmarked: false };
    }
  },

  // Rate a bookmark
  rateBookmark: async (recipeId: string, rating: number) => {
    try {
      const response = await api.put(`/bookmarks/${recipeId}/rate`, { rating });
      return response.data;
    } catch (error) {
      console.error('Error rating bookmark:', error);
      throw error;
    }
  }
};

// Folder related API calls
export const folderService = {
  // Get all folders
  getFolders: async () => {
    try {
      const response = await api.get('/folders');
      return response.data;
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
  },
  
  // Create a new folder
  createFolder: async (name: string, description?: string) => {
    try {
      const response = await api.post('/folders', { 
        name,
        description
      });
      return response.data;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  },
  
  // Update a folder
  updateFolder: async (folderId: number, data: { name?: string, description?: string }) => {
    try {
      const response = await api.put(`/folders/${folderId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error;
    }
  },
  
  // Delete a folder
  deleteFolder: async (folderId: number) => {
    try {
      const response = await api.delete(`/folders/${folderId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  },

  // Move bookmark to folder
  moveBookmark: async (bookmarkId: number | string, folderId: number | null) => {
    try {
      console.log("API: Moving bookmark ID:", bookmarkId, "to folder ID:", folderId); // Debug log
      const response = await api.put(`/bookmarks/${bookmarkId}/move`, {
        folder_id: folderId
      });
      return response.data;
    } catch (error) {
      console.error('Error moving bookmark:', error);
      throw error;
    }
  },

  // Get ranked folders
  getRankedFolders: async () => {
    try {
      const response = await api.get('/folders/rank');
      return response.data;
    } catch (error) {
      console.error('Error fetching ranked folders:', error);
      throw error;
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

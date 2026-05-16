import axios from 'axios';

// Use the VITE_API_URL environment variable for production, or fallback to relative/localhost
const API_URL = import.meta.env.VITE_API_URL || '/api'; 

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
import axios from 'axios';

// ✅ Change this to a relative path
// This tells the browser to use the current website's domain
const API_URL = '/api'; 

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
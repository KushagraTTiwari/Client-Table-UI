import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND;

export const fetchClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/clients`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch clients');
  }
};

export const createClient = async (client) => {
  try {
    const response = await axios.post(`${API_URL}/clients`, client);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create client');
  }
};
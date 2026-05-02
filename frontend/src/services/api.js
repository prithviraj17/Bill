import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Save delivery note to PostgreSQL
export const saveData = async (formData) => {
    try {
        await axios.post(`${API_BASE_URL}/delivery`, formData);
        alert('Saved to PostgreSQL!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to save data');
        throw error;
    }
};

// Create a new delivery note
export const createDeliveryNote = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/delivery`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Get all delivery notes
export const getAllDeliveryNotes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/delivery`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Get single delivery note by ID
export const getDeliveryNoteById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/delivery/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

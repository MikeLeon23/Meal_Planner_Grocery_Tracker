import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load .env explicitly

const router = express.Router();
const BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = process.env.SPOONACULAR_API_KEY;

console.log('spoonacular.fetching.js - Environment:', {
  SPOONACULAR_API_KEY: API_KEY ? 'Loaded' : 'Undefined',
  NODE_ENV: process.env.NODE_ENV,
});

router.get('/', async (req, res) => {
  try {
    if (!API_KEY) {
      console.error('API Key missing in environment variables');
      return res.status(500).json({ error: 'Server configuration error: API key missing' });
    }

    const { query } = req.query;
    const params = {
      number: 10,
      apiKey: API_KEY,
      sort: 'popularity',
      diet: 'vegetarian',
      maxCalories: 600,
    };
    if (query) params.query = query;

    const response = await axios.get(`${BASE_URL}/complexSearch`, { params });
    console.log('Spoonacular search response:', {
      status: response.status,
      resultsCount: response.data.results?.length || 0,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular search error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to fetch recipes',
    });
  }
});

router.get('/:id/information', async (req, res) => {
  try {
    if (!API_KEY) {
      console.error('API Key missing in environment variables');
      return res.status(500).json({ error: 'Server configuration error: API key missing' });
    }

    const response = await axios.get(`${BASE_URL}/${req.params.id}/information`, {
      params: { includeNutrition: false, apiKey: API_KEY },
    });

    console.log('Spoonacular recipe details response status:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular recipe details error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to fetch recipe details',
    });
  }
});

router.get('/:id/nutritionLabel', async (req, res) => {
  try {
    if (!API_KEY) {
      console.error('API Key missing in environment variables');
      return res.status(500).json({ error: 'Server configuration error: API key missing' });
    }

    const response = await axios.get(`${BASE_URL}/${req.params.id}/nutritionLabel`, {
      params: { apiKey: API_KEY },
    });

    console.log('Spoonacular nutrition response status:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular nutrition error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to fetch nutrition data',
    });
  }
});

export default router;
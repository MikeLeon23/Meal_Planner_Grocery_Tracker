import axios from 'axios';

class RecipeService {
  constructor() {
    this.baseUrl = 'https://api.spoonacular.com/recipes';
    // this.apiKey = process.env.SPOONACULAR_API_KEY;
    this.apiKey = "7deafd6e74474bb19586ff2c14434c8c"; // For testing purposes, replace with your actual API key
    if (!this.apiKey) {
      throw new Error('SPOONACULAR_API_KEY is not defined in .env');
    }
  }

  // Search recipes by cuisine, diet, ingredients, and dish types
  async getAllRecipes(query = '', diets = '', ingredients = '', dishTypes = '', number = 10) {
    try {
      const url = `${this.baseUrl}/complexSearch?apiKey=${this.apiKey}&query=${encodeURIComponent(query)}&diet=${encodeURIComponent(diets)}&includeIngredients=${encodeURIComponent(ingredients)}&type=${encodeURIComponent(dishTypes)}&number=${number}`;
      const response = await axios.get(url);
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
      return [];
    }
  }

  // Get detailed information for a specific recipe by ID
  async getRecipeInformation(id) {
    try {
      const url = `${this.baseUrl}/${id}/information?apiKey=${this.apiKey}`;
      const response = await axios.get(url);
      if (!response.data) {
        throw new Error(`Recipe not found for ID: ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe ${id}:`, error.message);
      return null;
    }
  }

  // Get nutrition label for a recipe by ID (returns HTML)
  async getNutritionLabel(id) {
    try {
      const url = `${this.baseUrl}/${id}/nutritionLabel?apiKey=${this.apiKey}`;
      const response = await axios.get(url);
      if (!response.data) {
        throw new Error(`No nutrition label found for recipe ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching nutrition label for ${id}:`, error.message);
      return null;
    }
  }
}

export default new RecipeService();
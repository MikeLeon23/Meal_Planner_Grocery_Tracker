import express from 'express';
import {
  createDailyMealPlan,
  getWeeklyMealPlan,
  // getPresetRecipes,
  searchSpoonacularRecipes,
  getSpoonacularRecipeDetails,
  getSpoonacularNutritionLabel,
  saveSpoonacularRecipe,
} from '../controllers/mealPlanner.controller.js';
import { getShoppingList, updateShoppingList } from '../controllers/shoppingList.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Meal Plan Routes
router.post('/meal-plans', protect, createDailyMealPlan);
router.get('/meal-plans/week', protect, getWeeklyMealPlan);

// Local Recipe Routes
// router.get('/recipes', protect, getPresetRecipes);

// Spoonacular Recipe Routes
router.get('/spoonacular/recipes', protect, searchSpoonacularRecipes);
router.get('/spoonacular/recipes/:id', protect, getSpoonacularRecipeDetails);
router.get('/spoonacular/recipes/:id/nutrition', protect, getSpoonacularNutritionLabel);
router.post('/spoonacular/recipes/:id/save', protect, saveSpoonacularRecipe);

// Shopping List Routes
router.get('/shopping-list', protect, getShoppingList);
router.put('/shopping-list', protect, updateShoppingList);

export default router;
import asyncHandler from 'express-async-handler';
import { DailyMealPlan, Meal, Recipe, Ingredient } from '../models/mealPlanner.model.js';

// @desc    Generate shopping list for a week
// @route   GET /api/shopping-list
// @access  Private
export const getShoppingList = asyncHandler(async (req, res) => {
  const today = new Date();
  const startDate = new Date(today.setDate(today.getDate() - today.getDay()));
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const mealPlans = await DailyMealPlan.find({
    user: req.user.id,
    date: {
      $gte: startDate.toISOString().split('T')[0],
      $lte: endDate.toISOString().split('T')[0],
    },
  }).populate({
    path: 'meals',
    populate: {
      path: 'recipes',
      populate: {
        path: 'ingredients',
      },
    },
  });

  // Aggregate ingredients
  const ingredientMap = new Map();
  for (const plan of mealPlans) {
    for (const meal of plan.meals) {
      for (const recipe of meal.recipes) {
        for (const ingredient of recipe.ingredients) {
          const key = `${ingredient.name}-${ingredient.unit}`;
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key);
            existing.quantity = (
              parseFloat(existing.quantity) + parseFloat(ingredient.quantity)
            ).toString();
            existing.price += ingredient.price;
          } else {
            ingredientMap.set(key, {
              name: ingredient.name,
              unit: ingredient.unit,
              quantity: ingredient.quantity,
              price: ingredient.price,
            });
          }
        }
      }
    }
  }

  const shoppingList = Array.from(ingredientMap.values());
  res.json(shoppingList);
});

// @desc    Update shopping list quantities
// @route   PUT /api/shopping-list
// @access  Private
export const updateShoppingList = asyncHandler(async (req, res) => {
  const { items } = req.body; // Array of { name, unit, quantity }

  if (!items || !Array.isArray(items)) {
    res.status(400);
    throw new Error('Please provide an array of items');
  }

  // Validate items
  for (const item of items) {
    if (!item.name || !item.unit || !item.quantity) {
      res.status(400);
      throw new Error('Each item must have name, unit, and quantity');
    }
  }

  // For simplicity, update quantities in the shopping list response
  // In a real app, you might persist changes to ingredients or a separate shopping list model
  res.json({ message: 'Quantities updated', items });
});
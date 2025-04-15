import asyncHandler from 'express-async-handler';
import { DailyMealPlan, Meal, Recipe, Ingredient } from '../models/mealPlanner.model.js';
import RecipeService from '../services/RecipeService.js';

// @desc    Create a daily meal plan
// @route   POST /api/meal-plans
// @access  Private
export const createDailyMealPlan = asyncHandler(async (req, res) => {
  const { date, meals } = req.body;

  if (!date || !meals || !Array.isArray(meals)) {
    res.status(400);
    throw new Error('Please provide date and meals array');
  }

  // Validate meals
  for (const meal of meals) {
    if (!meal.name || !meal.recipes || !Array.isArray(meal.recipes)) {
      res.status(400);
      throw new Error('Each meal must have a name and recipes array');
    }
    for (const recipe of meal.recipes) {
      if (
        !recipe.name ||
        !recipe.description ||
        !recipe.ingredients ||
        !Array.isArray(recipe.ingredients)
      ) {
        res.status(400);
        throw new Error('Each recipe must have name, description, and ingredients');
      }
      for (const ingredient of recipe.ingredients) {
        if (
          !ingredient.name ||
          !ingredient.quantity ||
          !ingredient.unit ||
          !ingredient.price ||
          !ingredient.calories
        ) {
          res.status(400);
          throw new Error('Each ingredient must have name, quantity, unit, price, and calories');
        }
      }
    }
  }

  // Create ingredients and meals
  const createdMeals = [];
  for (const meal of meals) {
    const createdRecipes = [];
    for (const recipe of meal.recipes) {
      const createdIngredients = await Ingredient.insertMany(recipe.ingredients);
      const recipeData = {
        name: recipe.name,
        description: recipe.description,
        ingredients: createdIngredients.map((ing) => ing._id),
      };
      const createdRecipe = await Recipe.create(recipeData);
      createdRecipes.push(createdRecipe._id);
    }
    const mealData = {
      name: meal.name,
      description: meal.description || '',
      recipes: createdRecipes,
    };
    const createdMeal = await Meal.create(mealData);
    createdMeals.push(createdMeal._id);
  }

  // Check if a DailyMealPlan for this date and user already exists
  let dailyMealPlan = await DailyMealPlan.findOne({
    date: date,
    user: req.user.id,
  });

  if (dailyMealPlan) {
    // If it exists, append the new meals to the existing document
    dailyMealPlan.meals.push(...createdMeals);
    dailyMealPlan.updatedAt = new Date(); // Update the updatedAt timestamp
    await dailyMealPlan.save();
  } else {
    // If it doesn't exist, create a new DailyMealPlan
    dailyMealPlan = await DailyMealPlan.create({
      date,
      meals: createdMeals,
      user: req.user.id,
    });
  }

  // Populate the meals, recipes, and ingredients for the response
  const populatedDailyMealPlan = await DailyMealPlan.findById(dailyMealPlan._id)
    .populate({
      path: 'meals',
      populate: {
        path: 'recipes',
        populate: {
          path: 'ingredients',
        },
      },
    });

  res.status(201).json(populatedDailyMealPlan);
});

// @desc    Get one-week meal plan
// @route   GET /api/meal-plans/week
// @access  Private
export const getWeeklyMealPlan = asyncHandler(async (req, res) => {
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
  })
    .populate({
      path: 'meals',
      populate: {
        path: 'recipes',
        populate: {
          path: 'ingredients',
        },
      },
    })
    .sort({ date: 1 });

  res.json(mealPlans);
});

// @desc    Search recipes via Spoonacular API
// @route   GET /api/meal-planner/spoonacular/recipes
// @access  Private
export const searchSpoonacularRecipes = asyncHandler(async (req, res) => {
  console.log('Query:', req.query); // Debugging output
  const { cuisines, diets, ingredients, dishTypes, number = 30 } = req.query; // Default to 30 recipes
  const recipes = await RecipeService.getAllRecipes(cuisines, diets, ingredients, dishTypes, number);
  res.json(recipes);
});

// @desc    Get Spoonacular recipe details by ID
// @route   GET /api/meal-planner/spoonacular/recipes/:id
// @access  Private
export const getSpoonacularRecipeDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const recipe = await RecipeService.getRecipeInformation(id);
  if (!recipe) {
    res.status(404);
    throw new Error(`Recipe not found for ID: ${id}`);
  }
  res.json(recipe);
});

// @desc    Get Spoonacular nutrition label by ID
// @route   GET /api/meal-planner/spoonacular/recipes/:id/nutrition
// @access  Private
export const getSpoonacularNutritionLabel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const label = await RecipeService.getNutritionLabel(id);
  if (!label) {
    res.status(404);
    throw new Error(`Nutrition label not found for ID: ${id}`);
  }
  res.send(label); // Send HTML directly
});

// @desc    Save Spoonacular recipe to local database
// @route   POST /api/meal-planner/spoonacular/recipes/:id/save
// @access  Private
export const saveSpoonacularRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const spoonacularRecipe = await RecipeService.getRecipeInformation(id);
  if (!spoonacularRecipe) {
    res.status(404);
    throw new Error(`Recipe not found for ID: ${id}`);
  }

  // Map Spoonacular ingredients to your Ingredient model
  const ingredients = await Promise.all(
    spoonacularRecipe.extendedIngredients.map(async (ing) => {
      // Check if ingredient exists
      let ingredient = await Ingredient.findOne({ name: ing.name });
      if (!ingredient) {
        ingredient = await Ingredient.create({
          name: ing.name,
          quantity: ing.amount.toString(),
          unit: ing.unit || 'unit',
          price: 1.0, // Default price (Spoonacular doesn’t provide)
          calories: 100, // Default (use nutrition API for accuracy if needed)
        });
      }
      return ingredient._id;
    })
  );

  // Create or update recipe
  let recipe = await Recipe.findOne({ name: spoonacularRecipe.title });
  if (recipe) {
    recipe.description = spoonacularRecipe.summary || spoonacularRecipe.title;
    recipe.ingredients = ingredients;
    await recipe.save();
  } else {
    recipe = await Recipe.create({
      name: spoonacularRecipe.title,
      description: spoonacularRecipe.summary || spoonacularRecipe.title,
      ingredients,
    });
  }

  res.status(201).json(recipe);
});
import mongoose from "mongoose";

const dailyMealPlanSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    meals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const mealSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // description: {
    //   type: String,
    //   required: true,
    // },
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const recipeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true,
      },
    ],
    image: { type: String },
    servings: { type: Number },
  },
  {
    timestamps: true,
  }
);

const ingredientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DailyMealPlan = mongoose.model("DailyMealPlan", dailyMealPlanSchema);
export const Meal = mongoose.model("Meal", mealSchema);
export const Recipe = mongoose.model("Recipe", recipeSchema);
export const Ingredient = mongoose.model("Ingredient", ingredientSchema);
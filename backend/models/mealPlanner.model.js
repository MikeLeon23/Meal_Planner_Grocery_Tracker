import mongoose from "mongoose";

const dailyMealPlanSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    meals: {
        type: Array,
        required: true,
        default: []
    },
}, {
    timestamps: true // automatically create fields for createdAt and updatedAt
});

const mealSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    recipes: {
        type: Array,
        required: true,
        default: []
    }
}, {
    timestamps: true
});

const recipeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: Array,
        required: true,
        default: []
    },
    image: { type: String }, // Optional
    servings: { type: Number }, // Optional
}, {
    timestamps: true
});

const ingredientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    calories: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export const DailyMealPlan = mongoose.model('DailyMealPlan', dailyMealPlanSchema);
export const Meal = mongoose.model('Meal', mealSchema);
export const Recipe = mongoose.model('Recipe', recipeSchema);
export const Ingredient = mongoose.model('Ingredient', ingredientSchema);
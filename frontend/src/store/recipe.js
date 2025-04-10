import { create } from "zustand";

export const useRecipeStore = create((set) => ({
    recipes: [],
    setRecipes: (recipes) => set({ recipes }),
    createRecipe: async (newRecipe) => {
        // to be implemented
    },
    fetchRecipes: async () => {
        // to be implemented
    },
    updateRecipe: async (pid, updatedRecipe) => {
        // to be implemented
    },
    deleteRecipe: async (pid) => {
        // to be implemented
    }
}));
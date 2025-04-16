import { createContext, useState } from 'react';
 
 export const RecipeContext = createContext();
 
 export const RecipeProvider = ({ children }) => {
   const [savedRecipes, setSavedRecipes] = useState([]);
 
   const toggleSaveRecipe = (recipeId) => {
     setSavedRecipes((prevSaved) => {
       const newSaved = prevSaved.includes(recipeId)
         ? prevSaved.filter((id) => id !== recipeId)
         : [...prevSaved, recipeId];
       console.log(
         `savedRecipes: [${newSaved.join(', ')}], ${
           prevSaved.includes(recipeId) ? 'Removed' : 'Added'
         } ${recipeId}`
       );
       return newSaved;
     });
   };
 
   const addToSavedRecipes = (recipeId) => {
     setSavedRecipes((prevSaved) => {
       if (prevSaved.includes(recipeId)) {
         console.log(`savedRecipes: [${prevSaved.join(', ')}], ${recipeId} already in list`);
         return prevSaved;
       }
       const newSaved = [...prevSaved, recipeId];
       console.log(`savedRecipes: [${newSaved.join(', ')}], Added ${recipeId}`);
       return newSaved;
     });
   };
 
   return (
     <RecipeContext.Provider value={{ savedRecipes, toggleSaveRecipe, addToSavedRecipes }}>
       {children}
     </RecipeContext.Provider>
   );
 };
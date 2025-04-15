import AddMealModal from "./AddMealModal";
import { useState } from "react";
import { Box, Button, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";

function DayColumn({ dayLabel, date, bg, weeklyMeals }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [meals, setMeals] = useState(() => {
    // Filter meals for the current date from weeklyMeals
    const planForDate = weeklyMeals?.find((plan) => plan.date === date);
    return planForDate
      ? planForDate.meals.map((meal) => ({
          name: meal.name,
          recipes: meal.recipes.map((recipe) => recipe.name),
        }))
      : [];
  });
  const [error, setError] = useState("");
  const itemWidth = "150px";
  const itemHeight = "100px";

  const handleAddMeal = async (meal) => {
    try {
      // Step 1: Save each Spoonacular recipe to the local database
      const savedRecipes = await Promise.all(
        meal.recipes.map(async (recipe) => {
          const response = await axios.post(
            `http://localhost:5000/api/meal-planner/spoonacular/recipes/${recipe.id}/save`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          return {
            ...response.data, // Saved recipe data (name, description, ingredients as ObjectIds)
            ingredients: recipe.ingredients, // Preserve the detailed ingredients from AddMealModal
          };
        })
      );

      // Step 2: Prepare the meal data for submission
      const mealData = {
        date: meal.date,
        meals: [
          {
            name: meal.name,
            description: meal.description || "",
            recipes: savedRecipes.map((recipe) => ({
              name: recipe.name,
              description: recipe.description,
              ingredients: recipe.ingredients, // Use the preserved detailed ingredients
            })),
          },
        ],
      };

      // Step 3: Submit the meal plan to the backend
      await axios.post("http://localhost:5000/api/meal-planner/meal-plans", mealData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Step 4: Update the local state to display the new meal
      setMeals((prev) => [
        ...prev,
        { name: meal.name, recipes: savedRecipes.map((recipe) => recipe.name) },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add meal.");
      console.error(err);
    }
  };

  return (
    <Box flex="1" bg={bg} borderRight="1px" borderColor="gray.300">
      <Box
        bg="gray.300"
        p={2}
        borderBottom="1px"
        borderColor="gray.300"
        textAlign="center"
      >
        <Text fontWeight="bold">{dayLabel}</Text>
      </Box>

      <Box minH="650px" p={4}>
        {error ? (
          <Text color="red.500" textAlign="center">{error}</Text>
        ) : (
          <VStack spacing={4} align="center">
            {meals.map((meal, index) => (
              <Box
                key={index}
                bgColor="gray.500"
                color="white"
                borderColor="gray.500"
                borderWidth="1px"
                borderRadius="md"
                p={2}
                w={itemWidth}
                h={itemHeight}
                textAlign="center"
              >
                <Text fontSize="xl">{meal.name}</Text>
                <Text fontSize="sm" noOfLines={2}>
                  {meal.recipes.join(", ")}
                </Text>
              </Box>
            ))}
            <Button
              onClick={onOpen}
              w={itemWidth}
              variant="outline"
              borderColor="gray.400"
            >
              <AddIcon fontSize={16} color="gray.600" />
            </Button>
          </VStack>
        )}
      </Box>

      <AddMealModal isOpen={isOpen} onClose={onClose} onAddMeal={handleAddMeal} date={date} />
    </Box>
  );
}

export default DayColumn;
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    VStack,
    Box,
    HStack,
    SimpleGrid,
    Text,
    Image,
    List,
    ListItem,
  } from "@chakra-ui/react";
  import { AddIcon } from "@chakra-ui/icons";
  import { useState, useEffect } from "react";
  import SelectRecipesModal from "./SelectRecipesModal";
  
  const AddMealModal = ({ isOpen, onClose, onAddMeal, date }) => {
    const [mealName, setMealName] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [isSelectRecipesOpen, setIsSelectRecipesOpen] = useState(false);
  
    const handleConfirmRecipes = (selectedRecipes) => {
      // Map the detailed recipe data to the required format
      const formattedRecipes = selectedRecipes.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.summary || recipe.title,
        image: recipe.image || "",
        servings: recipe.servings || 1,
        ingredients: recipe.extendedIngredients.map((ing) => ({
          name: ing.name || "Unknown Ingredient", // Ensure name is non-empty
          quantity: ing.amount ? ing.amount.toString() : "1", // Default to "1" if amount is missing
          unit: ing.unit && ing.unit.trim() !== "" ? ing.unit : "unit", // Default to "unit" if missing or empty
          price: 1.0, // Default price
          calories: 100, // Default calories
        })),
      }));
      setRecipes(formattedRecipes);
      setIsSelectRecipesOpen(false);
    };
  
    const handleSave = () => {
      if (mealName.trim() !== "") {
        onAddMeal({ name: mealName, recipes, date });
        onClose();
      }
    };
  
    useEffect(() => {
      if (!isOpen) {
        setMealName("");
        setRecipes([]);
        setIsSelectRecipesOpen(false);
      }
    }, [isOpen]);
  
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Meal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <HStack>
                  <label style={{ width: "100px" }}>Meal name:</label>
                  <Input
                    value={mealName}
                    w="300px"
                    onChange={(e) => setMealName(e.target.value)}
                  />
                </HStack>
  
                <HStack alignItems="flex-start">
                  <label style={{ width: "100px", lineHeight: "40px" }}>Recipes:</label>
                  <Box flex="1">
                    {recipes.length === 0 ? (
                      <Text color="gray.500">No recipes selected.</Text>
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {recipes.map((recipe) => (
                          <Box
                            key={recipe.id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            userSelect="none"
                          >
                            <HStack spacing={4}>
                              {recipe.image && (
                                <Image
                                  src={recipe.image}
                                  alt={recipe.title}
                                  boxSize="100px"
                                  objectFit="cover"
                                  borderRadius="md"
                                />
                              )}
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="bold">{recipe.title}</Text>
                                <Text fontSize="sm" color="gray.600">
                                  Servings: {recipe.servings}
                                </Text>
                                {/* <Text fontSize="sm">Ingredients:</Text>
                                <List spacing={1} fontSize="sm" color="gray.700">
                                  {recipe.ingredients.map((ing, index) => (
                                    <ListItem key={index}>
                                      {ing.name} - {ing.quantity} {ing.unit}
                                    </ListItem>
                                  ))}
                                </List> */}
                              </VStack>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    )}
                    <Button
                      onClick={() => setIsSelectRecipesOpen(true)}
                      w="full"
                      variant="outline"
                      borderColor="gray.400"
                      mt={2}
                    >
                      <AddIcon fontSize={16} color="gray.600" />
                    </Button>
                  </Box>
                </HStack>
              </VStack>
            </ModalBody>
  
            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="blue"
                ml={3}
                onClick={handleSave}
                isDisabled={mealName.trim() === "" || recipes.length === 0}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <SelectRecipesModal
          isOpen={isSelectRecipesOpen}
          onClose={() => setIsSelectRecipesOpen(false)}
          onConfirm={handleConfirmRecipes}
        />
      </>
    );
  };
  
  export default AddMealModal;
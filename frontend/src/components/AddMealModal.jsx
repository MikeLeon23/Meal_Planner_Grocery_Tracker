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
    SimpleGrid
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import SelectRecipesModal from "./SelectRecipesModal";

const AddMealModal = ({ isOpen, onClose, onAddMeal }) => {
    const [mealName, setMealName] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [isSelectRecipesOpen, setIsSelectRecipesOpen] = useState(false);

    const handleConfirmRecipes = (selectedRecipes) => {
        setRecipes(selectedRecipes);
        setIsSelectRecipesOpen(false);
    };

    const handleSave = () => {
        if (mealName.trim() !== "") {
            onAddMeal({ name: mealName, recipes });
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
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
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

                            <HStack placeItems="flex-start">
                                <label style={{ width: "100px", lineHeight: "40px" }}>Recipes:</label>
                                <SimpleGrid columns={2} spacingX={4} spacingY={2} flex="1">
                                    {recipes.map((recipe, index) => (
                                        <Box key={index} px={4} py={2} borderWidth="1px" borderRadius="md" userSelect="none">
                                            {recipe}
                                        </Box>
                                    ))}
                                    <Button
                                        onClick={() => setIsSelectRecipesOpen(true)}
                                        w="full"
                                        variant="outline"
                                        borderColor="gray.400"
                                    >
                                        <AddIcon fontSize={16} color="gray.600" />
                                    </Button>
                                </SimpleGrid>
                            </HStack>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button colorScheme="blue" ml={3} onClick={handleSave}>
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

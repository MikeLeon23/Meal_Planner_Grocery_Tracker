import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Checkbox,
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  const dummyRecipes = [
    "Recipe 1",
    "Recipe 2",
    "Recipe 3",
    "Recipe 4",
    "Recipe 5",
    "Recipe 6",
  ];
  
  const SelectRecipesModal = ({ isOpen, onClose, onConfirm }) => {
    const [selectedRecipes, setSelectedRecipes] = useState([]);
  
    const toggleRecipe = (recipe) => {
      setSelectedRecipes((prev) =>
        prev.includes(recipe) ? prev.filter((r) => r !== recipe) : [...prev, recipe]
      );
    };
  
    const handleConfirm = () => {
      onConfirm(selectedRecipes);
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Recipes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Recipe</Th>
                  <Th>Quantity</Th>
                  <Th>Select</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dummyRecipes.map((recipe, index) => (
                  <Tr key={index} bg={index % 2 === 0 ? "gray.100" : "white"}>
                    <Td>{recipe}</Td>
                    <Td>1</Td>
                    <Td>
                      <Checkbox
                        isChecked={selectedRecipes.includes(recipe)}
                        onChange={() => toggleRecipe(recipe)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
  
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" ml={3} onClick={handleConfirm}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default SelectRecipesModal;
  
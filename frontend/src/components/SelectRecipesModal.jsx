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
  Spinner,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const SelectRecipesModal = ({ isOpen, onClose, onConfirm }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;

  // Fetch initial recipes list from Spoonacular via backend
  useEffect(() => {
    if (isOpen) {
      const fetchRecipes = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await axios.get(
            "http://localhost:5000/api/meal-planner/spoonacular/recipes",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              params: {
                number: 30, // Fetch 30 recipes
              },
            }
          );
          setRecipes(response.data || []);
        } catch (err) {
          setError("Failed to fetch recipes.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipes();
      setCurrentPage(1);
      setSelectedRecipes([]);
    }
  }, [isOpen]);

  // Pagination logic
  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentRecipes = recipes.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleRecipe = (recipe) => {
    setSelectedRecipes((prev) =>
      prev.some((r) => r.id === recipe.id)
        ? prev.filter((r) => r.id !== recipe.id)
        : [...prev, recipe]
    );
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch detailed information for each selected recipe
      const detailedRecipes = await Promise.all(
        selectedRecipes.map(async (recipe) => {
          const response = await axios.get(
            `http://localhost:5000/api/meal-planner/spoonacular/recipes/${recipe.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          return response.data; // Full recipe details
        })
      );
      onConfirm(detailedRecipes);
    } catch (err) {
      setError("Failed to fetch recipe details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Recipes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner display="block" mx="auto" my={4} />
          ) : error ? (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          ) : (
            <>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Recipe</Th>
                    <Th>Select</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentRecipes.map((recipe, index) => (
                    <Tr
                      key={recipe.id}
                      bg={(startIndex + index) % 2 === 0 ? "gray.100" : "white"}
                    >
                      <Td>{recipe.title}</Td>
                      <Td>
                        <Checkbox
                          isChecked={selectedRecipes.some((r) => r.id === recipe.id)}
                          onChange={() => toggleRecipe(recipe)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              {/* Pagination Controls */}
              {recipes.length > 0 && (
                <HStack justify="center" mt={4}>
                  <IconButton
                    icon={<ChevronLeftIcon />}
                    onClick={handlePrevPage}
                    isDisabled={currentPage === 1}
                    aria-label="Previous page"
                  />
                  <Text>
                    Page {currentPage} of {totalPages}
                  </Text>
                  <IconButton
                    icon={<ChevronRightIcon />}
                    onClick={handleNextPage}
                    isDisabled={currentPage === totalPages}
                    aria-label="Next page"
                  />
                </HStack>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            colorScheme="blue"
            ml={3}
            onClick={handleConfirm}
            isDisabled={loading || selectedRecipes.length === 0}
            isLoading={loading}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectRecipesModal;
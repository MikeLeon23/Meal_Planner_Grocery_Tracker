import { Container, VStack, Text, SimpleGrid } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard.jsx'
import { useRecipeStore } from '../store/recipe.js'
import { useEffect } from 'react'

const HomePage = () => {

  const { fetchRecipes, recipes } = useRecipeStore()

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])
  console.log(recipes)

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8}>
        <Text
          fontSize={"30"}
          fontWeight={"bold"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
          textAlign={"center"}>
          Current Recipes 🚀
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w={"full"}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </SimpleGrid>
        {recipes.length === 0 && (
          <Text
            fontSize={"xl"}
            fontWeight={"bold"}
            textAlign={"center"}
            color={"gray.500"}>
            No recipes found. 😢
            <Link to={"/create"}>
              <Text as="span" color="blue.500" _hover={{ textDecoration: "underline" }}>
                Create a recipe
              </Text>
            </Link>
          </Text>)}
      </VStack>
    </Container>
  )
}

export default HomePage

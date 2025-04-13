import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipeDetail_CSS.css';
import { Container, VStack, Text, Button, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { RecipeContext } from '../components/RecipeContext';

const API_URL = 'http://localhost:5000/api';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToSavedRecipes } = useContext(RecipeContext);
  const [recipe, setRecipe] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRecipe = async () => {
    try {
      const response = await axios.get(`${API_URL}/recipes/${id}/information`);
      setRecipe(response.data);
      console.log('Recipe data:', response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError('Failed to load recipe details.');
    }
  };

  const getNutritionLabel = async () => {
    try {
      const response = await axios.get(`${API_URL}/recipes/${id}/nutritionLabel`);
      setNutrition(response.data);
      console.log('Nutrition data:', response.data);
    } catch (error) {
      console.error('Error fetching nutrition:', error);
      setError('Failed to load nutrition information.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([getRecipe(), getNutritionLabel()]);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return (
    <Container maxW="container.xl" py={12} className="recipe-container">
      <VStack spacing={8} className="recipe-vstack">
        {loading && <Spinner size="xl" />}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        {!loading && !error && recipe && (
          <div className="container">
            <div className="body">
              <div className="recipe">
                <div className="recipe-leftside">
                  <div className="recipe-image">
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.title} />
                    ) : (
                      <Text>No image available</Text>
                    )}
                    <p className="howtocook">--- How to Cook ---</p>
                    <p className="instruction">{recipe.instructions || 'No instructions provided.'}</p>
                  </div>
                </div>
                <div className="recipe-center">
                  <div className="recipe-details">
                    <h2>{recipe.title || 'Untitled Recipe'}</h2>
                    <p className="ingredients">Ingredients:</p>
                    <ul>
                      {recipe.extendedIngredients?.length > 0 ? (
                        recipe.extendedIngredients.map((ingredient) => (
                          <li key={ingredient.id}>{ingredient.original}</li>
                        ))
                      ) : (
                        <li>No ingredients listed.</li>
                      )}
                    </ul>
                    <Button
                      variant="unstyled"
                      className="add-button"
                      onClick={() => addToSavedRecipes(Number(id))}
                    >
                      Add to List
                    </Button>
                    <Button
                      onClick={() => navigate('/recipe-select')}
                      colorScheme="gray"
                      className="back-button"
                    >
                      Back
                    </Button>
                  </div>
                </div>
                <div className="recipe-rightside">
                  <div dangerouslySetInnerHTML={{ __html: nutrition }} className="nutritions" />
                </div>
              </div>
            </div>
          </div>
        )}
      </VStack>
    </Container>
  );
}

export default RecipeDetail;
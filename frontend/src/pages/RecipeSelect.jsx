import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipeSelect_CSS.css';
import 'font-awesome/css/font-awesome.min.css';
import { Container, VStack, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { RecipeContext } from '../context/RecipeContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/meal-planner/spoonacular';

function RecipeSelect() {
  const [recipes, setRecipes] = useState([]);
  const [loadedRecipes, setLoadedRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [currentQuery, setCurrentQuery] = useState('Healthy Meals');
  const recipesPerPage = 6;
  const { savedRecipes, toggleSaveRecipe } = useContext(RecipeContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getRecipes = async (query = '') => {
    try {
      setLoading(true);
      setError(null);
      const url = query ? `${API_URL}/recipes?query=${encodeURIComponent(query)}` : `${API_URL}/recipes`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log('Recipes fetched:', response.data);
      if (!response.data || response.datalength === 0) {
        setError('No healthy meals found for this search.');
      }
      setRecipes(response.data || []);
      setCurrentQuery(query || 'Healthy Meals');
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
      setError(error.response?.data?.error || 'Failed to load healthy meals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getRecipes();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const start = (page - 1) * recipesPerPage;
    const end = start + recipesPerPage;
    setLoadedRecipes(recipes.slice(start, end));
  }, [recipes, page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page * recipesPerPage < recipes.length) setPage(page + 1);
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      getRecipes(searchInput.trim());
      setSearchInput('');
    } else {
      getRecipes();
    }
  };

  return (
    <Container maxW="1440px" className="recipe-container-select">
      <VStack spacing={8} className="recipe-vstack-select">
        {loading && <Spinner size="xl" />}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
            <button onClick={() => getRecipes()} style={{ marginLeft: '10px' }}>
              Retry
            </button>
          </Alert>
        )}
        {!loading && (
          <div className="container-body">
            <div className="body-select">
              <div className="header-container">
                <div className="body-select-title">
                  <Text
                    fontSize="40"
                    fontWeight="bold"
                    bgGradient="linear(to-r, cyan.400, blue.500)"
                    bgClip="text"
                    textAlign="center"
                  >
                    DIET COLLECTION
                  </Text>
                </div>
                <div className="search-container">
                  <div className="search-title">
                    {/* <h3>SEARCH RESULTS: {currentQuery}</h3> */}
                  </div>
                  <div className="search-bar">
                    <div className="input-container">
                      <input
                        placeholder="Search healthy meals (e.g., vegan salad)"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <button className="search-btn" onClick={handleSearch}>
                        <i className="fa fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div variant="unstyled" className="recipes-list">
                {loadedRecipes.length === 0 && !error ? (
                  <Text>No healthy meals found.</Text>
                ) : (
                  loadedRecipes.map((recipe) => (
                    <div key={recipe.id} className="specific-recipe">
                      <div className="recipe-content">
                        <div className="heart-container">
                          <p>
                            {recipe.nutrition?.nutrients?.[0]?.amount
                              ? `${Math.ceil(recipe.nutrition.nutrients[0].amount)} kcal`
                              : 'N/A'}
                          </p>
                          <button
                            className={`heart-button ${savedRecipes.includes(recipe.id) ? 'favorited' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveRecipe(recipe.id);
                            }}
                          >
                            {savedRecipes.includes(recipe.id) ? '❤️' : '🤍'}
                          </button>
                        </div>
                        <div
                          className="recipe-content-inner"
                          onClick={() => navigate(`/recipe-detail/${recipe.id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="recipe-image-wrapper">
                            <img
                              src={recipe.image || 'https://via.placeholder.com/150'}
                              className="recipe-image-select"
                            />
                          </div>
                          <div className="recipe-title">
                            <h3>{recipe.title || 'Untitled Recipe'}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {loadedRecipes.length > 0 && (
                <div className="pagination">
                  <button onClick={handlePrevPage} disabled={page === 1}>
                    Back
                  </button>
                  {[1, 2, 3].map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageClick(pageNumber)}
                      className={page === pageNumber ? 'active-page' : ''}
                      disabled={(pageNumber - 1) * recipesPerPage >= recipes.length}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button onClick={handleNextPage} disabled={page * recipesPerPage >= recipes.length}>
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </VStack>
    </Container>
  );
}

export default RecipeSelect;
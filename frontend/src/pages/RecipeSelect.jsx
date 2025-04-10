
import axios from "axios";
import { useEffect, useState } from "react";
import "./RecipeSelect_CSS.css";
import 'font-awesome/css/font-awesome.min.css'; //npm install font-awesome  npm install react-router-dom
import { Container, VStack, Text } from '@chakra-ui/react'

const API_URL = "http://localhost:8080/api";

function RecipeSelect({onSelectRecipe}){
    const[recipes, setRecipes] = useState([]);
    const [loadedRecipes, setLoadedRecipes] = useState([]); // Store currently loaded recipes (6 at a time)
    const [page, setPage] = useState(1); // Track the current page for pagination
    const recipesPerPage = 6; // Number of recipes to load per page
    const [savedRecipes, setSavedRecipes] = useState([]);
    
    const getRecipes = async() => {
        try {
            const response = await axios.get(API_URL + "/all" ,{
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            // console.log("API Response:", response.data);
            setRecipes(response.data);
          
        } catch (error) {
            console.log("Error fetching recipes", error);
        }
    }
    useEffect(() => {
        getRecipes();
    }, [])

    const loadMoreRecipes = () => {
        const start = (page - 1) * recipesPerPage;
        const end = start + recipesPerPage;
        setLoadedRecipes(recipes.slice(start, end)); // Slice the recipes for the current page
    };

    useEffect(() => {
        loadMoreRecipes();
      }, [recipes, page]);
    
    // Handle "Previous" button click
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1); // Decrease page number to go back to the previous set of recipes
        }
    };

    // Handle "Next" button click
    const handleNextPage = () => {
        if ((page * recipesPerPage) < recipes.length) {
            setPage(page + 1); // Increase page number to go to the next set of recipes
        }
    };

    // Handle direct page click
    const handlePageClick = (pageNumber) => {
        setPage(pageNumber); // Directly set the page to the clicked page number
    };

    // Toggle saved recipes
    const toggleSaveRecipe = (recipeId) => {
        setSavedRecipes((prevSaved) => {
            const updatedSaved = prevSaved.includes(recipeId)
                ? prevSaved.filter((id) => id !== recipeId) // Remove if already saved
                : [...prevSaved, recipeId]; // Add if not saved
            
            console.log("Updated saved recipes:", updatedSaved); // ✅ Debugging output
            return updatedSaved;
        });
    };

    return(
        <Container maxW="container.sxl" py={12}>
            <VStack spacing={8} >
                <Text
                    fontSize={"30"}
                    fontWeight={"bold"}
                    bgGradient={"linear(to-r, cyan.400, blue.500)"}
                    bgClip={"text"}
                    textAlign={"center"}>
                    Recipes Selection 🚀  
                </Text>
                
                <div className="container-body">
                    <div className="body-select">
                        <div className="search-container">
                            <div className="search-title">
                                <h3>Result of {}</h3>
                            </div>
                            
                            <div className="search-bar">
                                <div className="input-container">
                                    <input placeholder="Enter category" />
                                    <button className="search-btn">
                                        <i className="fa fa-search"></i> {/* Font Awesome Search Icon */}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="recipes-list">
                            {loadedRecipes.map((recipe) => (
                            <div key={recipe.id} className="specific-recipe">
                            <div className="recipe-content" >
                                    <div className="heart-container">
                                        <p > {recipe.readyInMinutes} minutes</p>
                                        <button
                                                className={`heart-button ${savedRecipes.includes(recipe.id) ? "favorited" : ""}`}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevents navigation when clicking the heart
                                                    toggleSaveRecipe(recipe.id);
                                                }}
                                            >
                                                {savedRecipes.includes(recipe.id) ? "❤️" : "🤍"}
                                        </button>
                                    </div>

                                    <div className="recipe-content" onClick={() => onSelectRecipe(recipe.id)} style={{ cursor: "pointer" }}>
                                        <div className="recipe-image-wrapper" onClick={() => onSelectRecipe(recipe.id)} 
                                            style={{ cursor: "pointer" }}>
                                            <img src={recipe.image} alt={recipe.name} className="recipe-image-select" />
                                        </div>
                                        <div className="recipe-title">
                                            <h3>{recipe.title}</h3>
                                        </div>
                                    </div>
                                </div> 
                             </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="pagination">
                            <button onClick={handlePrevPage} disabled={page === 1}>Back</button>
                                {/* Page numbers */}
                                {[1, 2, 3].map((pageNumber) => (
                                    <button
                                    key={pageNumber}
                                    onClick={() => handlePageClick(pageNumber)}
                                    className={page === pageNumber ? "active-page" : ""}
                                    disabled={(pageNumber - 1) * recipesPerPage >= recipes.length}
                                >
                                {pageNumber}
                            </button>
                            ))}
                            <button onClick={handleNextPage} disabled={page * recipesPerPage >= recipes.length}>Next</button>
                        </div>
                    </div>
                </div>
            </VStack>
        </Container>
    )
}
export default RecipeSelect;
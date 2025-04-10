import axios from "axios";
import { useEffect, useState } from "react";
import "./RecipeDetail_CSS.css";
import { Container, VStack, Text } from '@chakra-ui/react'

const API_URL = "http://localhost:8080/api";

function RecipeDetail({ recipeId, goBack }){
    const[recipe, setRecipe] = useState("");
    const[nutrition, setNutrition] = useState("");

    const getRecipe = async() => {
        try {
            const response = await axios.get(`${API_URL}/${recipeId}` ,{
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            setRecipe(response.data);
            console.log(response.data);
        } catch (error) {
            console.log("Error fetching recipes", error);
        }
    }
    const getNutrition = async() => {
        try {
            const response = await axios.get(`${API_URL}/${recipeId}/nutritionLabel` ,{
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            setNutrition(response.data);
            console.log(response.data);
        } catch (error) {
            console.log("Error fetching recipes", error);
        }
    }
    

    useEffect(() => {
        getRecipe();
        getNutrition();
    }, [])

    return(
        <Container maxW="container.sxl" py={12}>
              <VStack spacing={8}>
                <Text
                  fontSize={"30"}
                  fontWeight={"bold"}
                  bgGradient={"linear(to-r, cyan.400, blue.500)"}
                  bgClip={"text"}
                  textAlign={"center"}>
                  Recipe Detail 🚀
                </Text>
                <div className="container">
                    <div className="body"> 
                       <div className="recipe">
                            <div className="recipe-leftside">
                                <div className="recipe-image">
                                    <img src={recipe.image}/>
                                    <p className="howtocook">--- how to cook ---</p>
                                    <p className="instruction">{recipe.instructions}:</p>
                                </div>
                            </div>
                            <div className="recipe-center">
                                <div className="recipe-details">
                                    <h2>{recipe.title}</h2>
                                    <p className="ingredients">Ingredients:</p>
                                        <ul>
                                            {recipe.extendedIngredients?.map((ingredient) =>(
                                                <li key={ingredient.id}>{ingredient.original}</li>
                                            ))}
                                        </ul>
                                    <button className="add-button">ADD TO LIST</button>
                                </div>
                            </div>
                            <div className="recipe-rightside">
                                <div dangerouslySetInnerHTML={{ __html: nutrition } } className="nutritions" />
                            </div>
                        </div>
                        <div className="suggestions-container">
                            <h1>OTHER SUGGESTIONS</h1>
                            <div className="suggestions">
                                <div className="suggest1">
                                    <img src={recipe.image}/>
                                    <p>{recipe.title}:</p>
                                </div>
                                <div className="suggest2">
                                    <img src={recipe.image}/>
                                    <p>{recipe.title}:</p>
                                </div>
                                <div className="suggest3">
                                    <img src={recipe.image}/>
                                    <p>{recipe.title}:</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={goBack} className="back-button">← Back</button>
                    </div>  
                </div>
            </VStack>
        </Container>
    )
}
export default RecipeDetail;
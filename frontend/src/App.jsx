import { Box, Button } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MealPlannerPage from './pages/MealPlannerPage'
import Navigation from './components/Navigation'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import { useColorModeValue } from '@chakra-ui/react'
import ShoppingList from './pages/ShoppingList'
import RecipeSelect from './pages/RecipeSelect'
import RecipeDetail from './pages/RecipeDetail'
import { RecipeProvider } from './components/RecipeContext';

function App() {

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.800")}>
      <Router>
        <Navigation />
        <RecipeProvider>
            <Routes>
              <Route path="/" element={<MealPlannerPage />}></Route>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/register" element={<RegisterPage />}></Route>
              <Route path="/profile" element={<ProfilePage />}></Route>
              <Route path="/shopping-list" element={<ShoppingList />}></Route>
              <Route path="/recipe-select" element={<RecipeSelect />}></Route>
              <Route path="/recipe-detail/:id" element={<RecipeDetail />}></Route>
            </Routes>
          </RecipeProvider>
      </Router>
    </Box>
  )
}

export default App

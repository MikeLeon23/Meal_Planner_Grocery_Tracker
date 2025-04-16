import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext.jsx";
import { RecipeProvider } from './context/RecipeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>
          <RecipeProvider>
            <App />
          </RecipeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)

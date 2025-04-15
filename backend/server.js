import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

import { connectDB } from './config/db.js';

import mealPlannerRoutes from './routes/mealPlanner.route.js';
import userRoutes from './routes/user.route.js';
import recipeRoutes from './routes/spoonacular.fetching.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(cors({ origin: 'http://localhost:5173'}));
app.use(express.json()); // allows us to accept JSON data in the body
app.use('/api/recipes', recipeRoutes);
app.use("/api/meal-planner", mealPlannerRoutes);
app.use('/api/user', userRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

app.listen(PORT, () => {
    connectDB();
    console.log('Server started at http://localhost:' + PORT);
});
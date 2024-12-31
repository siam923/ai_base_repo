// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "#src/config/db.js";
import errorHandler from '#src/middlewares/errorHandler.js'; 
import AppError from '#src/utils/AppError.js';

import historyRoutes from '#src/routes/historyRoutes.js';
import suggestionsRoutes from '#src/routes/suggestionsRoutes.js';
import documentRoutes from '#src/routes/documentRoutes.js';
import chatRoutes from '#src/routes/chatRoutes.js';


dotenv.config();
connectDB();

const app = express();

// Trust proxy if behind a proxy (e.g., Heroku, Nginx)
app.set("trust proxy", 1);

// For all other routes, use JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors());

// Routes
// Register API Routes
app.use('/api/history', historyRoutes);
app.use('/api/suggest', suggestionsRoutes);
app.use('/api/docs', documentRoutes);
app.use('/api/chat', chatRoutes);

// Catch unhandled routes (404)
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Handle errors
app.use((err, req, res, next) => {
  // Log the error for debugging
  console.error('Error caught in app.js:', err);
  next(err);
});

// Global error handling middleware (should be last)
app.use(errorHandler);

export default app;

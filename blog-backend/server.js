import express from "express";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";
import connectDB from "./config/db.js";
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler.js";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import postCategoriesRoutes from "./routes/postCategoriesRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const corsOptions = {
  exposedHeaders: "*",
};
app.use(cors(corsOptions));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/post-categories", postCategoriesRoutes);

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Serve client app (frontend build)
const clientBuildPath = path.join(__dirname, "../blog-frontend/build");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("✅ API is running...");
  });
}

// Error Handlers
app.use(invalidPathHandler);
app.use(errorResponserHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server is running on port ${PORT}`)
);
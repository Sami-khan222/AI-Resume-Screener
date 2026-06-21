import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

import { connectDB } from "./config/db.js";
import screeningRoutes from "./routes/screeningRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/screenings", screeningRoutes);

// Multer errors (bad file type, too large) land here instead of crashing the process.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    console.error("Unhandled error:", err.message);
    return res.status(500).json({ message: err.message || "Something went wrong." });
  }
  next();
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Resume screener API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err.message);
    process.exit(1);
  });

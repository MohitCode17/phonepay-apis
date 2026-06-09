import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import connectDB from "./src/config/db.js";

// Import Routes
import authRoutes from "./src/routes/authRoutes.js";
import transactionRoutes from "./src/routes/transactionRoutes.js";

import swaggerDocument from "./swagger-output.json" with { type: "json" };

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Api docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Testing Route
app.get("/", (req, res) => {
  res.send("PhonePe Backend System is running!");
});

// App Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at port http://localhost:${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});

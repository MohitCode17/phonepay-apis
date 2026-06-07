import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import connectDB from "./src/config/db.js";

import swaggerDocument from "./swagger-output.json" with { type: "json" };

const app = express();
connectDB();

const port = process.env.PORT || 3000;

// Api docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Testing Route
app.get("/", (req, res) => {
  res.send("PhonePe Backend System is running!");
});

app.listen(port, () => {
  console.log(`Server running at port http://localhost:${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});

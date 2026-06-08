import express from "express";
import { registerUser } from "../controllers/authController.js";

const routes = express.Router();

routes.post("/register", registerUser);

export default routes;
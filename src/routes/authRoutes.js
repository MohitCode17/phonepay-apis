import express from "express";
import { registerUser, loginUser, getUserProfile, setMpin } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const routes = express.Router();

routes.post("/register", registerUser);
routes.post("/login", loginUser);
routes.get("/profile", protect, getUserProfile);
routes.post("/set-mpin", protect, setMpin);

export default routes;
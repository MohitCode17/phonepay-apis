import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { sendMoney } from "../controllers/transactionController.js";

const routes = express.Router();

routes.post("/send", protect, sendMoney);

export default routes;
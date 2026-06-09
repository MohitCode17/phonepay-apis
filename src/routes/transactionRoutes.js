import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { sendMoney, getTransactionHistory } from "../controllers/transactionController.js";

const routes = express.Router();

routes.post("/send", protect, sendMoney);
routes.get("/history", protect, getTransactionHistory);

export default routes;
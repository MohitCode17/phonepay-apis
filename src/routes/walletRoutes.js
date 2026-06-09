import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { addMoneyToWallet, payBill } from "../controllers/walletController.js";

const router = express.Router();

router.post("/add-money", protect, addMoneyToWallet);
router.post("/pay-bill", protect, payBill);

export default router;

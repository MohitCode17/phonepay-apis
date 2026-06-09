import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const addMoneyToWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance += amount;
    await user.save();

    const transaction = await Transaction.create({
      sender: userId,
      type: "ADD_MONEY",
      amount,
      status: "COMPLETED",
    });

    res.status(200).json({
      message: `Successfully added ${amount} to wallet`,
      balance: user.balance,
      transaction,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const payBill = async (req, res) => {
  try {
    const { amount, billerName, mpin } = req.body;
    const userId = req.user._id;

    if (!mpin) {
      return res.status(400).json({ message: "MPIN is required" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify MPIN
    if (!user.mpin) {
      return res
        .status(400)
        .json({
          message: "MPIN not set. Please set your MPIN before making payments.",
        });
    }

    const isMpinValid = await bcrypt.compare(mpin, user.mpin);

    if (!isMpinValid) {
      return res.status(401).json({ message: "Invalid MPIN" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= amount;
    await user.save();

    const transaction = await Transaction.create({
      sender: userId,
      type: "BILL_PAYMENT",
      status: "COMPLETED",
      amount,
      billerName: billerName || "Unknown Biller",
    });

    res.status(200).json({
      message: `Successfully paid ${amount} to ${billerName || "the biller"}`,
      balance: user.balance,
      transaction,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

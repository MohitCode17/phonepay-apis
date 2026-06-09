import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// @desc Send money Via Phone number or UPI ID
// @route POST /api/transactions/send
// @access Private
export const sendMoney = async (req, res) => {
  try {
    const { receiverIdentifier, amount, mpin } = req.body; // Identifier can be phone number or UPI ID

    const senderId = req.user._id;

    if (!mpin) {
      return res
        .status(400)
        .json({ message: "MPIN is required for transactions" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero" });
    }

    const sender = await User.findById(senderId);

    // Verify sender MPIN
    if (!sender.mpin) {
      return res
        .status(400)
        .json({ message: "Please set an MPIN before making transactions" });
    }

    const isMpinCorrect = await bcrypt.compare(mpin, sender.mpin);

    if (!isMpinCorrect) {
      return res.status(401).json({ message: "Incorrect MPIN" });
    }

    // Find receiver either by Phone number or UPI Id
    const receiver = await User.findOne({
      $or: [{ phone: receiverIdentifier }, { upiId: receiverIdentifier }],
    });

    if (!receiver) {
      return res
        .status(404)
        .json({ message: "Receiver not found (Invalid Phone/UPI)" });
    }

    if (senderId.toString() === receiver._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot send money to yourself" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Transfer Logic
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    // Log the transaction
    const transaction = await Transaction.create({
      sender: senderId,
      receiver: receiver._id,
      type: "TRANSFER",
      amount,
      status: "COMPLETED",
    });

    res.status(200).json({
      message: "Money Transfer Successful",
      transaction,
      newBalance: sender.balance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name phone upiId")
      .populate("receiver", "name phone upiId")
      .sort({ createdAt: -1 });

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

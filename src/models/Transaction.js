import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // receiver can be null for transactions like deposits or withdrawals
    },
    type: {
        type: String,
        enum: ["TRANSFER", "ADD_MONEY", "WITHDRAW", "BILL_PAYMENT"],
        default: "TRANSFER"
    },
    billerName: {
        type: String, // e.g. "Airtel Mobile Recharge", "Electricity Bill"
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED"],
        default: "PENDING"
    },
}, {
    timestamps: true
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
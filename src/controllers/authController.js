import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper function to generate a unique UPI ID
const generateUniqueUpiId = async (name) => {
  let upiId;
  let exists;

  do {
    upiId = `${name.toLowerCase().replace(/\s/g, "")}${Math.floor(
      1000 + Math.random() * 9000
    )}@phonepe`;

    exists = await User.findOne({ upiId });
  } while (exists);

  return upiId;
};

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};


export const registerUser = async (req, res) => {
    
    try {
        const { name, email, phone, password } = req.body;

        // Basic validation
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or phone already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Dynamically generate UPI ID based on name and a random number
        const upiId = await generateUniqueUpiId(name);

        // Create new user
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            upiId,
        });

        if(user) {
            res.status(201).json({ 
                message: "User registered successfully", 
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    upiId: user.upiId,
                    balance: user.balance,
                    hasMpinSet: false, // Since MPIN is not set during registration
                    token: generateToken(user._id),
                }
            });
        } else {
            res.status(400).json({ message: "Failed to register user" });
        };
    }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
};

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();


// User registration route
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // Store user data or use it as needed
        // For simplicity, we're not storing user data in this example
        res.status(201).send("User registered successfully");
    } catch (error) {
        // Error handling
        console.log(error);
        res.status(201).send("Error registering the user");
    }
});

// User login route
router.post('/login', async (req, res) => {

    // Authenticate user based on credentials
    // For simplicity, we're not checking credentials in this example
    const username = req.body.username;
    const userId = 1; // For demonstration purposes only

    // Create JWT token
    const token = jwt.sign({ userId }, 'secretKey', { expiresIn: '1h' });

    res.json({ token });
});

export default router;
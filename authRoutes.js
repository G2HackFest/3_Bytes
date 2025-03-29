const express = require("express");
const router = express.Router();

// Mock user database (Replace this with an actual DB later)
const users = [];

// Register a new user
router.post("/register", (req, res) => {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = { name, email, password, role };
    users.push(newUser);
    res.status(201).json({ message: "User registered successfully", user: newUser });
});

// Login user
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: `Welcome ${user.name}`, role: user.role });
});

module.exports = router;

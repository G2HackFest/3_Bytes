const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(bodyParser.json()); // Parse JSON requests

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

// Use Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

// Server Listening
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

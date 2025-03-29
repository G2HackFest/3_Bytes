const express = require("express");
const router = express.Router();
const mockData = require("../database/mockData.json");

// Get all products
router.get("/", (req, res) => {
    res.json(mockData);
});

// Filter products by category
router.get("/:category", (req, res) => {
    const category = req.params.category.toLowerCase();
    const filteredProducts = mockData.filter(product => product.category.toLowerCase() === category);

    if (filteredProducts.length === 0) {
        return res.status(404).json({ message: "No products found in this category" });
    }

    res.json(filteredProducts);
});

module.exports = router;

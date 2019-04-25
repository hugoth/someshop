const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Category = require("../models/Category");
// Create Product

router.post("/product/create", async (req, res) => {
  const category = await Category.findOne({ title: req.body.category });

  if (category) {
    try {
      const newProduct = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: category,
        averageRating: req.body.averageRating
      });

      await newProduct.save();
      res.json(newProduct);
    } catch (error) {
      res.status(400).json("Something went wrong");
    }
  } else {
    return res.json("Please fill a good category");
  }
});

// Read product avec un Get de query

router.get("/product", async (req, res) => {
  try {
    const filters = {};
    if (req.query.priceMin || req.query.priceMax) {
      filters.price = {};
    }
    if (req.query.priceMin) {
      filters.price.$gte = req.query.priceMin;
    }
    if (req.query.priceMax) {
      filters.price.$lte = req.query.priceMax;
    }
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.title) {
      filters.title = new RegExp(req.query.title, "i");
    }

    const search = Product.find(filters).populate({
      path: "category"
      // populate: { path: "department" }
    }); // ASYNC

    if (req.query.sort === "price-asc") {
      search.sort({ price: 1 });
    } else if (req.query.sort === "price-desc") {
      search.sort({ price: -1 });
    }
    const products = await search;

    return res.json(products);
  } catch (error) {
    return res.status(400).json("something went wrong");
  }
});

// Delete a product

router.post("/product/delete", async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    if (product) {
      await product.remove();

      res.json({ message: "Product Removed" });
    } else {
      res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

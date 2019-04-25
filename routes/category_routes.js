const express = require("express");
const router = express.Router();

const Department = require("../models/Department");
const Category = require("../models/Category");
const Product = require("../models/Product");

// Create Category

router.post("/category/create", async (req, res) => {
  const department = await Department.findOne({ title: req.body.department });

  if (department) {
    try {
      const newCategory = new Category({
        title: req.body.title,
        description: req.body.description,
        department: department
      });
      await newCategory.save();
      res.json(newCategory);
    } catch (error) {
      res.status(400).json("Something went wrong");
    }
  } else {
    return res.json("Please fill a good department");
  }
});

// Read all the categories

router.get("/category", async (req, res) => {
  try {
    const category = await Category.find();
    return res.json(category);
  } catch {
    return res.status(400).json("something went wrong");
  }
});

// Update a category

router.post("/category/update", async (req, res) => {
  const department = await Department.findOne({ title: req.body.department });
  try {
    const changeCategory = await Category.findById(req.body._id);
    changeCategory.title = req.body.title;
    changeCategory.description = req.body.description;
    changeCategory.department = department;
    await changeCategory.save();
    return res.json(changeCategory);
  } catch (error) {
    return res.status(400).json("Something went wrong");
  }
});

// Delete a category and all the product associated

router.post("/category/delete", async (req, res) => {
  try {
    const category = await Category.findById(req.query.id);
    if (category) {
      await Product.remove({ category: req.query.id });
      await category.remove();

      res.json({ message: "category Removed" });
    } else {
      res.status(400).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

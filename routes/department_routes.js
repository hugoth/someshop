const express = require("express");
const router = express.Router();

const Department = require("../models/Department");
const Category = require("../models/Category");
const Product = require("../models/Product");

// Read all Departements

router.get("/department", async (req, res) => {
  try {
    const department = await Department.find();
    return res.json(department);
  } catch {
    return res.status(400).json("something went wrong");
  }
});

// Create Department

router.post("/department/create", async (req, res) => {
  try {
    const newDepartment = new Department({
      title: req.body.title
    });
    await newDepartment.save();
    res.json(newDepartment);
  } catch (error) {
    res.status(400).json("Something went wrong");
  }
});

// Update Departments
router.post("/department/update", async (req, res) => {
  try {
    const changeDepartment = await Department.findById(req.body._id);
    changeDepartment.title = req.body.title;
    await changeDepartment.save();
    return res.json(changeDepartement);
  } catch (error) {
    return res.status(400).json("Something went wrong");
  }
});

// Delete Departments & associate Category and Products

router.post("/department/delete", async (req, res) => {
  try {
    const filters = {};
    const department = await Department.findById(req.query.id);
    const category = await Category.find({ department: req.query.id });

    const products = await Product.find();

    if (department) {
      res.json(products);

      //   res.json({ message: "Department Removed" });
    } else {
      res.status(400).json({ message: "Department not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//

module.exports = router;

//   await Category.remove({ department: req.query.id });
//   await department.remove();

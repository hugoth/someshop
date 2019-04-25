const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/someshop", {
  useNewUrlParser: true
});

const Department = require("./models/Department.js");
const Category = require("./models/Category.js");
const Product = require("./models/Product.js");
const Review = require("./models/Review.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const categoryRoutes = require("./routes/category_routes");
app.use(categoryRoutes);

const departmentRoutes = require("./routes/department_routes");
app.use(departmentRoutes);

const productRoutes = require("./routes/product_routes");
app.use(productRoutes);

const reviewRoutes = require("./routes/review_routes");
app.use(reviewRoutes);

app.all("*", (req, res) => {
  res.status(404).json({});
});

app.listen(process.env.PORT || 3000);

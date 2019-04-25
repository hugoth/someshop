const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Review = require("../models/Review");
// Create Product

router.post("/review/create", async (req, res) => {
  const product = await Product.findById(req.body.product);

  try {
    const newReview = new Review({
      rating: req.body.rating,
      comment: req.body.comment,
      username: req.body.username
    });

    if (product.reviews === undefined) {
      product.reviews = [];
      product.reviews.push(newReview);
    } else {
      product.reviews.push(newReview);
    }
    const newAverage = product.reviews.length;
    const sum = (product.averageRating + req.body.rating) / newAverage;
    product.averageRating = sum;

    res.json(product);

    await product.save();
    await newReview.save();
  } catch (error) {
    return res.status(400).json("not working");
  }
});

// Update Reviews

// Comments : comment mettre à jour l'average rating sans connexion du produits avec sa review en cas de changement de rating ?

router.post("/review/update", async (req, res) => {
  try {
    const changeReviews = await Review.findById(req.query.id);

    changeReviews.rating = req.body.rating;
    changeReviews.comment = req.body.comment;

    await changeReviews.save();
    return res.json(changeReviews);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Delete Reviews
router.post("/review/delete", async (req, res) => {
  const selectedReview = await Review.findById(req.query.id);
  const product = await Product.findOne({ reviews: { $in: [req.query.id] } });
  console.log(selectedReview);
  console.log(product);
  const newAverage =
    (product.averageRating * product.reviews.length - selectedReview.rating) /
    product.reviews.length;
  1;

  console.log(newAverage);
  try {
    if (selectedReview) {
      //   await selectedReview.remove();

      res.json({ message: "Selected Removed" });
    }
  } catch (error) {
    return res.status(400).json("Something went wrong");
  }
});

module.exports = router;

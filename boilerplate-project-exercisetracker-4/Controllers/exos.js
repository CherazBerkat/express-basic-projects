const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Exo = require("../Models/exo");
const User = require("../Models/user");
const bodyParser = require("body-parser");

router.use(bodyParser.json()); // JSON parser
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/api/users/:_id/exercises", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      const exos = Exo.find({ user_id: req.params._id });
      if (!exos) {
        return res.status(404).send("No exercises found for this user");
      } else res.json(exos);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/api/users/:_id/exercises", async (req, res) => {
  // Validate that userId is a valid ObjectId format
  if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
    return res.status(400).json({ error: "Invalid ObjectId format" });
  }
  const user = await User.findById(req.params._id);
  if (!user) {
    return res.status(404).send("User not found");
  } else {
    let dateObj;
    let formattedDate;

    if (req.body.date) {
      dateObj = new Date(req.body.date);
    } else {
      dateObj = new Date();
    }
    const exo = new Exo({
      user_id: req.params._id,
      description: req.body.description,
      duration: req.body.duration,
      date: dateObj,
    });
    try {
      const savedExo = await exo.save();

      const options = {
        weekday: "short", // Short day of the week (e.g., 'Wed')
        month: "short", // Short month name (e.g., 'Jul')
        day: "numeric", // Numeric day (e.g., '17')
        year: "numeric", // Full year (e.g., '2024')
      };
      const parts = savedExo.date
        .toDateString("en-US", options)
        .split(/[\s,]+/);
      const formattedDate = `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`;

      const returned = {
        _id: user._id,
        username: user.name,
        date: formattedDate,
        duration: savedExo.duration,
        description: savedExo.description,
      };
      res.status(201).json(returned);
    } catch (err) {
      res.status(500).send(err);
      console.log(err);
    }
  }
});

module.exports = router;

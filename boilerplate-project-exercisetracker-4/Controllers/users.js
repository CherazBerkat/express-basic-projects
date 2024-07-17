const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const bodyParser = require("body-parser");
router.use(bodyParser.json()); // JSON parser
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    const transformedUsers = users.map((user) => {
      const { name, ...rest } = user.toObject(); // Destructure 'name' and collect the rest of the fields
      return { username: name, ...rest }; // Return object with 'username' key and other fields
    });
    res.json(transformedUsers);
    res.status(201);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/api/users/:_id", async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/api/users", async (req, res) => {
  const user = new User({
    name: req.body.username,
  });
  try {
    const savedUser = await user.save();
    res.status(201).json({ username: savedUser.name, _id: savedUser._id });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

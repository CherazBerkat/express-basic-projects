const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../Models/user");
const Exo = require("../Models/exo");
router.get("/api/users/:_id/logs", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      const exos = await Exo.find({ user_id: req.params._id });
      if (!exos) {
        return res.status(404).send("No exercises found for this user");
      } else {
        exos.sort((a, b) => a.date - b.date);
        let newExos = exos;
        if (req.query.from) {
          const fromDate = new Date(req.query.from);
          newExos = exos.filter((e) => new Date(e.date) >= fromDate);
        }
        console.log("here");

        if (req.query.to) {
          const toDate = new Date(req.query.to);
          newExos = exos.filter((e) => e.date <= toDate);
        }

        if (req.query.limit) {
          newExos = exos.slice(0, req.query.limit);
        }

        const logs = newExos.map((e) => ({
          description: e.description,
          duration: e.duration,
          date: new Date(e.date).toDateString(),
        }));

        res.status(201).json({
          _id: user._id,
          username: user.name,
          count: logs.length,
          log: logs,
        });
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const usersRouter = require("../Controllers/users");
const exosRouter = require("../Controllers/exos");
const logsRouter = require("../Controllers/logs");

router.use(express.json());
router.use(usersRouter);
router.use(exosRouter);
router.use(logsRouter);

module.exports = router;

const express = require("express");
const { register, login } = require("../controller/Authcontroller");

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);

module.exports = router;

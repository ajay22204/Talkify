require('dotenv').config()

const express = require("express");
const { register, login } = require("../controller/Authcontroller");

const router = express.Router();

express.use(cors())
express.use(express.urlencoded({ extended: true }));
express.use(express.json())

mongoose.connect(process.env.DATABASE_URL)
    .then(err => console.error(err))
    .then(() => console.log('mogodb connected'))

router.post("/signup", register);
router.post("/login", login);

module.exports = router;
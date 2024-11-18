require('dotenv').config()
const express = require("express");
const { giveTranslatedText, getTranslationHistory, deleteTranslationHistory } = require("../controller/Translation.contoller");
const authenticateToken = require("../middleware/middleware");

const router = express.Router();

express.use(cors())
express.use(express.urlencoded({ extended: true }));
express.use(express.json())

mongoose.connect(process.env.DATABASE_URL)
    .then(err => console.error(err))
    .then(() => console.log('mogodb connected'))


router.post("/translate", authenticateToken, giveTranslatedText);
router.get("/history", authenticateToken, getTranslationHistory);
router.delete("/history", authenticateToken, deleteTranslationHistory);

module.exports = router;
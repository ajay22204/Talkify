const express = require("express");
const { giveTranslatedText, getTranslationHistory, deleteTranslationHistory } = require("../controller/Translation.contoller");
const authenticateToken = require("../middleware/middleware");

const router = express.Router();

router.post("/translate", authenticateToken, giveTranslatedText);
router.get("/history", authenticateToken, getTranslationHistory); 
router.delete("/history", authenticateToken, deleteTranslationHistory); 

module.exports = router;

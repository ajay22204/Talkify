const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  text: { type: String, required: true },
  translatedText: { type: String, required: true },
  sourceLang: { type: String, required: true },
  targetLang: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Translation", translationSchema);

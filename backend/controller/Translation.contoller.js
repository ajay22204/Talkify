const Translation = require("../model/TranslationModel");
const translate = require("translate-google-api"); 

const giveTranslatedText = async (req, res) => {
  const { text, sourceLang, targetLang } = req.body;
  const userId = req.user.userId; 

  try {
    const result = await translate(text, { from: sourceLang, to: targetLang });
    const newTranslation = new Translation({
      text,
      translatedText: result[0],
      sourceLang,
      targetLang,
      userId,
    });
    await newTranslation.save();

    res.status(200).json({ translatedText: result[0] });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ message: "Translation failed", error });
  }
};


const getTranslationHistory = async (req, res) => {
  const userId = req.user.userId; 

  console.log('User ID from token:', userId); 

  try {
    const history = await Translation.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Could not retrieve history", error });
  }
};

const deleteTranslationHistory = async (req, res) => {
  const userId = req.user.userId; 

  console.log('Deleting history for user:', userId); 

  try {
    await Translation.deleteMany({ userId });

    res.status(200).json({ message: "Translation history deleted successfully" });
  } catch (error) {
    console.error("Error deleting history:", error);
    res.status(500).json({ message: "Failed to delete history", error });
  }
};

module.exports = { giveTranslatedText, getTranslationHistory,deleteTranslationHistory};

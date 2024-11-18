const express = require("express");
const cors = require("cors");
const mongooseConnect = require("./config/mongooseConnect");
const authRouter = require("./routes/Auth.Routes");
const translationRouter = require("./routes/translation.routes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/api", translationRouter);

app.listen(PORT, async () => {
  await mongooseConnect();
  console.log(`Server running on http://localhost:${PORT}`);
});

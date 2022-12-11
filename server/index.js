import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenev from "dotenv";

import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const app = express();
dotenev.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("App is running");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, () => console.log(`server running on port: ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

// https://www.mongodb.com/cloud/atlas

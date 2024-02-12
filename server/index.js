const express = require("express");
const dotenv = require("dotenv");
const e = require("express");
const { errorHandler, notFound } = require("./handler/errorHandler");
dotenv.config();
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api", userRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});

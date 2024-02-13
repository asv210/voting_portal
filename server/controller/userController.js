const { UserModel } = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//LOGIN
const LoginController = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await UserModel.findOne({ userName: userName });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      res.status(400).json({ message: "invalid credential" });
    }
    const token = jwt.sign(
      {
        userName: user.userName,
        id: user._id,
      },
      process.env.SECRET_KEY
    );

    res.status(200).send({ user: user,token:token });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

//REGISTER
const RegisterController = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const isUser = await UserModel.findOne({ userName: userName });
    if (isUser) {
      return res.status(409).json({ message: "Email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        userName: userName,
        password: hashedPassword,
      });
      const savedUser=await user.save();
      const token = jwt.sign(
        {
          userName: savedUser.userName,
          id: savedUser._id,
        },
        process.env.SECRET_KEY
      );

      res.status(201).json({ user, token });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { LoginController, RegisterController };

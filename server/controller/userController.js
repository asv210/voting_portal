const { UserModel } = require("../models/userSchema");
const bcrypt =require("bcrypt")
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

      res.status(200).send({ user: user });

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
      const user = new UserModel({ userName: userName, password: hashedPassword });
      await user.save();
      res.status(201).json({ user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { LoginController, RegisterController };

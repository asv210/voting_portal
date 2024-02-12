const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created:{type:Date,default: Date.now},
  polls:[{type : mongoose.Schema.Types.ObjectId, ref:'Poll'}]
});
module.exports.UserModel = mongoose.model("User", userSchema);

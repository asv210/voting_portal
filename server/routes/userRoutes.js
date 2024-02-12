const express=require("express");
const { RegisterController, LoginController } = require("../controller/userController");
const router=express.Router();

router.post( "/login",LoginController)
router.post( "/register",RegisterController)

module.exports=router;
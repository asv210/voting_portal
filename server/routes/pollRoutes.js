const express=require('express');

const router=express.Router();
const {ShowAllPolls,CreatePolls,UsersPolls,getPollById,deletePoll, vote}=require("../controller/pollController");
const auth = require('../middleware/auth');

router.get('/getAllPolls',ShowAllPolls);
router.post("/addPolls",auth,CreatePolls);
router.get("/user",auth,UsersPolls);
router.get("/getPollById/:id", getPollById);
router.delete("/deletePoll/:id",auth,deletePoll)
router.post("/vote/:id",auth,vote);
module.exports=router
const PollModel = require("../models/pollSchema");
const { UserModel } = require("../models/userSchema");

const ShowAllPolls = async (req, res) => {
  try {
    const polls = await PollModel.find().populate("user", ["userName", "id"]);
    res.status(200).json(polls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const CreatePolls = async (req, res) => {
  try {
    console.log(req.decode);
    const { Question, options } = req.body;
    const newPoll = new PollModel({
      user: req.decode.id,
      Question: Question,
      options: options.map((option) => ({ option, votes: 0 })),
    });
    const user = await UserModel.findByIdAndUpdate(req.decode.id, {
      $push: { polls: newPoll._id },
    }).catch((err) => console.log(err));
    if (!user) return res.status(401).send("User not found!");
    const savedPoll = await newPoll.save();
    res.status(201).json(savedPoll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const UsersPolls = async (req, res, next) => {
  try {
    const id = req.decode.id;
    const user = await UserModel.findById(id).populate("polls");
    res.status(200).json(user.polls);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

const getPollById = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const poll = await PollModel.findById(req.params.id);
    if (!poll)
      return res.status(400).json({ message: "No polls with that ID" });
    return res.status(200).json(poll);
  } catch (err) {
    err.status = 400;
    next(400);
  }
};

const deletePoll = async (req, res, next) => {
  try {
    let deletedPoll = await PollModel.findByIdAndDelete(req.params.id);
    const { id: userId } = req.decode;
    console.log(userId);
    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { polls: req.params.id } }
    );
    res.status(200).json("deletedPoll successfully");
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

const vote = async (req, res, next) => {
  try {
    const { id: pollId } = req.params;
    const { id: userId } = req.decode;
    const { answer } = req.body;
    if (answer) {
      const poll = await PollModel.findById(pollId);
      if (!poll) {
        throw new Error("poll not found");
      } else {
        const vote = poll.options.map((option) => {
          if (option.option === answer) {
            return {
              option: option.option,
              _id: option._id,
              votes: option.votes + 1,
            };
          } else {
            return option;
          }
        });

        if (poll.votes.filter((user) => user.toString() === userId) <= 0) {
          poll.votes.push(userId);
          poll.options = vote;
          await poll.save();
          res.status(202).json(poll)
        } else {
          throw new Error("Already voted");
        }
      }
    }
    else{
      throw new Error("no answer provided")
    }
  } catch (err) {
    err.status=400;
    next(err);
  }
};
module.exports = {
  ShowAllPolls,
  CreatePolls,
  UsersPolls,
  getPollById,
  deletePoll,
  vote
};

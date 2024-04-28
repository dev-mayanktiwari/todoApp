const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://mayanktiwari:Maya1234@cluster0.r54hiez.mongodb.net/todo-app"
);

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  todo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "todoModel",
    }
  ]
});

const todoSchema = mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const todoModel = mongoose.model("todos", todoSchema);
const userModel = mongoose.model("users", UserSchema);

module.exports = {
  todoModel,
  userModel,
};

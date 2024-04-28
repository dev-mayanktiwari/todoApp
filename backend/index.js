const express = require("express");
const { User } = require("../type");
const UserMiddleware = require("../middleware/UserMiddleware");
const app = express();

app.use(express.json());

app.post("/signup", (req, res) => {
  try {
    const userInfo = req.body;
    const parsedUserInfo = User.safeParse(userInfo);
    if (!parsedUserInfo.success) {
      res.status(411).json({
        error: "Invalid input.",
      });
      return;
    }
  } catch (error) {
    console.log("Error in creating user: ", error);
    res.status(500).json({
      error: "Bad network gatewway",
    });
  }
});

app.post("/signin", UserMiddleware, (req,res) => {
    try {
        const {username, password} = req.body;
        

    }
})

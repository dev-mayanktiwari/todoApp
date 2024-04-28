
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

function UserMiddleware(req, res, next) {
  try {
    const token = req.headers.token;
    const words = token.split(" ");
    const jwttoken = words[1];

    const decodedValue = jwt.verify(jwttoken, JWT_SECRET);
    if (decodedValue.username) {
      req.username = decodedValue.username;
      next();
    } else {
      res.status(403).json({
        error: "User not found!!",
      });
    }
  } catch (error) {
    console.log("Error in user middleware: ", error);
    res.status(500).json({
      error: "User middleware not working!!",
    });
  }
}

module.exports = UserMiddleware
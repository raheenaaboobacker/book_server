const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
  //  console.log(req);
    const token = req.headers.authorization.split(" ")[1];
    console.log(token)
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    req.userData = { username: decodedToken.username, userId: decodedToken.userId,userRole:decodedToken.userRole };
    console.log(req.userData.username);
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!Please login" });
  }
};
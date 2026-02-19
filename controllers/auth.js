var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("./db");
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

const generateAccessToken = function (username, password) {
  return jwt.sign(
    { email: username, password: password },
    process.env.TOKEN_SECRET,
    { expiresIn: "30d" },
  );
};
const authenticateToken = async (req, res, next) => {
  console.log(req.headers);
  const token = req.headers["accesstoken"];
  console.log(token);
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);
    var userr = await db.users.findOne({ email: user.email });
    console.log(userr);
    req.user = userr;
    next();
  });
};

module.exports = {
  generateAccessToken,
  authenticateToken,
};

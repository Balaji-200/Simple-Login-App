const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Users = require("../model/user");
const passport = require("passport");
const authenticate = require("../src/authenticate");

router.use(bodyParser.json());
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res, next) => {
  Users.findOne({ username: req.body.username })
    .then(
      (user) => {
        if (user) {
          res.statusCode = 409;
          res.setHeader("Content-Type", "application/json");
          res.json({
            success: true,
            message: `An account with ${user.username} already exists. Please Login.`,
            user: user,
          });
        } else {
          Users.register(
            { username: req.body.username, email: req.body.email },
            req.body.password,
            (err, user) => {
              if (err) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.json({ err: err });
              } else {
                passport.authenticate("local")(req, res, () => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({
                    success: true,
                    message: `Account with username ${user.username} created.`,
                    user: {
                      username: user.username,
                      email: user.email,
                    },
                  });
                });
              }
            }
          );
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ mess: "Username or password is incorrect." });
      return;
    }
    req.login(user, (err) => {
      if (err) return next(err);
      const token = authenticate.getToken({ _id: user._id });
      res.statusCode = 200;
      // res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        message: "Successfully Logged in.",
        token: token,
      });
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, message: "Successfully Logged Out." });
});

router.get("/dashboard", authenticate.verifyUser, (req, res, next) => {
  console.log(req.user.username);
  if (req.user) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      username: req.user.username,
      message: "Successfull!!",
    });
  }
});
module.exports = router;

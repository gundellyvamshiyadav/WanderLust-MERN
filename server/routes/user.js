const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user.js");

router.get("/me", userController.checkLoggedInUser);
// Signup Route
router.post("/signup", userController.signUp);

// Login Route
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err); 
        }
        if (!user) {
            return res.status(401).json({ message: info.message || "Invalid credentials." });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return userController.logIn(req, res);
        });
    })(req, res, next);
});

router.post("/logout", userController.logOut); 

module.exports = router;
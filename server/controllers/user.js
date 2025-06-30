const User = require("../models/user.js");

module.exports.signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            res.status(200).json({ user: req.user, message: "Welcome to Wanderlust!" });
        });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

module.exports.logIn = (req, res) => {
    res.status(200).json({ user: req.user, message: "Welcome back to Wanderlust!" });
};

module.exports.logOut = (req, res, next) => { 
    req.logout((err) => {
        if (err) return next(err);
        res.status(200).json({ message: "Logout successful" });
    });
};

module.exports.checkLoggedInUser = (req, res) => {
    if (req.isAuthenticated()) {
        const { _id, username, email } = req.user;
        return res.status(200).json({ _id, username, email });
    } else {
        return res.status(200).json(null);
    }
};
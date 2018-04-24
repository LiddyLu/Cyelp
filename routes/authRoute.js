const passport = require("passport");
var express = require('express');
var router = express.Router();
var User = require("../db/userModel");

    router.get("/google", passport.authenticate("google", {
        scope: ['profile', 'email']
    }));

    router.get("/google/callback", passport.authenticate("google"), (req, res) => {
        res.redirect('/restaurants');
    });

    router.get("/github", passport.authenticate("github", {
        scope: ['profile', 'email']
    }));

    router.get("/github/callback", passport.authenticate("github"), (req, res) => {
        res.redirect('/restaurants');
    });

module.exports = router;
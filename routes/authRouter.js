const Router = require("express");
const controller = require('../controllers/authController')
const { check } = require("express-validator");
const passport = require('passport')

const router = new Router();

router.post("/signup", [
    check("id", "field id is empty").notEmpty(),
    check("password", "field password must have from 4 to 10 letterы").isLength({ min: 4, max: 10 }),
  ],
  controller.signUp
);
// creation of new user
// ⁃ Fields id and password. Id - phone number or email. After signup add field `id_type` - phone or email
// ⁃ In case of successful signup - return token

router.post("/signin", controller.signIn); //request for bearer token by id and password

router.get("/info", 
passport.authenticate('jwt', { session: false }), 
controller.info); // - returns user id and id type  +

router.get("/logout",
passport.authenticate('jwt', { session: false }),
controller.logOut); // ] - with param `all`:
// ⁃ true - removes all users bearer tokens
// ⁃ false - removes only current token

module.exports = router;

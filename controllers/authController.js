const { validationResult } = require("express-validator");
const User = require("../modelsMongoDB/user-model");
const jwt = require("jsonwebtoken");


const { secretAccess, secretRefresh } = require("../configJWT");
const secrets = require('../configJWT')
const errorHandler = require('../utils/errorHandler')


const bcryptjs = require("bcryptjs");
const salt = bcryptjs.genSaltSync(10);

class authController {
  async signIn(req, res) {
    const { id, password } = req.body;
    const candidate = await User.findOne({ id: id });
    if (!candidate) {
      return res.status(404).json({ massage: " this id not be founded" });
    }

    const passwordResult = bcryptjs.compareSync(password, candidate.password); // true or false
    if (!passwordResult) {
      return res.status(401).json({ massage: " wrong password" });
    }
    
    const token = jwt.sign(
      {
        userId: candidate._id,
        id: candidate.id,
        id_type: candidate.id_type,
      },
      secretAccess,
      { expiresIn: 10 * 60 }
    ); // 10 min
    candidate.isActivated = true
    candidate.token = token

    candidate.save();

    res.status(200).json({ token: `Bearer ${token}`});
  }

  async signUp(req, res) {
    const { id, password } = req.body;
    const candidate = await User.findOne({ id: id });
    if (candidate) {
      return res.status(409).json({ massage: " this id already exist " });
    }
    const hashPassword = bcryptjs.hashSync(password, salt);
    let user;
    if (id.includes("@")) {
      user = new User({ id: id, id_type: "email", password: hashPassword });
    } else {
      user = new User({
        id: id,
        id_type: "phone_number",
        password: hashPassword,
      });
    }
    user
      .save()
      .then(() => {
        console.log("user saved");
        res.status(201).json(user);
      })
      .catch((error) => {
       errorHandler(res, error)
      });
  }

  async info(req, res) {
    try {
      // const users = await User.find()
      // res.json(users)
      const token = req.headers.authorization.split(' ')[1];
      const userData = jwt.verify(token, secrets.secretAccess);
     
      const candidate = await User.findOne({ id: userData.id });
      const newToken = jwt.sign(
        {
          userId: candidate._id,
          id: candidate.id,
          id_type: candidate.id_type,
        },
        secretAccess,
        { expiresIn: 10 * 60 }
      ); // 10 min
      candidate.isActivated = true
      candidate.token = newToken
      candidate.save();
      
      res.status(200).json({
        id: userData.id,
        id_type: userData.id_type,
        newtoken: `Bearer ${newToken}`
      });
    } catch (error) {
      console.log(error);
    }
  }
  async logOut(req, res) {
    try {
      
      const token = req.headers.authorization.split(' ')[1];
      const userData = jwt.verify(token, secrets.secretAccess);
      const user = await User.findOne({ id: userData.id });

      if (req.query.all == 'false') {
          user.token = ''
      } else {user.token = ''}
      user.isActivated = false,
      await user.save()
      const newUser = await User.findOne({ id: userData.id });
      res.status(200).json({
        isActivated: req.query.all,
        message: newUser
      }
       
      );
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new authController();

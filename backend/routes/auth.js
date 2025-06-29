import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchuser from "../middleware/fetchuser.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//Route 1 : Create a user using: POST "/api/auth/". No login required
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password should be minimum 5 characters").isLength({
      min: 5,
    }),
  ],
    async (req, res) => {
    //Checking if there are errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
      let success = false
      //Check whether user exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success,
            error: `Sorry a user with this email: ${req.body.email} already exists`,
          });
      }

      const salt = await bcrypt.genSalt(10);
      //Creating a secure password
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user : {
            id: user.id
        }
      }

      success = true;
      //Returning a token to the user after logging in
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);

      res.json({success, authToken});

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//Route 2 : Authenticate a user using POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
  ],
  async (req, res) => {

    //Checking if there are errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    try {
      let success = false;
        let user = await User.findOne({email});

        //Check for wether user with that email exists or not
        if(!user) {
            return res.status(400).json({success, error : "Please try to login with correct credentials"});
        }

        //Checking if the password is correct
        const PasswordCompare = await bcrypt.compare(password, user.password);
        if(!PasswordCompare) {
            return res.status(400).json({success, error : "Please try to login with correct credentials"});
        }

        //If credentials are correct, send user their data(only id) and token
        const data = {
            user: {
               id: user.id 
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({success, authToken});

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
    
  }
)

//Route 3 : Get logged in user details using POST "api/auth/getuser". Login requires
router.post("/getuser", fetchuser, async (req, res) => {

    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }
  }
)

export default router;

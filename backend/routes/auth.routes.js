import {Router} from "express"
import User from "../models/user.models.js";
import { protect } from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken"

const router = Router();

router.post("/register" , async (req , res) => {
  const {username , email , password} = req.body;

  try {
    if(!username || !email || !password){
      return res.status(400).json({
        message : "Please Fill all the Fields"
      })
    }
    const userExist = await User.findOne({email});
    if(userExist){
      return res.status(400).json({
        message : "User Already Exists!!"
      })
    }
    const user = await User.create({
      username , email , password
    });
    const token = generateToken(user._id)
    res.status(201).json({
      id : user._id,
      username : user.username,
      email : user.email,
      token
    })
  } catch (error) {
    res.status(500).json({
      message : 'Server Error'
    })
  }
});

router.post("/login" , async (req , res) => {
  const {email , password} = req.body;
  
  try {
    const user = await User.findOne({email});
    if(!user || !(await user.matchPassword(password))){
      return res.status(401).json({
        message : 'Invalid Credentials'
      })
    }
    const token = generateToken(user._id)
    res.json({
      id : user._id,
      username : user.username,
      email : user.email,
      token
    })
  } catch (error) {
    res.status(500).json({
      message : 'Server Error'
    })
  }
});

router.get("/me" , protect , async(req , res) => {
  res.status(200).json(req.user)
})

const generateToken = (id) => {
  return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn : "30d"});
}

export default router;
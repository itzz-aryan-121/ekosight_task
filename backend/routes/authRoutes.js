import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { newToken } from '../utils/generateToken.js';


const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        const token = newToken(user._id);
        res.status(201)
            .cookie('token', token, { httpOnly: true, sameSite: 'lax' })
            .json({ message: 'User Registered Successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(400).json({ message: "Invalid credentials" });

        const token = newToken(user._id);

        res
            .cookie("token", token, { httpOnly: true, sameSite: "lax" })
            .json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
})


router.post('/logout' , (req , res) => {
    res.clearCookie('token' ).json({ message: 'Logged Out Successfully' });
})


router.get('/me' , async (req , res)=>{
    try {
        const token = req.cookies?.token;

        if(!token) return res.json({ user: null });

        const uncode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(uncode.id).select("-password");
        res.json({ user });

    } catch (error) {
      res.json({ user: null });   
    }
})


export default router;
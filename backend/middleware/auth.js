import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const authenticate = async ( req , res , next ) => {
    try {
        const token =  req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if(!token) return res.status(401).json({ message: 'Not Authorized'});

    const uncode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(uncode.id).select("-password");


    if(!req.user) return res.status(401).json({ message: 'No User Found'});

    next();

    } catch (error) {
        res.status(401).json({ message: "Invalid Token Found" });
    }
}

export default authenticate;

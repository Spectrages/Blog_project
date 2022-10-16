import jwt from 'jsonwebtoken'
import {secret} from '../config.js'

export default (req, res, next) => {
    if(req.method === "OPTIONS") {
        next();
    }
    try{
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if(!token) {
            return res.status(403).json({message: "No access"})
        }
        req.userId = jwt.verify(token, secret)._id;
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: "No access"})
    }
};
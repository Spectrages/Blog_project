import bcrypt from "bcrypt";
import UserModel from "../model/user.js";
import jwt from "jsonwebtoken";
import { secret } from "../config.js";

export const register = async (req, res) => {
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = bcrypt.hashSync(password, salt);

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            hashPassword: hash,
            avatarUrl: req.body.avatarUrl,
            createdAt: Date.now()
        });

        const user = await doc.save();

        const token = jwt.sign({
                _id: user._id,
            }, secret,
            { expiresIn: '30d' }
        );

        const {hashPassword, ...userData} = user._doc;

        await res.json({...userData, token})
    } catch (error) {
        res.status(500).json({message: `Registration error: ${error}`});
    }
};

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({email: req.body.email});
        if(!user) {
            return res.status(403).json({message: 'Wrong login or password'})
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.hashPassword);
        if(!isValidPass){
            res.status(403).json({message: 'Wrong login or password'})
        }
        const token = jwt.sign({
                _id: user._id,
            }, secret,
            { expiresIn: '30d' }
        );
        const {hashPassword, ...userData} = user._doc;
        await res.json({...userData, token})

    }   catch (error) {
        res.status(500).json({message: `Login error: ${error}`})
    }
};

export const getMe = async (req, res) => {
    try{
        const user = await UserModel.findById(req.userId);

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const {hashPassword, ...userData} = user._doc;
        await res.json(userData);
    } catch (error) {
        res.status(500).json({message: `No access: ${error}`});
    }
};
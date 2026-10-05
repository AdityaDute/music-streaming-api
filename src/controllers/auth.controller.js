const userModel = require('../model/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerUser(req, res){
    const {username, email, password, role = "user"} = req.body;


    const isUserAlreadyExist = await userModel.findOne({
        $or : [
            {username},
            {email}
        ]
    })

    if(isUserAlreadyExist){
        return res.status(409).json({message:"User Already Exist"})
    }

    const hash = await bcrypt.hash(password,10)

    const user  = await userModel.create({
        username,
        email,
        password: hash,
        role
    })

    const token = jwt.sign({
        id:user._id, 
        role:user.role 
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message:"User Register Succesfully",
        user
    })
}

async function loginUser(req, res){
    const {username, email, password} = req.body;

    const user = await userModel.findOne({
        $or : [
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(401).json({message: "Invalid Cradentials"})
    }

    const isPasswordvalid = await bcrypt.compare(password, user.password)

    if(! isPasswordvalid){
        return res.status(401).json({message:"Invalid cradentials"})
    } 

    const token = await jwt.sign({
        id:user._id ,
        role:user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({message:"login succesfully", user})

}

module.exports = {registerUser, loginUser}
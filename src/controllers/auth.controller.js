const { default: mongoose } = require('mongoose');
const userModel = require('../model/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerUser(res, req){
    const {username, email, passward, role = "user"} = req.body

    const isUserAlreadyExist = await userModel.findone({
        $or : [
            {username},
            {email}
        ]
    })

    if(isUserAlreadyExist){
        res.status(409).json({message:"User Already Exist"})
    }

    const hash = await bcrypt.hash(passward,10) 

    const user  = await userModel.create({
        username,
        email,
        passward: hash,
        role
    })

    const token = jwt.sign({
        id:user._id, 
        role:user.role 
    })

    res.cookies("token", token)

    res.status(201).json({
        message:"User Register Succesfully"
    })
}

module.exports = {registerUser}
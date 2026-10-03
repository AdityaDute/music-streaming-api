const mongoose = require('mongoose')

async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected succesfully")
    }catch(err){
        console.error("database error occured:",err )
    }
} 


module.exports = connectDb ; 
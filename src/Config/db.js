const mongoose = require(`mongoose`);
require("dotenv").config();

const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/authDB1";

const ConnectDb = async (req,res) => {
    try{
        await mongoose.connect(DB_URI);
        console.log(`Authentication Database connected successfully`);
    }catch(error) {
        console.error(`Database Connection Failed`,error)
        process.exit(1);
    }
}




module.exports = ConnectDb;
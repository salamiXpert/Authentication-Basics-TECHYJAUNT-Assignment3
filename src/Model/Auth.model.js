const mongoose = require(`mongoose`);

const AuthSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email : {
        type : String,
        required :true,
        unique : true
    },
    otp :{
        type :String
    },
    Otp_Expiry:{
        type: Date
    },
    password : {
        type : String,
        required : true
    },
    isVerified:{
        type: Boolean,
        default:false
    }
},{
    timestamp : true,
     versionkey :false
});


const Auth_Schema =  mongoose.model(`Auth_Schema`,AuthSchema);

module.exports = Auth_Schema;
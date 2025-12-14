
const bcrypt = require(`bcryptjs`);
const Auth_Schema = require("../Model/Auth.model");


const SignUp = async (req,res) =>{
    const {name,email,password} = req.body;
    try{
        if(!name ||!email ||!password) {
            return res.status(401).json({message:`All fields are required`});
        }
        const ExistingUser = await Auth_Schema.findOne({email});
        if(ExistingUser) {
            return res.status(409).json({message:`User Already Exist`});
        }
        const hashedpassword = await bcrypt.hash(password,10);
        const otp = Math.floor(100000 + Math.random() * 900000);
        const Otp_Expiry = new Date(Date.now() + 10 * 60 * 1000);
        const NewUser = new Auth_Schema({
            name,
            email,
            password : hashedpassword,
            otp,
            Otp_Expiry
        })
        await NewUser.save();
        return res.status(201).json({message:`Signup successfull`,otp});
    }catch(error) {
        console.error(`Error during signup`,error);
        return res.status(500).json({message:`Internal server error`});
    }
}



const Login = async (req,res) => {
    const {email,password} = req.body;
    try {
        if(!email||!password) {
            return res.status(402).json({message:`All field are required`});
        }
        const Userlogin = await Auth_Schema.findOne({email});
        if(!Userlogin) {
            return res.status(409).json({message:`User not Found`});
        }
        const ComparedPassword = await bcrypt.compare(password,Userlogin.password);
        if(!ComparedPassword) {
            return res.status(401).json({message:`Invalid Credentials`});
        }
        if(!Userlogin.isVerified) {
            return res.status(409).json({message:`User not verified,Please verify your account`})
        }
        return res.status(201).json({message:`Login successfully`});
    }catch(error) {
        console.error(`Failed to login`,error);
        return res.status(500).json({message:`internal server error`});
    }
};


const Forgotpassword = async (req,res) => {
    const {email} = req.body;
    try {
        if(!email) {
            return res.status(409).json({message:`Email is required`});
        }
        const User = await Auth_Schema.findOne({email});
            if(!email) {
                return res.status({message:`User not Found`});
            }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        User.otp = otp
        await User.save();
        return res.status(200).json({message:`OTP sent successfully`,otp});
    }catch(error) {
        console.error(`Failed at recovering your password`,error);
        return res.status(500).json({message:`Internal server error`});
    }
};


const Reset_password = async (req,res) => {
    const {otp,newPassword} = req.body;
    try{
        if(!otp||!newPassword) {
            return res.status(400).json({messsage:`All fields are required`});
        }
        const User = await Auth_Schema.findOne({otp});
    if(!User){
        return res.status(401).json({message:`Invalid OTP`});
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);
    User.password = hashedPassword;
    User.otp = null;
    await User.save();
    return res.status(201).json({message:`Password reset successfully`});
    }catch(error) {
        console.error(`Error in reseting your password`,error)
        return res.status(500).json({message:`Internal server error`});
    }
};

const Otp_Verification = async (req,res) => {
    const {otp} = req.body;
    try{
        if(!otp) {
            return res.status(409).json({message:`OTP IS required`});
        }
        const Verification = await Auth_Schema.findOne({otp})
            if(!Verification) {
                return res.status(401).json({message:`Invalid OTP`});
            }
            if(Verification.Otp_Expiry < Date.now()) {
                return res.status(400).json({message:`Expired OTP`});
            }
           Verification.isVerified = true;
           Verification.otp = null;
           Verification.Otp_Expiry = null;
           await Verification.save();
           return res.status(200).json({message:`OTP Verification successfull`});
    }catch(error) {
        console.error(`Failed to verify your OTP`,error);
        return res.status(500).json({messsage:`Internal server error`});
    }
}
   

const Resend_otp = async (req,res) => {
    const {email} = req.body;
    try {
        if(!email) {
            return res.status(401).json({message:`Email is required`})
        }
        const Resend = await Auth_Schema.findOne({email}) 
        if(!Resend) {
            return res.status(400).json({message:`User email not found`});
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
         Otp_Expiry = new Date(Date.now() + 10 * 60 * 1000);
        Resend.otp = otp;
        Resend.Otp_Expiry = Otp_Expiry;
        await Resend.save();
        return res.status(200).json({message:`OTP resent successfully`,otp});
    }catch(error) {
        console.error(`Failed to resend OTP`)
        return res.status(500).json({message:`Internal server error`});
    }
}



module.exports = {SignUp,Login,Forgotpassword,Reset_password,Otp_Verification,Resend_otp};
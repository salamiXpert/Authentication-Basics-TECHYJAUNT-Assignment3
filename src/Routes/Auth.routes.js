const express = require(`express`);
const {SignUp,Login,Forgotpassword,Reset_password, Otp_Verification,Resend_otp} = require("../Controller/Auth.controller");
const Router = express.Router();


Router.post(`/SignUp`,SignUp);
Router.post(`/Login`,Login);
Router.put(`/Forgotpassword`,Forgotpassword);
Router.put(`/Reset_password`,Reset_password);
Router.put(`/Otp_Verification`,Otp_Verification);
Router.put(`/Resend_otp`,Resend_otp);


module.exports = Router;
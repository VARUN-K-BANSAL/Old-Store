require('dotenv').config()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const COOKIE_NAME = process.env.COOKIE_NAME
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
const OTP_LENGTH = 6
const OTP_CONFIG = {
    upperCaseAlphabets: false,
    specialChars: false,
}
const GMAIL_ID = process.env.GMAIL_ID
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD
let encryption = require('../public/scripts/encryption')
const Cart = require('../models/cart')

const showLoginPage = async (req, res) => {
    try {
        let token = req.cookies[COOKIE_NAME]
        if (token != undefined) {
            token = token.token;
            const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
            if (verifyUser) {
                const user = await User.findOne({ _id: verifyUser._id })
                if (user && user.active) {
                    if(user.isAdmin) {
                        return res.redirect('/user/adminDashboard')
                    }
                    return res.render('/')
                } else if(!user) {
                    res.render('login', {
                        Message: "No user found"
                    })
                } else {
                    res.render('login', {
                        Message: "Your account is not active"
                    })
                }
            } else {
                return res.render('login', {
                    Message: "No user found"
                })
            }
        } else {
            res.render('login', {
                Message: ""
            })
        }
    } catch (e) {
        console.log(e);
        res.render('login', {
            Message: "Some error occured"
        })
    }
}

const showRegisterPage = (req, res) => {
    res.render('register');
}

const checkCreds = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email == undefined || email == null || password == undefined || password == null || email == '' || password == '') {
            return res.redirect('/login')
        }
    
        let user = await User.findOne({ email })
        if (user != null && user != undefined) {
            if(user.isAdmin) return res.redirect('/user/adminlogin')
            if (await encryption.comparePasswords(user.password, password) && user.active == true) {
                const token = await user.generateAuthToken();
                res.cookie(COOKIE_NAME, {
                    token: token
                })
                await user.save();
                return res.redirect('/')
            }
        }
        res.render('login', {
            Message: "Invalid Credentials"
        })
    } catch (e) {
        res.render('login', {
            Message: "Some error occured"
        })
    }
}

const addData = async (req, res) => {
    const {
        userName,
        email,
        password,
        batch
    } = req.body

    let encryptedPassword = String(await encryption.encrypt(password))
    let user = await User.findOne({ email })
    if (user) {
        return res.redirect('/user/login')
    }
    try {
        
        const otp = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
        const registerUser = new User({
            name: userName,
            email: email,
            password: encryptedPassword,
            batch: batch,
            active: false,
            otp: otp,
            isAdmin: false
        })
        const token = await registerUser.generateAuthToken();
        await registerUser.save()
        const msg = {
            from: GMAIL_ID,
            to: email,
            subject: "Email Verification",
            text: "Welcome to the application! your otp for verification is " + otp
        }
        nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: GMAIL_ID,
                pass: GMAIL_PASSWORD
            },
            port: 465,
            host: "smtp.gmail.com"
        })
        .sendMail(msg, (err) => {
            if (err) res.send("Not able to send otp. Please try after some time.");
            console.log('Mail sent successfully');
        })
        res.cookie(COOKIE_NAME, {
            token: token
        })
        res.redirect('/user/verify')
    } catch (error) {
        console.log(error);
    }
}

const showDashboardPage = async (req, res) => {

}

const verifyUser = async (req, res) => {
    try {
        const { otp } = req.body
        const token = req.cookies[COOKIE_NAME].token
    
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        if (verifyUser) {
            let user = await User.findOne({ _id: verifyUser._id })
            if (user.otp == otp) {
                user.active = true
                await user.save();
                let newCart = new Cart({
                    userId: verifyUser._id,
                    products: [],
                    amount: 0
                })
                await newCart.save();
                res.status(200).redirect('/')
            } else {
                res.redirect('/user/verify')
            }
        } else {
            res.redirect('/user/login')
        }
    } catch(e) {
        console.log(e);
        res.redirect('/user/verify')
    }
}

const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body
    
        let user = await User.findOne({ email: email })
        if(user) {
            const otp = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
            user.otp = otp
            const msg = {
                from: GMAIL_ID,
                to: email,
                subject: "Email Verification",
                text: "Welcome to the application! your otp for verification is " + otp
            }
            nodemailer
            .createTransport({
                service: "Gmail",
                auth: {
                    user: GMAIL_ID,
                    pass: GMAIL_PASSWORD
                },
                port: 465,
                host: "smtp.gmail.com"
            })
            .sendMail(msg, (err) => {
                if (err) res.send("Not able to send otp. Please try after some time.");
                console.log('Mail sent successfully');
            })
            res.redirect('/user/verify')
        }
        res.redirect('/user/register')
    } catch(e) {
        console.log(e);
        res.redirect('/user/register')
    }
}

const showCart = async (req, res) => {
    res.render('cart')
}

const showChat = async (req, res) => {
    const id = req.params.userId
    res.render('chat', {
        id: id        
    })
}

const addChat = async (req, res) => {
    const receiverId = req.params.userId
    const message = req.body.message
    let receiver = await User.findById(receiverId)
    let user = await User.findById(req.user._id)

    if(user && receiver) {
        let i = 0;
        let isFound = false;
        let ind = -1
        while(user.chats[i] != undefined) {
            if(user.chats[i].userId == receiver._id) {
                isFound = true;
                ind = i;
                break;
            }
            i++
        }

        if(isFound) {
            user.chats[i].messages.push({
                message: message,
                isSent: true
            })
            i = 0;
            while(receiver.chats[i] != undefined) {
                if(receiver.chats[i].userId == user._id) {
                    receiver.chats[i].messages.push({
                        message: message,
                        isSent: false
                    })
                    break;
                }
                i++
            }
        }
        else {
            user.chats.push({
                userId: receiver._id,
                messages: [{
                    message: message,
                    isSent: true
                }]
            })
            receiver.chats.push({
                userId: user._id,
                messages: [{
                    message: message,
                    isSent: false
                }]
            })
        }
        await user.save()
        await receiver.save()
    } else {
        return res.send('User not found')
    }
    res.redirect('/user/chat/'+receiver._id)
}

const showAllChats = async (req, res) => {
    res.render('showChats')
}

const sendChat = async (req, res) => {
    const receiverId = req.params.userId
    let i = 0;
    let user = req.user
    while(user.chats[i] != undefined) {
        if(user.chats[i].userId == receiverId) {
            return res.send(user.chats[i])
        }
        i++
    }
    res.send(null)
}

const sendUser = async (req, res) => {
    const id = req.params.userId
    let user = await User.findById(id)
    res.send(user)
}

const sendChats = async (req, res) => {
    res.send(req.user.chats)
}

const checkAdminCreds = async (req, res) => {
    const { email, password } = req.body
    if (email == undefined || email == null || password == undefined || password == null || email == '' || password == '') {
        return res.redirect('/login')
    }

    let user = await User.findOne({ email })
    if(user == null || user == undefined) return res.redirect('/user/adminlogin')
    if(!user.isAdmin) return res.redirect('/user/login')
    if (await encryption.comparePasswords(user.password, password) && user.active == true) {
        const token = await user.generateAuthToken();
        res.cookie(COOKIE_NAME, {
            token: token
        })
        await user.save();
        return res.redirect('/user/adminDashboard')
    }
    res.redirect('/user/adminlogin')
}

module.exports = {
    showLoginPage,
    showRegisterPage,
    checkCreds,
    addData,
    showDashboardPage,
    verifyUser,
    forgotPassword,
    showCart,
    showChat,
    addChat,
    sendChat,
    sendUser,
    sendChats,
    showAllChats,
    checkAdminCreds
}
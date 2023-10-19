const auth = require('../middlewares/auth')
const express = require('express')
const Cart = require('../models/cart')
const User = require('../models/user')
const router = express.Router()
const COOKIE_NAME = process.env.COOKIE_NAME
const jwt = require('jsonwebtoken')

router.get('/getCookieDetails', auth, (req, res) => {
    res.send(req.cookies)
})

router.get('/getUserDetail', auth, (req, res) => {
    res.send(req.user)
})

router.get('/getCartDetails', auth, async (req, res) => {
    let cart = await Cart.findOne({userId: req.user._id})
    res.send(cart)
})

router.get('/logout', auth, async (req, res) => {
    const token = req.cookies[COOKIE_NAME].token
    const verifyUser = await jwt.verify(token, process.env.SECRET_KEY)
    const user = await User.findOne({_id: verifyUser._id})
    if(user) {
        res.clearCookie(COOKIE_NAME)
        req.user.tokens = req.user.tokens.filter((curr) => {
            return curr.token != req.token
        })
        await req.user.save();
        res.redirect('/')
    } else {
        console.log('User not found error');
        res.send('some error occurred');
    }
})

module.exports = router
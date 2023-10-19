const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const userController = require('../controllers/user')

router.get('/login', userController.showLoginPage)
router.get('/register', userController.showRegisterPage)
router.post('/login', userController.checkCreds)
router.post('/register', userController.addData)
router.post('/verify', userController.verifyUser)
router.post('/forgotpass', userController.forgotPassword)
router.get('/dashboard', userController.showDashboardPage)
router.get('/profile', auth, (req, res) => {res.render('profile')})
router.get('/verify', (req, res) => {res.render('verify')})
router.get('/forgotPass', (req, res) => {res.render('forgot')})
router.get('/orders', (req, res) => {res.render('orders')})
router.get('/adminlogin', (req, res) => {res.render('adminLogin', {message: ''})})
router.get('/cart', userController.showCart)
router.get('/chat/:userId', auth, userController.showChat)
router.get('/chats', auth, userController.showAllChats)
router.get('/getChats/:userId', auth, userController.sendChat)
router.get('/getUser/:userId', auth, userController.sendUser)
router.get('/getChats', auth, userController.sendChats)
router.post('/chat/:userId', auth, userController.addChat)
router.post('/adminlogin', userController.checkAdminCreds)
router.get('/adminDashboard', auth, (req, res) => {res.render('adminDashboard')})
router.get('/myproducts', auth, (req, res) => {res.render('myProducts')})

module.exports = router;
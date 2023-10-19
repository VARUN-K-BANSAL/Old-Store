const auth = require('../middlewares/authAdmin')
const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const User = require('../models/user')
const Report = require('../models/report')
const adminController = require('../controllers/admin')

router.get('/getOrders', auth, async (req, res) => {
    let orders = await Order.find()
    res.send(orders)
})
router.get('/getUsers', auth, async (req, res) => {
    let users = await User.find()
    res.send(users)
})

router.get('/getReports', auth, async (req, res) => {
    let reports = await Report.find()
    res.send(reports)
})

router.get('/suspendUser/:uid/:rid', auth, adminController.suspendUser)
router.get('/removeSuspension/:uid', auth, adminController.removeSuspension)


module.exports = router
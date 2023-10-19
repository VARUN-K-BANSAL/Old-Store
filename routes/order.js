const auth = require('../middlewares/auth')
const express = require('express')
const router = express.Router()
const ordersController = require('../controllers/order')

router.get('/new', auth, (req, res) => {res.render('confirmOrder')})
router.post('/new', auth, ordersController.newOrder)
router.get('/all', auth, ordersController.getAllOrders)
router.get('/cancel/:oid', auth, ordersController.cancelOrder)

module.exports = router
const auth = require('../middlewares/auth')
const express = require('express')
const router = express.Router()
const reportController = require('../controllers/report')

router.get('/product/:pid', auth, reportController.showReportProduct)
router.get('/user/:pid', auth, reportController.showReportUser)
router.post('/user/:pid', auth, reportController.userReport)
router.post('/product/:pid', auth, reportController.productReport)

module.exports = router
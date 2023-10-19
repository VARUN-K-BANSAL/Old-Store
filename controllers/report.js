const Product = require('../models/product')
const Report = require('../models/report')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const productReport = async (req, res) => {
    const pid = req.params.pid
    const product = await Product.findById(pid)
    const message = req.body.message
    if (product) {
        let report = new Report({
            complainer: req.user._id.toString(),
            suspect: pid,
            message: message
        })
        await report.save()
        return res.redirect('/')
    }
    res.send('Page 404 not found')
}

const userReport = async (req, res) => {
    const pid = req.params.pid
    const product = await Product.findById(pid)
    const message = req.body.message
    if (product) {
        const seller = await User.findById(product.owner)
        if(seller) {
            let report = new Report({
                complainer: req.user._id.toString(),
                suspect: seller._id,
                message: message
            })
            await report.save()
            return res.redirect('/')
        }
    }
    res.send('Page 404 not found')
}

const showReportProduct = async (req, res) => {
    const pid = req.params.pid;
    const product = await Product.findById(pid);
    if(product) {
        return res.render('reportProduct', {
            pid: pid,
            product: product.title
        })
    }
    res.send('Cannot report the product at this time. Please try again later.')
}

const showReportUser = async (req, res) => {
    const pid = req.params.pid;
    const product = await Product.findById(pid);
    if(product) {
        const seller = await User.findById(product.owner)
        if(seller) {
            return res.render('reportUser', {
                pid: pid,
                product: seller.name
            })
        }
    }
    res.send('Cannot report the product at this time. Please try again later.')
}

module.exports = {
    productReport,
    userReport,
    showReportProduct,
    showReportUser
}
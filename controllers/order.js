const Cart = require('../models/cart')
const Order = require('../models/order')

const newOrder = async (req, res) => {
    let cart = await Cart.findOne({userId: req.user._id})
    if(cart) {
        const address = req.body.address
        let order = new Order({
            userId: req.user._id,
            products: cart.products,
            amount: cart.amount,
            address: address,
            status: "pending"
        })
        cart.products = cart.products.filter((product) => 1==2)
        cart.amount = 0;
        await cart.save();
        await order.save();
        return res.redirect('/')
    }
    res.redirect('/')
}

const getAllOrders = async (req, res) => {
    const user = req.user
    const orders = await Order.find()
    let order = []
    let i = 0;
    while(orders[i] != undefined) {
        if(orders[i].userId == user._id) {
            order.push(orders[i])
        }
        i++
    }
    res.send(order)
}

const cancelOrder = async (req, res) => {
    const oid = req.params.oid
    let order = await Order.findById(oid)
    if(order) {
        order.status = 'cancel'
    }
    await order.save();
    res.redirect('/user/orders')
}

module.exports = {
    newOrder,
    getAllOrders,
    cancelOrder
}
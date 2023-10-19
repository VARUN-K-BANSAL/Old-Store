require('dotenv').config()
const Product = require('../models/product')
const jwt = require('jsonwebtoken')
const COOKIE_NAME = process.env.COOKIE_NAME
const Cart = require('../models/cart')

const findAllProducts = async (req, res) => {
    const products = await Product.find()
    res.send(products)
}

const addProduct = async (req, res) => {
    const {
        title,
        description,
        price,
        encodedImage,
        tags
    } = req.body

    let verifyUser
    let token = req.cookies[COOKIE_NAME]
    if (token != undefined) {
        token = token.token;
        verifyUser = jwt.verify(token, process.env.SECRET_KEY)
    }
    let tagsArr = tags.split(',')
    const addProduct = new Product({
        title: title,
        desc: description,
        img: encodedImage,
        price: price,
        tags: tagsArr,
        owner: verifyUser._id
    })
    await addProduct.save()
    res.redirect('/')
}

const findProduct = async (req, res) => {
    const pid = req.params.pid
    let product = await Product.findById(pid)
    if(product) {
        res.render('productDetail', product)
    } else {
        res.send('page 404 Not Found')
    }
}

const findProductApi = async (req, res) => {
    const pid = req.params.pid
    let product = await Product.findById(pid)

    if(product) {
        res.send(product)
    } else {
        res.send(null)
    }
}

const buyProduct = async (req, res) => {
    try {
        const pid = req.params.pid
        let cart = await Cart.findOne({userId: req.user._id.toString()})
        let product = await Product.findById(pid)
        if(cart && product) {
            let newProduct = {
                productId: pid
            }
            cart.products.push(newProduct)
            let val = cart.amount + product.price
            cart.amount = val
            await cart.save()
            res.redirect('/user/cart')
        } else {
            res.send('Page 404 Not Found')
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteProduct = async (req, res) => {
    const pid = req.params.pid
    let product = await Product.findById(pid)
    let cart = await Cart.findOne({userId: req.user._id})
    if(cart) {
        let i = 0;
        cart.products = cart.products.filter((product) => product.productId != pid)
        cart.amount = cart.amount - product.price
        await cart.save()
    }
    res.redirect('/user/cart')
}

const editProduct = async (req, res) => {
    const id = req.params.pid
    try {
        let product = await Product.findById(id)
        if(product) {
            const {
                title,
                description,
                price,
                encodedImage,
                tags
            } = req.body
        
            let verifyUser
            let token = req.cookies[COOKIE_NAME]
            if (token != undefined) {
                token = token.token;
                verifyUser = jwt.verify(token, process.env.SECRET_KEY)
            }
            if(!verifyUser) return res.redirect('/products/detail/' + id)
            let tagsArr = tags.split(',')
            product.title = title
            product.desc = description
            product.img = encodedImage
            product.price = price
            product.tags = tagsArr
            product.owner = verifyUser._id
            await product.save()
            res.redirect('/products/detail/' + id)
        }
    } catch(e) {
        console.log(e);
        res.redirect('/products/detail/' + id)
    }
}

const editProductPage = async (req, res) => {
    const id = req.params.pid
    let product = await Product.findById(id)
    if(product && req.user._id == product.owner) {
        return res.render('editProduct', product);
    }
    res.redirect('/products/detail/' + id);
}

const deleteProductPermanently = async (req, res) => {
    try {
        const id = req.params.pid
        let product = await Product.findById(id)
        if(product && req.user._id == product.owner) {
            await Product.deleteOne({_id: id})
            return res.redirect('/')
        }
        res.redirect('/products/detail/' + id);
    } catch(e) {
        console.log(e);
        res.redirect('/products/detail/' + id);
    }
}

module.exports = {
    findAllProducts,
    addProduct,
    findProduct,
    findProductApi,
    buyProduct,
    deleteProduct,
    editProduct,
    editProductPage,
    deleteProductPermanently
}
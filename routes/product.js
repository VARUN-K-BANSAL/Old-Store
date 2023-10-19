const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const auth = require('../middlewares/auth');

router.post('/add', productController.addProduct)

router.get('/all', productController.findAllProducts)
router.get('/add', auth, (req, res) => {res.render('addProduct')})
router.get('/detail/:pid', productController.findProduct)
router.get('/detailApi/:pid/', productController.findProductApi)
router.post('/buy/:pid', auth, productController.buyProduct)
router.get('/delete/:pid', auth, productController.deleteProduct)
router.get('/deletePermanently/:pid', auth, productController.deleteProductPermanently)
router.post('/edit/:pid', auth, productController.editProduct)
router.get('/edit/:pid', auth, productController.editProductPage)
module.exports = router
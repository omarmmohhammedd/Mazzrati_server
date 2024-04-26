const router = require('express').Router()

const {Login,verifyToken, email} = require('../service/auth')
const {getProducts,getAllProducts, getAllCategories, addProduct, deleteProduct, getCart, createCart, cartOpretion, getProduct, deleteFromCart} = require('../service/product')
const imgUploader= require('../multerUploader')

router.post('/login',Login)
router.post('/email',email)
router.post('/products',imgUploader.single('image'),addProduct)
router.get('/products',getAllProducts)
router.delete('/products/:id',deleteProduct)
router.get('/products/type',getProducts)
router.get('/product/:id',getProduct)
router.get('/cart/:token',getCart)
router.post('/cart/:token',createCart)
router.put('/cart/:token',cartOpretion)
router.delete('/cart/:token/:id',deleteFromCart)



module.exports = router

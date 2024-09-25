import express from 'express'
import Cart from '../controllers/cartController.js'

const router = express.Router()

router.get('/cart', Cart.getCartItems)
router.post('/cart', Cart.addProductToCart)
router.delete('/cart', Cart.emptyCart)
router.put('/cart/:id', Cart.updateCartItem)
router.delete('/cart/:id', Cart.deleteCartItem)

export default router

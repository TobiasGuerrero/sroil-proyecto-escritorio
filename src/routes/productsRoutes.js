import express from 'express'
import Products from '../controllers/productsController.js'

const router = express.Router()

router.get('/products', Products.getAllProducts)
router.post('/products', Products.addProduct)
router.delete('/products/:id', Products.deleteProduct)
router.put('/products/:id', Products.updateProduct)

export default router

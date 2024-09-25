import express from 'express'
import Providers from '../controllers/providersController.js'

const router = express.Router()

router.get('/providers', Providers.getAllProviders)
router.post('/providers', Providers.createProvider)
router.put('/providers/:id', Providers.updateProviderById)
router.delete('/providers/:id', Providers.deleteProviderById)

export default router

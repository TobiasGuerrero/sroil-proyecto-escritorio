import express from 'express'
import OilChange from '../controllers/oilChangeController.js'

const router = express.Router()

router.get('/oil-change', OilChange.getAllOilChangeRecords)
router.post('/oil-change', OilChange.addOilChangeRecord)
router.put('/oil-change/:id', OilChange.updateOilChangeRecord)
router.delete('/oil-change/:id', OilChange.deleteOilChangeRecord)

export default router

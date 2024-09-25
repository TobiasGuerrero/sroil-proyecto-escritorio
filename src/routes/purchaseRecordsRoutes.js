import express from 'express'
import PurchaseRecords from '../controllers/purchaseRecordsController.js'

const router = express.Router()

router.get('/purchase_records', PurchaseRecords.getAllPurchaseRecords)
router.post('/purchase_records', PurchaseRecords.addPurchaseRecord)
router.put('/purchase_records/:id', PurchaseRecords.updatePurchaseRecord)
router.delete('/purchase_records/:id', PurchaseRecords.deletePurchaseRecord)

export default router

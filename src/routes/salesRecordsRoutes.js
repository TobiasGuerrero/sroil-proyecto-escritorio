import express from 'express'
import SalesRecords from '../controllers/salesRecordsController.js'

const router = express.Router()

router.post('/sales_records', SalesRecords.createSaleRecord)
router.get('/sales_records', SalesRecords.getAllSalesRecords)
router.delete('/sales_records/:id', SalesRecords.deleteSaleRecord)

export default router

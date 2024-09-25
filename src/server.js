import express from 'express'
import cors from 'cors'
import productsRoutes from './routes/productsRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import salesRecordsRoutes from './routes/salesRecordsRoutes.js'
import providersRoutes from './routes/providersRoutes.js'
import purchaseRecordsRoutes from './routes/purchaseRecordsRoutes.js'
import changeOilRoutes from './routes/changeOilRoutes.js'

const startServerApp = express()
const port = 3001

startServerApp.use(cors())
startServerApp.use(express.json())

startServerApp.use(productsRoutes)
startServerApp.use(cartRoutes)
startServerApp.use(salesRecordsRoutes)
startServerApp.use(providersRoutes)
startServerApp.use(purchaseRecordsRoutes)
startServerApp.use(changeOilRoutes)

startServerApp.listen(port, () => {
  console.log(`Servidor backend en ejecución en el puerto ${port}`)
})

export default startServerApp

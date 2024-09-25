import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { initConnection } from './src/database/connection.js'
import log from 'electron-log'

// Rutas del backend
import productsRoutes from './src/routes/productsRoutes.js'
import cartRoutes from './src/routes/cartRoutes.js'
import salesRecordsRoutes from './src/routes/salesRecordsRoutes.js'
import providersRoutes from './src/routes/providersRoutes.js'
import purchaseRecordsRoutes from './src/routes/purchaseRecordsRoutes.js'
import changeOilRoutes from './src/routes/changeOilRoutes.js'

log.info('-----Log from the main process-----')

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = path.resolve(__dirname, 'src', 'database', 'sroil.db').replace('app.asar', 'app.asar.unpacked')
log.info('Ruta de la base de datos:', dbPath)

async function startConnection () {
  try {
    // Crear el directorio si no existe
    const dbDir = path.dirname(dbPath)

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
      log.info('Directorio de la base de datos creado:', dbDir)
    } else {
      log.info('Directorio de la base de datos ya existe:', dbDir)
    }

    initConnection()
  } catch (error) {
    log.error('Error al conectar a la base de datos:', error)
    throw error
  }
}

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    minWidth: 1280,
    minHeight: 1024,
    title: 'Sr.Oil',
    icon: 'assets/img/icono.png',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.cjs')
    }
  })

  // Cargar la aplicación React/Vite
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))

  mainWindow.maximize()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  log.info('Ventana principal creada')
}

// Inicializa el backend dentro de Electron
function startBackend () {
  const app = express()
  const port = 3001

  app.use(express.json())

  // Agregar las rutas
  app.use(productsRoutes)
  app.use(cartRoutes)
  app.use(salesRecordsRoutes)
  app.use(providersRoutes)
  app.use(purchaseRecordsRoutes)
  app.use(changeOilRoutes)

  app.listen(port, () => {
    log.info(`Backend corriendo en http://localhost:${port}`)
  })
}

ipcMain.handle('save-pdf', async (event, pdfData) => {
  const filePath = await dialog.showSaveDialog({
    title: 'Guardar PDF',
    defaultPath: 'presupuesto.pdf',
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
  })

  if (!filePath.canceled) {
    const buffer = Buffer.from(pdfData, 'base64')
    fs.writeFileSync(filePath.filePath, buffer)
    return filePath.filePath // Devuelve la ruta del archivo guardado
  }
})

app.whenReady().then(async () => {
  await startConnection()
  createWindow()
  startBackend()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

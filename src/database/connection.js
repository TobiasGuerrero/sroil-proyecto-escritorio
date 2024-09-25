import { fileURLToPath } from 'url'
import fs from 'fs'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path, { dirname } from 'path'
import log from 'electron-log'

// Obtén el directorio del archivo actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let connection

const initConnection = async () => {
  log.info('-----Connection------')
  const dbPath = path.resolve(__dirname, 'sroil.db').replace('app.asar', 'app.asar.unpacked')
  connection = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })
  log.info('*Conexion a la base de datos SQLite establecida*')

  // Lee el archivo schema.sql y crea las tablas
  const schema = fs.readFileSync(`${__dirname}/schema.sql`, 'utf8')
  await connection.exec(schema)
  log.info('*Esquema de la base de datos SQLite creado*')
}

export { initConnection, connection }

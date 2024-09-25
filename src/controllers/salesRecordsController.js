import { initConnection, connection } from '../database/connection.js'

class SalesRecords {
  static async createSaleRecord (req, res) {
    try {
      if (!connection) {
        await initConnection()
      }

      const { datosVenta, cliente } = req.body
      const result = await connection.run(
        'INSERT INTO registro_ventas (datosVenta, cliente) VALUES (?, ?)',
        [JSON.stringify(datosVenta), JSON.stringify(cliente)]
      )

      const insertId = result.lastID
      res.status(201).json({ idRegistroVenta: insertId, fechaVenta: new Date(), datosVenta })
    } catch (error) {
      console.error('Error al crear registro de venta:', error)
      res.status(500).json({ error: 'Error al crear registro de venta' })
    }
  }

  static async getAllSalesRecords (req, res) {
    try {
      if (!connection) {
        await initConnection()
      }

      const rows = await connection.all('SELECT * FROM registro_ventas')

      // Convertir datosVenta de JSON a Array
      const records = rows.map(row => {
        try {
          return {
            ...row,
            datosVenta: JSON.parse(row.datosVenta)
          }
        } catch (e) {
          console.error('Error al parsear datosVenta:', e, row.datosVenta)
          throw e
        }
      })

      res.json(records)
    } catch (error) {
      console.error('Error al obtener registros de venta:', error)
      res.status(500).json({ error: 'Error al obtener registros de venta' })
    }
  }

  static async deleteSaleRecord (req, res) {
    try {
      if (!connection) {
        await initConnection()
      }

      const { id } = req.params
      const result = await connection.run('DELETE FROM registro_ventas WHERE idRegistroVenta = ?', [id])

      if (result.changes === 0) {
        res.status(404).json({ error: 'Registro de venta no encontrado' })
      } else {
        res.status(200).json({ message: 'Registro de venta eliminado' })
      }
    } catch (error) {
      console.error('Error al eliminar registro de venta:', error)
      res.status(500).json({ error: 'Error al eliminar registro de venta' })
    }
  }
}

export default SalesRecords

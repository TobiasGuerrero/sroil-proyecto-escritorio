import { initConnection, connection } from '../database/connection.js'

class PurchaseRecords {
  static async getAllPurchaseRecords (req, res) {
    if (!connection) {
      await initConnection()
    }
    try {
      const rows = await connection.all('SELECT * FROM registro_compras')
      res.json(rows)
    } catch (error) {
      console.error('Error en PurchaseRecordsController.js al obtener pedidos:', error)
      res.status(500).json({ error: 'Error al obtener pedidos' })
    }
  }

  static async addPurchaseRecord (req, res) {
    if (!connection) {
      await initConnection()
    }

    const { fecha, datos, proveedor, estado } = req.body

    try {
      const result = await connection.run(
        'INSERT INTO registro_compras (fechaCompra, datosCompra, proveedor, estado) VALUES (?,?,?,?)',
        [fecha, datos, proveedor, estado]
      )
      res.status(201).json({ message: 'Pedido agregado exitosamente', id: result.lastID })
    } catch (error) {
      console.error('Error en PurchaseRecordsController.js al agregar un nuevo pedido:', error)
      res.status(500).json({ error: 'Error al agregar un nuevo pedido' })
    }
  }

  static async updatePurchaseRecord (req, res) {
    if (!connection) {
      await initConnection()
    }
    const { id } = req.params
    const { fecha, datos, proveedor, estado } = req.body

    try {
      const result = await connection.run(
        'UPDATE registro_compras SET fechaCompra =?, datosCompra =?, proveedor =?, estado =? WHERE idRegistroCompra =?',
        [fecha, datos, proveedor, estado, id]
      )
      if (result.changes === 0) {
        res.status(404).json({ error: 'Registro de compra no encontrado' })
      } else {
        res.status(200).json({ message: 'Registro de compra actualizado correctamente' })
      }
    } catch (error) {
      console.error('Error en PurchaseRecordsController.js al actualizar una compra:', error)
      res.status(500).json({ error: 'Error al actualizar una compra' })
    }
  }

  static async deletePurchaseRecord (req, res) {
    if (!connection) {
      await initConnection()
    }
    const { id } = req.params
    try {
      const result = await connection.run('DELETE FROM registro_compras WHERE idRegistroCompra =?', [id])
      if (result.changes === 0) {
        res.status(404).json({ error: 'Registro de compra no encontrado' })
      } else {
        res.status(204).send()
      }
    } catch (error) {
      console.error('Error en PurchaseRecordsController.js al eliminar una compra:', error)
      res.status(500).json({ error: 'Error al eliminar una compra' })
    }
  }
}

export default PurchaseRecords

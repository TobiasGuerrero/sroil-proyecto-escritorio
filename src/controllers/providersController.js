import { initConnection, connection } from '../database/connection.js'

class Providers {
  static async getAllProviders (req, res) {
    if (!connection) {
      await initConnection()
    }
    try {
      const rows = await connection.all('SELECT * FROM proveedores')
      res.json(rows)
    } catch (error) {
      console.error('Error en index.js al obtener proveedores:', error)
      res.status(500).json({ error: 'Error al obtener proveedores' })
    }
  }

  static async createProvider (req, res) {
    if (!connection) {
      await initConnection()
    }
    const { nombreProveedor, telefonoProveedor, datosProveedor } = req.body
    try {
      const result = await connection.run(
        'INSERT INTO proveedores (nombreProveedor, telefonoProveedor, datosProveedor) VALUES (?, ?, ?)',
        [nombreProveedor, telefonoProveedor, datosProveedor]
      )
      res.status(201).json({ idProveedor: result.lastID, nombreProveedor })
    } catch (error) {
      console.error('Error en index.js al crear proveedor:', error)
      res.status(500).json({ error: 'Error al crear proveedor' })
    }
  }

  static async updateProviderById (req, res) {
    if (!connection) {
      await initConnection()
    }
    const { id } = req.params
    const { nombreProveedor, telefonoProveedor, datosProveedor } = req.body
    try {
      const result = await connection.run(
        'UPDATE proveedores SET nombreProveedor = ?, telefonoProveedor = ?, datosProveedor = ? WHERE idProveedor = ?',
        [nombreProveedor, telefonoProveedor, datosProveedor, id]
      )
      if (result.changes === 0) {
        res.status(404).json({ error: 'Proveedor no encontrado' })
      } else {
        res.status(200).json({ message: 'Proveedor actualizado correctamente' })
      }
    } catch (error) {
      console.error('Error en index.js al actualizar proveedor:', error)
      res.status(500).json({ error: 'Error al actualizar proveedor' })
    }
  }

  static async deleteProviderById (req, res) {
    if (!connection) {
      await initConnection()
    }
    const { id } = req.params
    try {
      const result = await connection.run(
        'DELETE FROM proveedores WHERE idProveedor = ?',
        [id]
      )
      if (result.changes === 0) {
        res.status(404).json({ error: 'Proveedor no encontrado' })
      } else {
        res.status(200).json({ message: 'Proveedor eliminado correctamente' })
      }
    } catch (error) {
      console.error('Error en index.js al eliminar proveedor:', error)
      res.status(500).json({ error: 'Error al eliminar proveedor' })
    }
  }
}

export default Providers

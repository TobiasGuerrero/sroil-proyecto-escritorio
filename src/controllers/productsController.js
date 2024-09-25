import { initConnection, connection } from '../database/connection.js'

class Products {
  static async getAllProducts (req, res) {
    if (!connection) {
      await initConnection()
    }
    try {
      const rows = await connection.all('SELECT * FROM productos')
      res.json(rows)
    } catch (error) {
      console.error('Error al obtener productos:', error)
      res.status(500).send('Error al obtener productos')
    }
  }

  static async addProduct (req, res) {
    if (!connection) {
      await initConnection()
    }
    const { marca, nombre, precio, stock } = req.body
    try {
      const insertQuery = 'INSERT INTO productos (marca, nombre, precio, stock) VALUES (?, ?, ?, ?)'
      const result = await connection.run(insertQuery, [marca, nombre, precio, stock])

      if (result.changes > 0) {
        const insertedId = result.lastID
        const insertedProduct = { idProducto: insertedId, marca, nombre, precio, stock }
        res.status(201).json(insertedProduct)
      } else {
        throw new Error('No se pudo agregar el producto')
      }
    } catch (error) {
      console.error('Error al agregar producto:', error)
      res.status(500).send('Error al agregar producto')
    }
  }

  static async deleteProduct (req, res) {
    if (!connection) {
      await initConnection()
    }
    const productId = req.params.id
    try {
      const deleteQuery = 'DELETE FROM productos WHERE idProducto = ?'
      const result = await connection.run(deleteQuery, [productId])

      if (result.changes > 0) {
        res.status(200).send(`Producto con id ${productId} eliminado correctamente`)
      } else {
        throw new Error('Producto no encontrado')
      }
    } catch (error) {
      console.error(`Error al eliminar producto con id ${productId}:`, error)
      res.status(500).send(`Error al eliminar producto con id ${productId}`)
    }
  }

  static async updateProduct (req, res) {
    if (!connection) {
      await initConnection()
    }
    const productId = req.params.id
    const { marca, nombre, precio, stock } = req.body
    try {
      const updateQuery = 'UPDATE productos SET marca = ?, nombre = ?, precio = ?, stock = ? WHERE idProducto = ?'
      const result = await connection.run(updateQuery, [marca, nombre, precio, stock, productId])

      if (result.changes > 0) {
        res.status(200).send(`Producto con id ${productId} actualizado correctamente`)
      } else {
        throw new Error('Producto no encontrado')
      }
    } catch (error) {
      console.error(`Error al actualizar producto con id ${productId}:`, error)
      res.status(500).send(`Error al actualizar producto con id ${productId}`)
    }
  }
}

export default Products

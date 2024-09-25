import { initConnection, connection } from '../database/connection.js'

class Cart {
  static async getCartItems (req, res) {
    if (!connection) {
      await initConnection()
    }
    try {
      const rows = await connection.all('SELECT * FROM carrito')
      res.json(rows)
    } catch (error) {
      console.error('Error al obtener elementos del carrito:', error)
      res.status(500).send('Error al obtener elementos del carrito')
    }
  }

  static async addProductToCart (req, res) {
    if (!connection) {
      await initConnection()
    }
    const { idProducto, marca, nombre, precio, cantidad } = req.body
    try {
      const insertQuery = 'INSERT INTO carrito (idProducto, marca, nombre, precio, cantidad) VALUES (?, ?, ?, ?, ?)'
      await connection.run(insertQuery, [idProducto, marca, nombre, precio, cantidad])
      res.status(201).send('Producto agregado al carrito')
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error)
      res.status(500).send('Error al agregar producto al carrito')
    }
  }

  static async updateCartItem (req, res) {
    if (!connection) {
      await initConnection()
    }
    const cartItemId = req.params.id
    const { cantidad } = req.body

    try {
      const cartItem = await connection.get('SELECT * FROM carrito WHERE idProducto = ?', [cartItemId])
      if (!cartItem) {
        return res.status(404).send('Producto en el carrito no encontrado')
      }

      const updateQuery = 'UPDATE carrito SET cantidad = ? WHERE idProducto = ?'
      const result = await connection.run(updateQuery, [cantidad, cartItemId])

      if (result.changes === 0) {
        return res.status(404).send('No se pudo actualizar la cantidad. El producto no existe en el carrito.')
      }

      res.status(200).send('Cantidad actualizada en el carrito')
    } catch (error) {
      console.error(`Error al actualizar cantidad en el carrito con id ${cartItemId}:`, error)
      res.status(500).send(`Error al actualizar cantidad en el carrito con id ${cartItemId}`)
    }
  }

  static async deleteCartItem (req, res) {
    if (!connection) {
      await initConnection()
    }
    const cartItemId = req.params.id
    try {
      const deleteQuery = 'DELETE FROM carrito WHERE idProducto = ?'
      await connection.run(deleteQuery, [cartItemId])
      res.status(200).send('Producto eliminado del carrito')
    } catch (error) {
      console.error(`Error al eliminar producto del carrito con id ${cartItemId}:`, error)
      res.status(500).send(`Error al eliminar producto del carrito con id ${cartItemId}`)
    }
  }

  static async emptyCart (req, res) {
    try {
      if (!connection) {
        await initConnection()
      }

      await connection.run('DELETE FROM carrito')
      res.status(200).json({ message: 'Carrito vaciado exitosamente' })
    } catch (error) {
      console.error('Error al vaciar el carrito:', error)
      res.status(500).json({ error: 'Error al vaciar el carrito' })
    }
  }
}

export default Cart

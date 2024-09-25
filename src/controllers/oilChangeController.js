import { initConnection, connection } from '../database/connection.js'

class OilChange {
  static async getAllOilChangeRecords (req, res) {
    if (!connection) {
      await initConnection()
    }
    try {
      const rows = await connection.all('SELECT * FROM registro_cambios_aceite')
      res.json(rows)
    } catch (error) {
      console.error('Error en oilChangeController.js al obtener los registros de cambios de aceite:', error)
      res.status(500).json({ error: 'Error al obtener los registros de cambios de aceite' })
    }
  }

  static async addOilChangeRecord (req, res) {
    if (!connection) {
      await initConnection()
    }

    const { patente, marcaAuto, kilometros, filtroAceite, filtroAire, filtroNafta, filtroHabitaculo, caja, marcaAceite, aditivo, tipoPago, pago, observaciones } = req.body

    const fechaCambioAceite = new Date().toISOString().slice(0, 19).replace('T', ' ')

    const observacionesFinal = observaciones || 'VACIO'

    try {
      const result = await connection.run(
        'INSERT INTO registro_cambios_aceite (patente, marcaAuto, kilometros, fechaCambioAceite, filtroAceite, filtroAire, filtroNafta, filtroHabitaculo, caja, marcaAceite, aditivo, tipoPago, pago, observaciones) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [patente, marcaAuto, kilometros, fechaCambioAceite, filtroAceite, filtroAire, filtroNafta, filtroHabitaculo, caja, marcaAceite, aditivo, tipoPago, pago, observacionesFinal]
      )
      res.status(201).json({ message: 'Registro de cambio de aceite agregado exitosamente', id: result.lastID })
    } catch (error) {
      console.error('Error en oilChangeController.js al agregar un nuevo registro de cambio de aceite:', error)
      res.status(500).json({ error: 'Error al agregar un nuevo registro de cambio de aceite' })
    }
  }

  static async updateOilChangeRecord (req, res) {
    if (!connection) {
      await initConnection()
    }
    const { id } = req.params
    const { patente, marcaAuto, kilometros, filtroAceite, filtroAire, filtroNafta, filtroHabitaculo, caja, marcaAceite, aditivo, tipoPago, pago, observaciones } = req.body

    const fechaCambioAceite = new Date().toISOString().slice(0, 19).replace('T', ' ')

    const observacionesFinal = observaciones || 'VACIO'

    try {
      const result = await connection.run(
        'UPDATE registro_cambios_aceite SET patente =?, marcaAuto =?, kilometros =?, fechaCambioAceite =?, filtroAceite =?, filtroAire =?, filtroNafta =?, filtroHabitaculo =?, caja =?, marcaAceite =?, aditivo =?, tipoPago =?, pago =?, observaciones =? WHERE idRegistroCambioAceite =?',
        [patente, marcaAuto, kilometros, fechaCambioAceite, filtroAceite, filtroAire, filtroNafta, filtroHabitaculo, caja, marcaAceite, aditivo, tipoPago, pago, observacionesFinal, id]
      )
      if (result.changes === 0) {
        res.status(404).json({ error: 'Registro de cambio de aceite no encontrado' })
      } else {
        res.status(200).json({ message: 'Registro de cambio de aceite actualizado correctamente' })
      }
    } catch (error) {
      console.error('Error en oilChangeController.js al actualizar un registro de cambio de aceite:', error)
      res.status(500).json({ error: 'Error al actualizar un registro de cambio de aceite' })
    }
  }

  static async deleteOilChangeRecord (req, res) {
    if (!connection) {
      await initConnection()
    }
    const { id } = req.params
    try {
      const result = await connection.run('DELETE FROM registro_cambios_aceite WHERE idRegistroCambioAceite =?', [id])
      if (result.changes > 0) {
        res.status(204).send()
      } else {
        res.status(404).json({ error: 'Registro de cambio de aceite no encontrado' })
      }
    } catch (error) {
      console.error('Error en oilChangeController.js al eliminar un registro de cambio de aceite:', error)
      res.status(500).json({ error: 'Error al eliminar un registro de cambio de aceite' })
    }
  }
}

export default OilChange

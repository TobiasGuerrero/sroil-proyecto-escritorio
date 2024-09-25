import React, { useEffect, useState } from 'react'
import './Records.css'
import { Loading } from '../Loading/Loading'
import { deleteSaleRecord, getAllSalesRecords, getAllPurchaseRecords, deletePurchaseRecordById, getAllOilChangeRecords, deleteOilChangeRecord, updateOilChangeRecord } from '../../services/api'
import { toast } from 'react-toastify'

export function Records () {
  const [salesRecords, setSalesRecords] = useState([])
  const [purchaseRecords, setPurchaseRecords] = useState([])
  const [oilChangeRecords, setOilChangeRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [filteredRecords, setFilteredRecords] = useState([])
  const [filteredPurchaseRecords, setFilteredPurchaseRecords] = useState([])
  const [filteredOilChangeRecords, setFilteredOilChangeRecords] = useState([])

  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const [showSalesRecords, setShowSalesRecords] = useState(true)
  const [showPurchaseRecords, setShowPurchaseRecords] = useState(false)
  const [showOilChangeRecords, setShowOilChangeRecords] = useState(false)

  const fetchSalesRecords = async () => {
    try {
      const records = await getAllSalesRecords()
      setSalesRecords(records)
      const filtered = records.sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta))
      setFilteredRecords(filtered)
    } catch (err) {
      console.error('Error en Records.jsx al obtener los registros de venta:', err)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }
  }

  const fetchPurchaseRecords = async () => {
    try {
      const purchaseRecords = await getAllPurchaseRecords()
      const purchaseRecordsPurchased = purchaseRecords.filter((purchase) => purchase.estado === 'RECIBIDO')
      const purchaseRecordsFiltered = purchaseRecordsPurchased.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra))
      setPurchaseRecords(purchaseRecordsFiltered)
      setFilteredPurchaseRecords(purchaseRecordsFiltered)
    } catch (err) {
      console.error('Error en Records.jsx al obtener los pedidos: ', err)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }

  const fetchOilChangeRecords = async () => {
    try {
      const oilChangeRecords = await getAllOilChangeRecords()
      const filtered = oilChangeRecords.sort((a, b) => new Date(b.fechaCambioAceite) - new Date(a.fechaCambio))
      setOilChangeRecords(filtered)
      setFilteredOilChangeRecords(filtered)
    } catch (err) {
      console.error('Error en Records.jsx al obtener los cambios de aceite:', err)
    }
  }

  useEffect(() => {
    fetchSalesRecords()
    fetchPurchaseRecords()
    fetchOilChangeRecords()
  }, [])

  const handleSearchChange = (e) => {
    if (showSalesRecords) {
      const term = e.target.value
      setSearchTerm(term)

      const filtered = salesRecords.filter(sale =>
        sale.cliente.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredRecords(filtered)
    }

    if (showPurchaseRecords) {
      const term = e.target.value
      setSearchTerm(term)
      const filtered = purchaseRecords.filter(purchase =>
        purchase.proveedor.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredPurchaseRecords(filtered)
    }

    if (showOilChangeRecords) {
      const term = e.target.value
      setSearchTerm(term)
      const filtered = oilChangeRecords.filter(oilChange =>
        oilChange.patente.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredOilChangeRecords(filtered)
    }
  }

  const openInfoModal = (record) => {
    setShowInfoModal(true)
    setSelectedRecord(record)
    document.body.style.overflow = 'hidden'
  }

  const closeInfoModal = () => {
    setSelectedRecord(null)
    setShowInfoModal(false)
    document.body.style.overflow = 'visible'
  }

  const openDeleteModal = (record) => {
    setShowDeleteModal(true)
    setSelectedRecord(record)
    document.body.style.overflow = 'hidden'
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setSelectedRecord(null)
    document.body.style.overflow = 'visible'
  }

  const handleDeleteRecord = async () => {
    try {
      await deleteSaleRecord(selectedRecord.idRegistroVenta)
      fetchSalesRecords()
      closeDeleteModal()
      setSelectedRecord(null)
      toast.success('Registro eliminado exitosamente', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
    } catch (err) {
      toast.error('Error eliminando el registro', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
      console.error('Error en Records.jsx al eliminar el registro de venta:', err)
    }
  }

  const handleDeleteOrder = async () => {
    try {
      await deletePurchaseRecordById(selectedRecord.idRegistroCompra)
      fetchPurchaseRecords()
      closeDeleteModal()
      toast.success('Registro eliminado con exito', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
    } catch (err) {
      toast.error('Error eliminando el registro', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
      console.error('Error en Records.jsx al eliminar un registro:', err)
    }
  }

  const handleDeleteOilChangeRecord = async () => {
    try {
      await deleteOilChangeRecord(selectedRecord.idRegistroCambioAceite)
      fetchOilChangeRecords()
      closeDeleteModal()
      toast.success('Registro eliminado con éxito', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
    } catch (err) {
      toast.error('Error eliminando el registro', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
      console.error('Error en SalesRecords.jsx al eliminar un registro:', err)
    }
  }

  const openEditModal = (record) => {
    setSelectedRecord(record)
    setShowEditModal(true)
    document.body.style.overflow = 'hidden'
  }

  const closeEditModal = () => {
    setSelectedRecord(null)
    setShowEditModal(false)
    document.body.style.overflow = 'visible'
  }

  const handleUpdateOilChangeRecord = async (e) => {
    e.preventDefault()
    try {
      if (selectedRecord.observaciones === undefined) {
        selectedRecord.observaciones = 'VACIO'
      }
      await updateOilChangeRecord(selectedRecord.idRegistroCambioAceite, selectedRecord)
      fetchOilChangeRecords()
      closeEditModal()
      toast.success('Registro actualizado con éxito', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
    } catch (error) {
      toast.error('Error al actualizar el registro de cambio de aceite', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
      console.error('Error al actualizar el registro de cambio de aceite:', error)
    }
  }

  if (loading) {
    return (
      <main className='records-main'>
        <Loading />
      </main>
    )
  }

  if (showSalesRecords) {
    return (
      <>
        <div className='provider-select-menu'>
          <button className='product-actions-button provider-button-selected' onClick={() => { setShowSalesRecords(true); setShowPurchaseRecords(false); setShowOilChangeRecords(false) }}>Registro de Ventas</button>
          <button className='product-actions-button' onClick={() => { setShowPurchaseRecords(true); setShowSalesRecords(false); setShowOilChangeRecords(false) }}>Registro de Compras</button>
          <button className='product-actions-button' onClick={() => { setShowOilChangeRecords(true); setShowSalesRecords(false); setShowPurchaseRecords(false) }}>Registro de Cambios de Aceite</button>
        </div>
        <main className='records-main'>
          <h1>Registros de Ventas</h1>
          <input
            className='product-search-input'
            type='text'
            placeholder='Buscar producto por Cliente o Patente'
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {filteredRecords.length === 0
            ? (
              <h1>No se encontraron registros de ventas</h1>
              )
            : (
              <>
                <div className='records-container'>
                  <h2>Cliente/Patente</h2>
                  <h2>Fecha de Venta</h2>
                  <h2>Acciones</h2>
                  {filteredRecords.map(record => (
                    <React.Fragment key={record.idRegistroVenta}>
                      <p>{record.cliente.replace(/['"]+/g, '')}</p>
                      <p>{new Date(record.fechaVenta).toLocaleDateString()}</p>
                      <div className='cart-actions'>
                        <button className='product-actions-button' onClick={() => openInfoModal(record)}>Ver Informacion</button>
                        <button className='product-actions-button' onClick={() => openDeleteModal(record)}>Eliminar</button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                {/* Modal de Informacion del Registro */}
                {showInfoModal && (
                  <div className='modal'>
                    <div className='modal-background' onClick={closeInfoModal} />
                    <div className='modal-container'>
                      <h2>Registro de Venta</h2>
                      {selectedRecord && (
                        <div className='records-modal-container'>
                          <div className='records-modal-customer-container'>
                            <h2>Cliente/Patente</h2>
                            <h2>Fecha de la Venta</h2>
                            <p>{selectedRecord.cliente.replace(/['"]+/g, '')}</p>
                            <p>{new Date(selectedRecord.fechaVenta).toLocaleDateString()}</p>
                          </div>
                          <div className='record-modal-datos-container'>
                            <h2>Marca</h2>
                            <h2>Nombre</h2>
                            <h2>Precio</h2>
                            <h2>Cantidad</h2>
                            {selectedRecord.datosVenta.map(item => (
                              <React.Fragment key={item.idProducto}>
                                <p>{item.marca}</p>
                                <p>{item.nombre}</p>
                                <p>$ {item.precio}</p>
                                <p>{item.cantidad}</p>
                              </React.Fragment>
                            ))}
                          </div>
                          <h2>Total : $ {selectedRecord.datosVenta.reduce((sum, item) => sum + item.precio * item.cantidad, 0)}</h2>
                        </div>
                      )}
                      <div className='records-modal-button-container'>
                        <button onClick={closeInfoModal} className='product-actions-button'>Cerrar</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal de Confirmacion de Eliminacion */}
                {showDeleteModal && (
                  <div className='modal'>
                    <div className='modal-background' onClick={closeDeleteModal} />
                    <div className='modal-container'>
                      <h1>¿Estás seguro de eliminar este registro de venta?</h1>
                      <h2><strong>Este proceso no se puede deshacer.</strong></h2>
                      <p>Se eliminará permanentemente el registro de la venta</p>
                      <p>Cliente/Patente: {selectedRecord.cliente.replace(/['"]+/g, '')}</p>
                      <p>Fecha de Venta: {new Date(selectedRecord.fechaVenta).toLocaleDateString()}</p>
                      <div className='records-modal-button-container-delete'>
                        <button onClick={closeDeleteModal} className='product-actions-button'>Cancelar</button>
                        <button onClick={handleDeleteRecord} className='product-actions-button'>Confirmar</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
              )}
        </main>
      </>
    )
  }

  if (showPurchaseRecords) {
    return (
      <>
        <div className='provider-select-menu'>
          <button className='product-actions-button' onClick={() => { setShowSalesRecords(true); setShowPurchaseRecords(false); setShowOilChangeRecords(false) }}>Registro de Ventas</button>
          <button className='product-actions-button provider-button-selected' onClick={() => { setShowPurchaseRecords(true); setShowSalesRecords(false); setShowOilChangeRecords(false) }}>Registro de Compras</button>
          <button className='product-actions-button' onClick={() => { setShowOilChangeRecords(true); setShowSalesRecords(false); setShowPurchaseRecords(false) }}>Registro de Cambios de Aceite</button>
        </div>
        <main className='records-main'>
          <h1>Registros de Compras</h1>
          <input
            className='product-search-input'
            type='text'
            placeholder='Buscar registro por Proveedor'
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {purchaseRecords.length === 0
            ? (
              <h1>No se encontraron registros de compras</h1>
              )
            : (
              <>
                <div className='records-container'>
                  <h2>Proveedor</h2>
                  <h2>Fecha de Compra</h2>
                  <h2>Acciones</h2>
                  {filteredPurchaseRecords.map(purchase => (
                    <React.Fragment key={purchase.idRecordCompra}>
                      <p>{purchase.proveedor}</p>
                      <p>{new Date(purchase.fechaCompra).toLocaleDateString()}</p>
                      <div className='cart-actions'>
                        <button className='product-actions-button' onClick={() => openInfoModal(purchase)}>Ver Informacion</button>
                        <button className='product-actions-button' onClick={() => openDeleteModal(purchase)}>Eliminar</button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                {/* Modal de Informacion del Registro */}
                {showInfoModal && (
                  <div className='modal'>
                    <div className='modal-background' onClick={closeInfoModal} />
                    <div className='modal-container'>
                      <div className='modal-info-container'>
                        <h1>Información de la Compra</h1>
                        <p>Proveedor: {selectedRecord.proveedor}</p>
                        <p>Fecha: {new Date(selectedRecord.fechaCompra).toLocaleDateString()}</p>
                        <p>Compra: {selectedRecord.datosCompra}</p>
                        <div className='records-modal-button-container'>
                          <button onClick={closeInfoModal} className='product-actions-button'>Cerrar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal de Confirmacion de Eliminacion */}
                {showDeleteModal && (
                  <div className='modal'>
                    <div className='modal-background' onClick={closeDeleteModal} />
                    <div className='modal-container'>
                      <div className='modal-delete-container'>
                        <h1>¿Estás seguro de eliminar este registro?</h1>
                        <h2><strong>Este proceso no se puede deshacer.</strong></h2>
                        <p>Se eliminará permanentemente</p>
                        <p>Proveedor: {selectedRecord.proveedor}</p>
                        <p>Fecha: {new Date(selectedRecord.fechaCompra).toLocaleDateString()}</p>
                        <p>Compra: {selectedRecord.datosCompra}</p>
                        <div className='records-modal-button-container-delete'>
                          <button onClick={closeDeleteModal} className='product-actions-button'>Cancelar</button>
                          <button onClick={handleDeleteOrder} className='product-actions-button'>Confirmar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
              )}
        </main>
      </>
    )
  }

  if (showOilChangeRecords) {
    return (
      <>
        <div className='provider-select-menu'>
          <button className='product-actions-button' onClick={() => { setShowSalesRecords(true); setShowPurchaseRecords(false); setShowOilChangeRecords(false) }}>Registro de Ventas</button>
          <button className='product-actions-button' onClick={() => { setShowPurchaseRecords(true); setShowSalesRecords(false); setShowOilChangeRecords(false) }}>Registro de Compras</button>
          <button className='product-actions-button provider-button-selected' onClick={() => { setShowOilChangeRecords(true); setShowSalesRecords(false); setShowPurchaseRecords(false) }}>Registro de Cambios de Aceite</button>
        </div>
        <main className='records-main'>
          <h1>Registro de Cambios de Aceite</h1>
          <input
            className='product-search-input'
            type='text'
            placeholder='Buscar registro por Patente'
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {oilChangeRecords.length === 0
            ? (
              <h1>No se encontraron registros de cambios de aceite</h1>
              )
            : (
              <>
                <div className='records-container'>
                  <h2>Patente</h2>
                  <h2>Fecha de Cambio</h2>
                  <h2>Acciones</h2>
                  {filteredOilChangeRecords.map(oilChange => (
                    <React.Fragment key={oilChange.idRecordCambioAceite}>
                      <p>{oilChange.patente}</p>
                      <p>{new Date(oilChange.fechaCambioAceite).toLocaleDateString()}</p>
                      <div className='cart-actions'>
                        <button className='product-actions-button' onClick={() => openEditModal(oilChange)}>Editar</button>
                        <button className='product-actions-button' onClick={() => openInfoModal(oilChange)}>Ver Informacion</button>
                        <button className='product-actions-button' onClick={() => openDeleteModal(oilChange)}>Eliminar</button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                {/* Modal de Informacion del Registro */}
                {showInfoModal && (
                  <div className='modal'>
                    <div className='modal-background' onClick={closeInfoModal} />
                    <div className='modal-container'>
                      <div className='modal-info-container'>
                        <h1>Información del Cambio de Aceite</h1>
                        <p>Patente: {selectedRecord.patente}</p>
                        <p>Marca del Auto: {selectedRecord.marcaAuto}</p>
                        <p>Kilómetros: {selectedRecord.kilometros}</p>
                        <p>Fecha: {new Date(selectedRecord.fechaCambioAceite).toLocaleDateString()}</p>
                        <p>Filtro de Aceite: {selectedRecord.filtroAceite}</p>
                        <p>Filtro de Aire: {selectedRecord.filtroAire}</p>
                        <p>Filtro de Nafta: {selectedRecord.filtroNafta}</p>
                        <p>Filtro Habitáculo: {selectedRecord.filtroHabitaculo}</p>
                        <p>Caja: {selectedRecord.caja}</p>
                        <p>Marca de Aceite: {selectedRecord.marcaAceite}</p>
                        <p>Aditivo: {selectedRecord.aditivo}</p>
                        <p>Tipo de Pago: {selectedRecord.tipoPago}</p>
                        <p>Pago: {selectedRecord.pago}</p>
                        <p>Observaciones: {selectedRecord.observaciones}</p>
                        <div className='records-modal-button-container'>
                          <button onClick={closeInfoModal} className='product-actions-button'>Cerrar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal de Confirmacion de Eliminacion */}
                {showDeleteModal && (
                  <div className='modal'>
                    <div className='modal-background' onClick={closeDeleteModal}>
                      <div className='modal-container'>
                        <div className='modal-delete-container'>
                          <h1>¿Estás seguro de eliminar este registro?</h1>
                          <h2><strong>Este proceso no se puede deshacer.</strong></h2>
                          <p>Se eliminará permanentemente</p>
                          <div className='modal-delete-oil-data'>
                            <p>Patente: {selectedRecord.patente}</p>
                            <p>Marca del Auto: {selectedRecord.marcaAuto}</p>
                            <p>Kilómetros: {selectedRecord.kilometros}</p>
                            <p>Fecha: {new Date(selectedRecord.fechaCambioAceite).toLocaleDateString()}</p>
                            <p>Filtro de Aceite: {selectedRecord.filtroAceite}</p>
                            <p>Filtro de Aire: {selectedRecord.filtroAire}</p>
                            <p>Filtro de Nafta: {selectedRecord.filtroNafta}</p>
                            <p>Filtro Habitáculo: {selectedRecord.filtroHabitaculo}</p>
                            <p>Caja: {selectedRecord.caja}</p>
                            <p>Marca de Aceite: {selectedRecord.marcaAceite}</p>
                            <p>Aditivo: {selectedRecord.aditivo}</p>
                            <p>Tipo de Pago: {selectedRecord.tipoPago}</p>
                            <p>Pago: {selectedRecord.pago}</p>
                            <p>Observaciones: {selectedRecord.observaciones}</p>
                          </div>
                          <div className='records-modal-button-container-delete'>
                            <button onClick={closeDeleteModal} className='product-actions-button'>Cancelar</button>
                            <button onClick={handleDeleteOilChangeRecord} className='product-actions-button'>Confirmar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showEditModal && (
                  <div className='modal'>
                    <div className='modal-background' onClick={closeEditModal} />
                    <div className='modal-container'>
                      <div className='modal-info-container'>
                        <h1>Editar Cambio de Aceite</h1>
                        <form className='record-oil-edit' onSubmit={handleUpdateOilChangeRecord}>
                          <div className='oil-form-data'>
                            <div>
                              <label>Patente:</label>
                              <input
                                className='oil-form-input'
                                type='text'
                                value={selectedRecord.patente}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, patente: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>Marca del Auto:</label>
                              <input
                                className='oil-form-input'
                                type='text'
                                value={selectedRecord.marcaAuto}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, marcaAuto: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>Kilómetros:</label>
                              <input
                                className='oil-form-input'
                                type='number'
                                value={selectedRecord.kilometros}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, kilometros: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>Filtro de Aceite:</label>
                              <input
                                className='oil-form-input'
                                type='text'
                                value={selectedRecord.filtroAceite}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, filtroAceite: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>Filtro de Aire:</label>
                              <input
                                className='oil-form-input'
                                type='text'
                                value={selectedRecord.filtroAire}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, filtroAire: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>Filtro de Nafta:</label>
                              <input
                                className='oil-form-input'
                                type='text'
                                value={selectedRecord.filtroNafta}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, filtroNafta: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>Filtro Habitáculo:</label>
                              <input
                                className='oil-form-input'
                                type='text'
                                value={selectedRecord.filtroHabitaculo}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, filtroHabitaculo: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>Caja:</label>
                              <input
                                className='oil-form-input'
                                type='text'
                                value={selectedRecord.caja}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, caja: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>Marca de Aceite:</label>
                              <input
                                className='oil-form-input'
                                type='text'
                                value={selectedRecord.marcaAceite}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, marcaAceite: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>Aditivo:</label>
                              <input
                                className='oil-form-input'
                                type='text'
                                value={selectedRecord.aditivo}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, aditivo: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className='oil-form-pay'>
                            <div>
                              <label>Tipo de Pago:</label>
                              <input
                                className='oil-form-input'
                                type='text'
                                value={selectedRecord.tipoPago}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, tipoPago: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>Pago:</label>
                              <input
                                className='oil-form-input'
                                type='number'
                                value={selectedRecord.pago}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, pago: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <label>Observaciones:</label>
                            <textarea
                              className='oil-form-input'
                              value={selectedRecord.observaciones}
                              onChange={(e) => setSelectedRecord({ ...selectedRecord, observaciones: e.target.value })}
                            />
                          </div>

                          <div className='modal-button-container'>
                            <button type='button' onClick={closeEditModal} className='product-actions-button'>Cancelar</button>
                            <button type='submit' className='product-actions-button'>Guardar Cambios</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

              </>
              )}
        </main>
      </>
    )
  }
}

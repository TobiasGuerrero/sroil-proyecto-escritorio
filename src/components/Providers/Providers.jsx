import { toast } from 'react-toastify'
import { createProvider, deleteProviderById, getAllProviders, updateProviderById, getAllPurchaseRecords, createPurchaseRecord, updatePurchaseRecordById, deletePurchaseRecordById } from '../../services/api'
import { Loading } from '../Loading/Loading'
import './Providers.css'
import React, { useEffect, useState } from 'react'

export function Providers () {
  const [providers, setProviders] = useState([])
  const [filteredProviders, setFilteredProviders] = useState([])
  const [PurchaseRecordsPendings, setPurchaseRecordsPendings] = useState([])
  const [PurchaseRecordsPlaced, setPurchaseRecordsPlaced] = useState([])

  const [showProviders, setShowProviders] = useState(false)
  const [showPurchaseRecordsPendings, setShowPurchaseRecordsPendings] = useState(true)
  const [showPurchaseRecordsPlaced, setShowPurchaseRecordsPlaced] = useState(false)

  const [selectedProvider, setSelectedProvider] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [nombre, setNombre] = useState('')
  const [telefonoProveedor, setTelefonoProveedor] = useState('')
  const [datosProveedor, setDatosProveedor] = useState('')

  const [datosCompra, setDatosCompra] = useState('')
  const [loading, setLoading] = useState(true)

  const [selectedPurchaseRecord, setSelectedPurchaseRecord] = useState('')
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showModifyModal, setShowModifyModal] = useState(false)

  const [selectedModifyProvider, setSelectedModifyProvider] = useState('')
  const [selectedModifyCompra, setSelectedModifyCompra] = useState('')

  const fetchProviders = async () => {
    try {
      const providers = await getAllProviders()
      setProviders(providers)
      const filtered = providers.sort((a, b) => a.nombreProveedor.localeCompare(b.nombreProveedor))
      setFilteredProviders(filtered)
    } catch (err) {
      console.error('Error en Providers.jsx al obtener los proveedores:', err)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }
  }

  const fetchPurchaseRecords = async () => {
    try {
      const PurchaseRecords = await getAllPurchaseRecords()
      const PurchaseRecordsFiltered = PurchaseRecords.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra))
      const PurchaseRecordsPendings = PurchaseRecordsFiltered.filter((purchase) => purchase.estado === 'PENDIENTE')
      setPurchaseRecordsPendings(PurchaseRecordsPendings)
      const PurchaseRecordsPlaced = PurchaseRecordsFiltered.filter((purchase) => purchase.estado === 'REALIZADA')
      setPurchaseRecordsPlaced(PurchaseRecordsPlaced)
    } catch (err) {
      console.error('Error en Providers.jsx al obtener las compras: ', err)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }

  useEffect(() => {
    fetchProviders()
    fetchPurchaseRecords()
  }, [])

  // PROVEEDORES

  const handleAddProvider = async (e) => {
    e.preventDefault()
    try {
      await createProvider(nombre, telefonoProveedor, datosProveedor)
      setNombre('')
      fetchProviders()
      toast.success('Proveedor agregado con exito', {
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
      console.error('Error en Providers.jsx al agregar un proveedor:', err)
    }
  }

  const openDeleteModal = (provider) => {
    setShowDeleteModal(true)
    setSelectedProvider(provider)
    setSelectedPurchaseRecord(provider)
    document.body.style.overflow = 'hidden'
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setSelectedProvider('')
    setSelectedPurchaseRecord('')
    document.body.style.overflow = 'visible'
  }

  const handleDeleteProvider = async () => {
    try {
      await deleteProviderById(selectedProvider.idProveedor)
      fetchProviders()
      closeDeleteModal()
      toast.success('Proveedor eliminado con exito', {
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
      console.error('Error en Providers.jsx al eliminar un proveedor:', err)
    }
  }

  const handleModifyProvider = async (e) => {
    e.preventDefault()
    try {
      await updateProviderById(selectedPurchaseRecord.idProveedor, nombre, telefonoProveedor, datosProveedor)
      fetchProviders()
      closeModifyModal()
      toast.success('Proveedor modificado con exito', {
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
      console.error('Error en Providers.jsx al modificar un proveedor:', err)
    }
  }

  // COMPRAS

  const handleAddPurchase = async (e) => {
    e.preventDefault()
    try {
      const fechaCompra = new Date().toISOString().slice(0, 19).replace('T', ' ')
      await createPurchaseRecord(fechaCompra, datosCompra, nombre, 'PENDIENTE')
      fetchPurchaseRecords()
      setDatosCompra('')
      setNombre('')
      toast.success('Compra agregada con exito', {
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
      console.error('Error en Providers.jsx al crear una compra:', err)
    }
  }

  const openInfoModal = (purchase) => {
    setShowInfoModal(true)
    setSelectedPurchaseRecord(purchase)
    document.body.style.overflow = 'hidden'
  }

  const closeInfoModal = () => {
    setShowInfoModal(false)
    setSelectedPurchaseRecord('')
    document.body.style.overflow = 'visible'
  }

  const handleChangePurchaseStatus = async (purchase, status) => {
    try {
      const fechaCompra = new Date().toISOString().slice(0, 19).replace('T', ' ')
      await updatePurchaseRecordById(purchase.idRegistroCompra, fechaCompra, purchase.datosCompra, purchase.proveedor, status)
      fetchPurchaseRecords()
      toast.success('Cambio de estado realizado con exito', {
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
      console.error('Error en Providers.jsx al cambiar el estado de una compra:', err)
    }
  }

  const handleDeletePurchaseRecord = async () => {
    try {
      await deletePurchaseRecordById(selectedPurchaseRecord.idRegistroCompra)
      fetchPurchaseRecords()
      closeDeleteModal()
      toast.success('Compra eliminada con exito', {
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
      console.error('Error en Providers.jsx al eliminar una compra:', err)
    }
  }

  const openModifyModal = (purchase) => {
    setSelectedModifyProvider(purchase.proveedor)
    setSelectedModifyCompra(purchase.datosCompra)
    setSelectedPurchaseRecord(purchase)

    setNombre(purchase.nombreProveedor)
    setTelefonoProveedor(purchase.telefonoProveedor)
    setDatosProveedor(purchase.datosProveedor)

    setShowModifyModal(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModifyModal = () => {
    setSelectedModifyProvider('')
    setSelectedModifyCompra('')
    setSelectedPurchaseRecord('')

    setNombre('')
    setTelefonoProveedor('')
    setDatosProveedor('')

    setShowModifyModal(false)
    document.body.style.overflow = 'visible'
  }

  const handleModifyPurchase = async (e) => {
    e.preventDefault()
    try {
      const fechaCompra = new Date().toISOString().slice(0, 19).replace('T', ' ')
      await updatePurchaseRecordById(selectedPurchaseRecord.idRegistroCompra, fechaCompra, selectedModifyCompra, selectedModifyProvider, selectedPurchaseRecord.estado)
      fetchPurchaseRecords()
      closeModifyModal()
      toast.success('Compra modificada con exito', {
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
      console.error('Error en Providers.jsx al modificar una compra:', err)
    }
  }

  // CODE

  if (loading) {
    return (
      <main className='providers-main'>
        <Loading />
      </main>
    )
  }

  if (showProviders) {
    // PROVEEDORES
    return (
      <>
        <div className='provider-select-menu'>
          <button className='product-actions-button provider-button-selected' onClick={() => { setShowProviders(true); setShowPurchaseRecordsPendings(false); setShowPurchaseRecordsPlaced(false) }}>Proveedores</button>
          <button className='product-actions-button' onClick={() => { setShowPurchaseRecordsPendings(true); setShowProviders(false); setShowPurchaseRecordsPlaced(false) }}>Compras Pendientes</button>
          <button className='product-actions-button' onClick={() => { setShowPurchaseRecordsPlaced(true); setShowProviders(false); setShowPurchaseRecordsPendings(false) }}>Compras Realizadas</button>
        </div>
        <div className='providers-main'>
          <h2>Agregar Proveedor</h2>
          {/* Formulario para Agregar Proveedor */}
          <form className='add-provider-container' onSubmit={handleAddProvider}>
            <input
              placeholder='NOMBRE'
              className='product-input-addproduct'
              autoComplete='off'
              type='text'
              id='NOMBRE'
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              placeholder='TELEFONO'
              className='product-input-addproduct'
              autoComplete='off'
              type='number'
              id='TELEFONO'
              value={telefonoProveedor}
              onChange={(e) => setTelefonoProveedor(e.target.value)}
            />
            <input
              placeholder='DATOS'
              className='product-input-addproduct'
              autoComplete='off'
              type='text'
              id='DATOS'
              value={datosProveedor}
              onChange={(e) => setDatosProveedor(e.target.value)}
            />
            <button className='product-actions-button' type='submit'>Agregar Proveedor</button>
          </form>
          {filteredProviders.length === 0
            ? (
              <>
                <h1>No se encontraron Proveedores</h1>
              </>
              )
            : (
              <>
                <h2>PROVEEDORES</h2>
                <div className='providers-container'>
                  <h2>Nombre</h2>
                  <h2>Telefono</h2>
                  <h2>Datos del Proveedor</h2>
                  <h2>Acciones</h2>
                  {providers.map(provider => (
                    <React.Fragment key={provider.idProveedor}>
                      <p>{provider.nombreProveedor}</p>
                      <p>{provider.telefonoProveedor}</p>
                      <p>{provider.datosProveedor}</p>
                      <div className='cart-actions'>
                        <button className='product-actions-button' onClick={() => openModifyModal(provider)}>Editar</button>
                        <button className='product-actions-button' onClick={() => openDeleteModal(provider)}>Eliminar</button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                {showDeleteModal && (
                  <div className='modal'>
                    <div className='modal-background' onClick={closeDeleteModal} />
                    <div className='modal-container'>
                      <div className='modal-delete-container'>
                        <h1>¿Estás seguro de eliminar este proveedor?</h1>
                        <h2><strong>Este proceso no se puede deshacer.</strong></h2>
                        <p>Se eliminará permanentemente</p>
                        <p>Proveedor: {selectedProvider.nombreProveedor}</p>
                        <div className='records-modal-button-container-delete'>
                          <button onClick={closeDeleteModal} className='product-actions-button'>Cancelar</button>
                          <button onClick={handleDeleteProvider} className='product-actions-button'>Confirmar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {showModifyModal && (
                  <div className='modal'>
                    <div className='modal-background' onClick={closeModifyModal} />
                    <div className='modal-container'>
                      <div className='modal-modify-container'>
                        <h1>Modificar Proveedor</h1>
                        <form className='modify-purchase-container' onSubmit={handleModifyProvider}>
                          <div>
                            <h2>Proveedor</h2>
                            <input
                              placeholder='NOMBRE'
                              className='product-input-addproduct'
                              autoComplete='off'
                              type='text'
                              id='NOMBRE'
                              value={nombre}
                              onChange={(e) => setNombre(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <h2>Telefono</h2>
                            <input
                              placeholder='TELEFONO'
                              className='product-input-addproduct'
                              autoComplete='off'
                              type='number'
                              id='TELEFONO'
                              value={telefonoProveedor}
                              onChange={(e) => setTelefonoProveedor(e.target.value)}
                            />
                          </div>
                          <div>
                            <h2>Datos del Proveedor</h2>
                            <input
                              placeholder='DATOS'
                              className='product-input-addproduct'
                              autoComplete='off'
                              type='text'
                              id='DATOS'
                              value={datosProveedor}
                              onChange={(e) => setDatosProveedor(e.target.value)}
                            />
                          </div>
                          <div className='records-modal-button-container-delete'>
                            <button onClick={closeModifyModal} className='product-actions-button'>Cancelar</button>
                            <button type='submit' className='product-actions-button'>Modificar</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </>
              )}
        </div>
      </>
    )
  }

  if (showPurchaseRecordsPendings) {
    // COMPRAS PENDIENTES
    return (
      <>
        <div className='provider-select-menu'>
          <button className='product-actions-button' onClick={() => { setShowProviders(true); setShowPurchaseRecordsPendings(false); setShowPurchaseRecordsPlaced(false) }}>Proveedores</button>
          <button className='product-actions-button provider-button-selected' onClick={() => { setShowPurchaseRecordsPendings(true); setShowProviders(false); setShowPurchaseRecordsPlaced(false) }}>Compras Pendientes</button>
          <button className='product-actions-button' onClick={() => { setShowPurchaseRecordsPlaced(true); setShowProviders(false); setShowPurchaseRecordsPendings(false) }}>Compras Realizadas</button>
        </div>
        <div className='purchases-main'>
          <h2>AGREGAR COMPRA</h2>
          {/* Formulario para Agregar Compra */}
          <form className='add-purchase-container' onSubmit={handleAddPurchase}>
            <select required value={nombre} className='select-provider-container' onChange={(e) => setNombre(e.target.value)}>
              <option value=''>Seleccione un proveedor</option>
              {providers.map(provider => (
                <option key={provider.idProveedor} value={provider.nombreProveedor}>{provider.nombreProveedor}</option>
              ))}
            </select>

            <input
              placeholder='COMPRA'
              className='product-input-addproduct'
              autoComplete='off'
              type='text'
              id='COMPRA'
              value={datosCompra}
              onChange={(e) => setDatosCompra(e.target.value)}
              required
            />
            <button className='product-actions-button' type='submit'>Agregar Compra</button>
          </form>

          {/* Contenedor de Ordenes */}
          <h2>COMPRAS PENDIENTES</h2>
          {PurchaseRecordsPendings.length === 0
            ? (
              <>
                <h1>No se encontraron compras Pendientes</h1>
              </>
              )
            : (
              <>
                <div className='purchases-container'>
                  <h2>Proveedor</h2>
                  <h2>Datos de la Compra</h2>
                  <h2>Fecha</h2>
                  <h2>Acciones</h2>
                  {PurchaseRecordsPendings.map(purchase => (
                    <React.Fragment key={purchase.idRegistroCompra}>
                      <p>{purchase.proveedor}</p>
                      <button className='product-actions-button' onClick={() => openInfoModal(purchase)}>Informacion de la Compra</button>
                      <p>{new Date(purchase.fechaCompra).toLocaleDateString()}</p>
                      <div className='cart-actions'>
                        <button className='product-actions-button' onClick={() => handleChangePurchaseStatus(purchase, 'REALIZADA')}>Compra Realizada</button>
                        <button className='product-actions-button' onClick={() => openModifyModal(purchase)}>Editar</button>
                        <button className='product-actions-button' onClick={() => openDeleteModal(purchase)}>Eliminar</button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </>
              )}
        </div>
        {showInfoModal && (
          <div className='modal'>
            <div className='modal-background' onClick={closeInfoModal} />
            <div className='modal-container'>
              <div className='modal-info-container'>
                <h1>Información de la Compra</h1>
                <p>Proveedor: {selectedPurchaseRecord.proveedor}</p>
                <p>Compra: {selectedPurchaseRecord.datosCompra}</p>
                <p>Fecha: {new Date(selectedPurchaseRecord.fechaCompra).toLocaleDateString()}</p>
                <div className='records-modal-button-container'>
                  <button onClick={closeInfoModal} className='product-actions-button'>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div className='modal'>
            <div className='modal-background' onClick={closeDeleteModal} />
            <div className='modal-container'>
              <div className='modal-delete-container'>
                <h1>¿Estás seguro de eliminar esta compra?</h1>
                <h2><strong>Este proceso no se puede deshacer.</strong></h2>
                <p>Se eliminará permanentemente</p>
                <p>Compra: {selectedPurchaseRecord.datosCompra}</p>
                <div className='records-modal-button-container-delete'>
                  <button onClick={closeDeleteModal} className='product-actions-button'>Cancelar</button>
                  <button onClick={handleDeletePurchaseRecord} className='product-actions-button'>Confirmar</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModifyModal && (
          <div className='modal'>
            <div className='modal-background' onClick={closeModifyModal} />
            <div className='modal-container'>
              <div className='modal-modify-container'>
                <h1>Modificar Compra</h1>
                <form className='modify-purchase-container' onSubmit={handleModifyPurchase}>
                  <div>
                    <h3>PROVEEDOR</h3>
                    <select required value={selectedModifyProvider} className='select-provider-container' onChange={(e) => setSelectedModifyProvider(e.target.value)}>
                      <option value=''>Seleccione un proveedor</option>
                      {providers.map(provider => (
                        <option key={provider.idProveedor} value={provider.nombreProveedor}>{provider.nombreProveedor}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h3>COMPRA</h3>
                    <input
                      placeholder='COMPRA'
                      className='product-input-addproduct'
                      autoComplete='off'
                      type='text'
                      id='COMPRA'
                      value={selectedModifyCompra}
                      onChange={(e) => setSelectedModifyCompra(e.target.value)}
                      required
                    />
                  </div>
                  <div className='records-modal-button-container-delete'>
                    <button onClick={closeModifyModal} className='product-actions-button'>Cancelar</button>
                    <button type='submit' className='product-actions-button'>Modificar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  if (showPurchaseRecordsPlaced) {
    // COMPRAS REALIZADAS
    return (
      <>
        <div className='provider-select-menu'>
          <button className='product-actions-button' onClick={() => { setShowProviders(true); setShowPurchaseRecordsPendings(false); setShowPurchaseRecordsPlaced(false) }}>Proveedores</button>
          <button className='product-actions-button' onClick={() => { setShowPurchaseRecordsPendings(true); setShowProviders(false); setShowPurchaseRecordsPlaced(false) }}>Compras Pendientes</button>
          <button className='product-actions-button provider-button-selected' onClick={() => { setShowPurchaseRecordsPlaced(true); setShowProviders(false); setShowPurchaseRecordsPendings(false) }}>Compras Realizadas</button>
        </div>
        <div className='providers-main'>
          <h2>COMPRAS REALIZADAS</h2>
          {PurchaseRecordsPlaced.length === 0
            ? (
              <>
                <h1>No se encontraron Compras Realizadas</h1>
              </>
              )
            : (
              <>
                <div className='purchases-container'>
                  <h2>Proveedor</h2>
                  <h2>Datos del Compra</h2>
                  <h2>Fecha</h2>
                  <h2>Acciones</h2>
                  {PurchaseRecordsPlaced.map(purchase => (
                    <React.Fragment key={purchase.idRegistroCompra}>
                      <p>{purchase.proveedor}</p>
                      <button className='product-actions-button' onClick={() => openInfoModal(purchase)}>Informacion del Compra</button>
                      <p>{new Date(purchase.fechaCompra).toLocaleDateString()}</p>
                      <div className='cart-actions'>
                        <button className='product-actions-button' onClick={() => handleChangePurchaseStatus(purchase, 'RECIBIDO')}>Compra Recibida</button>
                        <button className='product-actions-button' onClick={() => openModifyModal(purchase)}>Editar</button>
                        <button className='product-actions-button' onClick={() => openDeleteModal(purchase)}>Eliminar</button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </>
              )}
        </div>
        {showInfoModal && (
          <div className='modal'>
            <div className='modal-background' onClick={closeInfoModal} />
            <div className='modal-container'>
              <div className='modal-info-container'>
                <h1>Información del Compra</h1>
                <p>Proveedor: {selectedPurchaseRecord.proveedor}</p>
                <p>Compra: {selectedPurchaseRecord.datosCompra}</p>
                <p>Fecha: {new Date(selectedPurchaseRecord.fechaCompra).toLocaleDateString()}</p>
                <div className='records-modal-button-container'>
                  <button onClick={closeInfoModal} className='product-actions-button'>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div className='modal'>
            <div className='modal-background' onClick={closeDeleteModal} />
            <div className='modal-container'>
              <div className='modal-delete-container'>
                <h1>¿Estás seguro de eliminar este compra?</h1>
                <h2><strong>Este proceso no se puede deshacer.</strong></h2>
                <p>Se eliminará permanentemente</p>
                <p>Compra: {selectedPurchaseRecord.datosCompra}</p>
                <div className='records-modal-button-container-delete'>
                  <button onClick={closeDeleteModal} className='product-actions-button'>Cancelar</button>
                  <button onClick={handleDeletePurchaseRecord} className='product-actions-button'>Confirmar</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModifyModal && (
          <div className='modal'>
            <div className='modal-background' onClick={closeModifyModal} />
            <div className='modal-container'>
              <div className='modal-modify-container'>
                <h1>Modificar Compra</h1>
                <form className='modify-purchase-container' onSubmit={handleModifyPurchase}>
                  <div>
                    <h3>PROVEEDOR</h3>
                    <select required value={selectedModifyProvider} className='select-provider-container' onChange={(e) => setSelectedModifyProvider(e.target.value)}>
                      <option value=''>Seleccione un proveedor</option>
                      {providers.map(provider => (
                        <option key={provider.idProveedor} value={provider.nombreProveedor}>{provider.nombreProveedor}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h3>COMPRA</h3>
                    <input
                      placeholder='COMPRA'
                      className='product-input-addproduct'
                      autoComplete='off'
                      type='text'
                      id='COMPRA'
                      value={selectedModifyCompra}
                      onChange={(e) => setSelectedModifyCompra(e.target.value)}
                      required
                    />
                  </div>
                  <div className='records-modal-button-container-delete'>
                    <button onClick={closeModifyModal} className='product-actions-button'>Cancelar</button>
                    <button type='submit' className='product-actions-button'>Modificar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}

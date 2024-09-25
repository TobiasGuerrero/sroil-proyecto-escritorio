import './Cart.css'
import React, { useState, useEffect } from 'react'
import { getCartItems, updateCartItem, deleteCartItem, createSaleRecord, emptyCart } from '../../services/api'
import { Loading } from '../Loading/Loading'
import { toast } from 'react-toastify'

export function Cart () {
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(true)

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productQuantity, setProductQuantity] = useState('')

  const [showSaleModal, setShowSaleModal] = useState(false)

  const fetchCartItems = async () => {
    try {
      const items = await getCartItems()
      setCartItems(items)
      calculateTotalPrice(items)
    } catch (error) {
      console.error('Error al obtener elementos del carrito:', error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    setTotalPrice(total)
  }

  const openEditModal = (product) => {
    setSelectedProduct(product)
    setShowEditModal(true)
    document.body.style.overflow = 'hidden'
  }

  const closeEditModal = () => {
    setSelectedProduct(null)
    setShowEditModal(false)
    setProductQuantity(0)
    document.body.style.overflow = 'visible'
  }

  const handleQuantityChange = async () => {
    if (isNaN(productQuantity) || productQuantity < 0.1) {
      toast.warn('Debe ingresar una cantidad valida', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
      setProductQuantity(0)
      return
    }
    try {
      await updateCartItem(selectedProduct.idProducto, productQuantity)
      fetchCartItems()
      closeEditModal()
      toast.success('Producto editado exitosamente', {
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
      console.error('Error en cart.jsx al actualizar la cantidad:', error)
    }
  }

  const handleDeleteItem = async (itemIdProducto) => {
    try {
      await deleteCartItem(itemIdProducto)
      fetchCartItems()
      toast.success('Producto eliminado exitosamente del carrito', {
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
      console.error('Error en cart.jsx al eliminar el producto del carrito:', error)
    }
  }

  const handleSale = async (event) => {
    // Prevenir el comportamiento predeterminado del evento solo si está presente
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault()
    }

    if (!customerName) {
      toast.warn('Por favor, ingresa nombre o patente para realizar la compra.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
      return
    }

    try {
      await createSaleRecord(cartItems, customerName)
      emptyCart()
      setCustomerName('')
      setCartItems([])
      closeSaleModal()

      toast.success('Productos guardados exitosamente', {
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
      console.error('Error al realizar la compra:', error)
      toast.error(`Error al realizar la compra: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
    }
  }

  const openSaleModal = () => {
    setShowSaleModal(true)
    document.body.style.overflow = 'hidden'
  }

  const closeSaleModal = () => {
    setShowSaleModal(false)
    document.body.style.overflow = 'visible'
  }

  if (loading) {
    return (
      <main className='cart-main'>
        <Loading />
      </main>
    )
  }

  if (cartItems.length === 0) {
    return (
      <main className='cart-main'><h1>Carrito de Compras Vacio</h1></main>
    )
  }

  return (
    <main className='cart-main'>
      <h2>Carrito de Ventas</h2>
      <div className='cart-container'>
        <h2>Marca</h2>
        <h2>Nombre</h2>
        <h2>Precio</h2>
        <h2>Cantidad</h2>
        <h2>Total</h2>
        <h2>Acciones</h2>
        {cartItems.map(item => (
          <React.Fragment key={item.idProducto}>
            <p>{item.marca}</p>
            <p>{item.nombre}</p>
            <p>$ {item.precio}</p>
            <p>{item.cantidad}</p>
            <p>$ {item.precio * item.cantidad}</p>
            <div className='cart-actions'>
              <button className='product-actions-button' onClick={() => openEditModal(item)}>Editar</button>
              <button className='product-actions-button' onClick={() => handleDeleteItem(item.idProducto)}>Eliminar</button>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className='cart-sale-container'>
        <h3>Precio Final: $ {totalPrice}</h3>
        <button onClick={openSaleModal} className='product-actions-button'>Registrar Venta</button>
      </div>

      {/* Modal de Editar cantidad del Producto */}
      {showEditModal && (
        <div className='modal'>
          <div className='modal-background' onClick={closeEditModal} />
          <div className='modal-container'>
            <h2>Editar cantidad del Producto</h2>
            {selectedProduct && (
              <div className='modal-form-container'>
                <h2>Marca</h2>
                <h2>Nombre</h2>
                <h2>Precio</h2>
                <h2>Cantidad Actual</h2>
                <h2>Cantidad Nueva</h2>
                <p>{selectedProduct.marca}</p>
                <p>{selectedProduct.nombre}</p>
                <p>$ {selectedProduct.precio}</p>
                <p>{selectedProduct.cantidad}</p>
                <input
                  className='product-input-addproduct'
                  type='number'
                  id='cantidad'
                  min='0.1'
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                  required
                />
              </div>
            )}
            <div className='modal-button-container'>
              <button onClick={closeEditModal} className='product-actions-button'>Cancelar</button>
              <button className='product-actions-button' onClick={handleQuantityChange}>Modificar Cantidad</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Efectuar Venta */}
      {showSaleModal && (
        <div className='modal'>
          <div className='modal-background' onClick={closeSaleModal} />
          <div className='modal-container'>
            <h2>Lista del Carrito</h2>
            <div className='modal-form-container'>
              <h2>Marca</h2>
              <h2>Nombre</h2>
              <h2>Precio</h2>
              <h2>Cantidad</h2>
              <h2>Precio Total</h2>
              {cartItems.map(item => (
                <React.Fragment key={item.idProducto}>
                  <p>{item.marca}</p>
                  <p>{item.nombre}</p>
                  <p>$ {item.precio}</p>
                  <p>{item.cantidad}</p>
                  <p>$ {item.precio * item.cantidad}</p>
                </React.Fragment>
              ))}
            </div>
            <div className='modal-sale-options-container'>
              <input
                className='product-search-input'
                placeholder='Nombre o Patente del Cliente'
                type='text'
                id='nombreCliente'
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <div className='modal-sale-button-container'>
                <button onClick={closeSaleModal} className='product-actions-button'>Cancelar</button>
                <h3 className='modal-s-h3'>Precio Final: $ {totalPrice}</h3>
                <button className='product-actions-button' onClick={handleSale}>Registrar Compra</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

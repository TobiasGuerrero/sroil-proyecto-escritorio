import React, { useState, useEffect } from 'react'
import { getProducts, addProduct, updateProduct, deleteProduct, getCartItems, addProductToCart } from '../../services/api'
import './Products.css'
import { Loading } from '../Loading/Loading'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function Products () {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Estados para los botones de ordenamiento
  const [isMarcaAsc, setIsMarcaAsc] = useState(true)
  const [isNombreAsc, setIsNombreAsc] = useState(true)
  const [isPrecioAsc, setIsPrecioAsc] = useState(true)
  const [isStockAsc, setIsStockAsc] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState([])

  // Estados para los campos del formulario de agregar producto
  const [marca, setMarca] = useState('')
  const [nombre, setNombre] = useState('')
  const [stock, setStock] = useState('')
  const [precio, setPrecio] = useState('')

  // Estado para controlar el modal de edición
  const [showEditModal, setShowEditModal] = useState(false)
  const [editProductId, setEditProductId] = useState(null)
  const [editMarca, setEditMarca] = useState('')
  const [editNombre, setEditNombre] = useState('')
  const [editStock, setEditStock] = useState('')
  const [editPrecio, setEditPrecio] = useState('')

  // Estado para el modal de agregar al carrito
  const [showCartModal, setShowCartModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartQuantity, setCartQuantity] = useState(0)

  const fetchProducts = async () => {
    try {
      const productsData = await getProducts()
      const sortedProducts = productsData.sort((a, b) => a.marca.localeCompare(b.marca))
      setTimeout(() => {
        setProducts(sortedProducts)
        setFilteredProducts(sortedProducts)
        setLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error al obtener productos:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSearchChange = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    const filtered = products.filter(product =>
      product.nombre.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredProducts(filtered.sort((a, b) => a.marca.localeCompare(b.marca)))
  }

  const openEditModal = (product) => {
    setEditProductId(product.id)
    setEditMarca(product.marca)
    setEditNombre(product.nombre)
    setEditStock(product.stock)
    setEditPrecio(product.precio)
    setShowEditModal(true)
    document.body.style.overflow = 'hidden'
  }

  const closeEditModal = () => {
    setEditProductId(null)
    setEditMarca('')
    setEditNombre('')
    setEditStock('')
    setEditPrecio('')
    setShowEditModal(false)
    document.body.style.overflow = 'visible'
  }

  const openCartModal = (product) => {
    setSelectedProduct(product)
    setShowCartModal(true)
    document.body.style.overflow = 'hidden'
  }

  const closeCartModal = () => {
    setSelectedProduct(null)
    setCartQuantity(0)
    setShowCartModal(false)
    document.body.style.overflow = 'visible'
  }

  const handleAddProduct = async (event) => {
    event.preventDefault()

    try {
      const newProduct = {
        marca,
        nombre,
        precio: parseFloat(precio),
        stock
      }
      await addProduct(newProduct)
      fetchProducts()

      setMarca('')
      setNombre('')
      setStock('')
      setPrecio('')

      toast.success('Producto agregado con exito', {
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
      console.error('Error al agregar producto:', error)
    }
  }

  const handleEditProduct = async (event) => {
    event.preventDefault()

    try {
      const updatedProduct = {
        idProducto: editProductId,
        marca: editMarca,
        nombre: editNombre,
        stock: editStock,
        precio: editPrecio
      }

      await updateProduct(updatedProduct)

      // Actualizar la lista de productos
      fetchProducts()
      closeEditModal()
      toast.success('Producto actualizado exitosamente', {
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
      console.error('Error en products.jsx al editar producto:', error)
      toast.error('Error al editar producto', {
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

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId)
      fetchProducts()
      closeEditModal()
      toast.success('Producto eliminado exitosamente', {
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
      console.error('Error al eliminar producto:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedProduct) return

    if (isNaN(cartQuantity) || cartQuantity < 0.1) {
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
      setCartQuantity(0)
      return
    }

    try {
      // Obtener los elementos actuales del carrito
      const cartItems = await getCartItems()

      // Verificar si el producto ya está en el carrito
      const existingCartItem = cartItems.find(item => item.idProducto === selectedProduct.id)

      if (existingCartItem) {
        toast.error('El producto ya está en el carrito.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        })
        closeCartModal()
        return // Salir de la función sin agregar el producto
      }

      // Si el producto no está en el carrito, procede a agregarlo
      const cartItem = {
        idProducto: selectedProduct.id,
        marca: selectedProduct.marca,
        nombre: selectedProduct.nombre,
        precio: selectedProduct.precio,
        cantidad: cartQuantity
      }

      await addProductToCart(cartItem)
      toast.success('Producto agregado al carrito exitosamente', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
      closeCartModal()
    } catch (error) {
      console.error('CSL Error en el Products.jsx al agregar producto al carrito:', error)
    }
  }

  const handleFilteredProductsByMarca = () => {
    // Clonar y ordenar los productos por marca
    const sortedProducts = [...products].sort((a, b) => {
      return isMarcaAsc ? a.marca.localeCompare(b.marca) : b.marca.localeCompare(a.marca)
    })

    // Actualizar el estado con los productos ordenados
    setFilteredProducts(sortedProducts)

    // Alternar el orden para la próxima llamada
    setIsMarcaAsc(!isMarcaAsc)
  }

  const handleSortedProductsByNombre = () => {
    // Clonar y ordenar los productos por nombre
    const sortedProducts = [...products].sort((a, b) => {
      return isNombreAsc ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
    })

    // Actualizar el estado con los productos ordenados
    setFilteredProducts(sortedProducts)

    // Alternar el orden para la próxima llamada
    setIsNombreAsc(!isNombreAsc)
  }

  const handleSortedProductsByPrecio = () => {
    // Clonar y ordenar los productos por precio
    const sortedProducts = [...products].sort((a, b) => {
      return isPrecioAsc ? a.precio - b.precio : b.precio - a.precio
    })

    // Actualizar el estado con los productos ordenados
    setFilteredProducts(sortedProducts)

    // Alternar el orden para la próxima llamada
    setIsPrecioAsc(!isPrecioAsc)
  }

  const handleFilteredProductsByStock = () => {
    // Clonar y ordenar los productos por stock
    const sortedProducts = [...products].sort((a, b) => {
      return isStockAsc ? a.stock.localeCompare(b.stock) : b.stock.localeCompare(a.stock)
    })

    // Actualizar el estado con los productos ordenados
    setFilteredProducts(sortedProducts)

    // Alternar el orden para la próxima llamada
    setIsStockAsc(!isStockAsc)
  }

  return (
    <main className='product-main'>
      <h1>Lista de Productos</h1>

      {/* Barra de Busqueda */}
      {!loading && (
        <input
          className='product-search-input'
          type='text'
          placeholder='Buscar producto por nombre'
          value={searchTerm}
          onChange={handleSearchChange}
        />
      )}

      {/* Formulario para Agregar Producto */}
      <form className='addproduct-container' onSubmit={handleAddProduct}>
        <input
          placeholder='MARCA'
          className='product-input-addproduct'
          autoComplete='off'
          type='text'
          id='marca'
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          required
        />

        <input
          placeholder='NOMBRE'
          className='product-input-addproduct'
          autoComplete='off'
          type='text'
          id='nombre'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          placeholder='PRECIO'
          className='product-input-addproduct'
          autoComplete='off'
          type='number'
          id='precio'
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />

        <select
          className='product-input-addproduct'
          id='stock'
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        >
          <option className='product-select-option' value=''>STOCK</option>
          <option className='product-select-option' value='Si'>Si</option>
          <option className='product-select-option' value='No'>No</option>
        </select>

        <button className='product-actions-button' type='submit'>Agregar Producto</button>
      </form>

      {/* Lista de Productos */}
      {loading
        ? (
          <Loading />
          )
        : (
            filteredProducts.length === 0
              ? (
                <h1>No se encontraron productos.</h1>
                )
              : (
                <div className='product-container'>
                  <h2 className='product-h2' onClick={handleFilteredProductsByMarca}>Marca</h2>
                  <h2 className='product-h2' onClick={handleSortedProductsByNombre}>Nombre</h2>
                  <h2 className='product-h2' onClick={handleSortedProductsByPrecio}>Precio</h2>
                  <h2 className='product-h2' onClick={handleFilteredProductsByStock}>Stock</h2>
                  <h2>Acciones</h2>
                  {filteredProducts.map(product => (
                    <React.Fragment key={product.id}>
                      <p>{product.marca}</p>
                      <p>{product.nombre}</p>
                      <p>$ {product.precio}</p>
                      <p>{product.stock}</p>
                      <div className='product-actions'>
                        <button className='product-actions-button' onClick={() => openEditModal(product)}>Editar</button>
                        <button className='product-actions-button' onClick={() => openCartModal(product)}>Vender</button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                )
          )}

      {/* Modal de Edición */}
      {showEditModal && (
        <div className='modal'>
          <div className='modal-background' onClick={closeEditModal} />
          <div className='modal-container'>
            <h2>Editar Producto</h2>
            <form className='modal-form-container' onSubmit={handleEditProduct}>
              <h2>Marca</h2>
              <h2>Nombre</h2>
              <h2>Precio</h2>
              <h2>Stock</h2>
              <h2>Acciones</h2>
              <input
                className='product-input-addproduct'
                type='text'
                id='marca'
                autoComplete='off'
                value={editMarca}
                onChange={(e) => setEditMarca(e.target.value)}
                required
              />
              <input
                className='product-input-addproduct'
                type='text'
                id='nombre'
                autoComplete='off'
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                required
              />
              <input
                className='product-input-addproduct'
                type='number'
                id='precio'
                autoComplete='off'
                value={editPrecio}
                onChange={(e) => setEditPrecio(e.target.value)}
                required
              />
              <select
                className='product-input-addproduct'
                id='stock'
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
                required
              >
                <option className='product-select-option' value='No'>No</option>
                <option className='product-select-option' value='Si'>Si</option>
              </select>
              <button className='product-actions-button' type='submit'>Guardar Cambios</button>
            </form>
            <div className='modal-button-container'>
              <button onClick={() => handleDeleteProduct(editProductId)} className='product-actions-button'>ELIMINAR PRODUCTO</button>
              <button onClick={closeEditModal} className='product-actions-button'>CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agregar al Carrito */}
      {showCartModal && (
        <div className='modal'>
          <div className='modal-background' onClick={closeCartModal} />
          <div className='modal-container'>
            <h2>Agregar al Carrito</h2>
            {selectedProduct && (
              <div className='modal-form-container'>
                <h2>Marca</h2>
                <h2>Nombre</h2>
                <h2>Precio</h2>
                <h2>Stock</h2>
                <h2>Cantidad</h2>
                <p>{selectedProduct.marca}</p>
                <p>{selectedProduct.nombre}</p>
                <p>$ {selectedProduct.precio}</p>
                <p>{selectedProduct.stock}</p>
                <input
                  className='product-input-addproduct'
                  type='number'
                  id='cantidad'
                  min='0'
                  value={cartQuantity}
                  onChange={(e) => setCartQuantity(e.target.value)}
                  required
                />
              </div>
            )}
            <div className='modal-button-container'>
              <button onClick={closeCartModal} className='product-actions-button'>Cancelar</button>
              <button className='product-actions-button' onClick={handleAddToCart}>Agregar al Carrito</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

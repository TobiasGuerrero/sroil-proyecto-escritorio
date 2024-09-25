const apiUrl = 'http://localhost:3001'

// Función de Productos
export const getProducts = async () => {
  try {
    const response = await fetch(`${apiUrl}/products`)
    if (!response.ok) {
      throw new Error('Error al obtener productos')
    }
    const data = await response.json()
    return data.map(product => ({
      id: product.idProducto,
      marca: product.marca,
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock
    }))
  } catch (error) {
    console.error('Error al obtener productos:', error)
    throw error
  }
}

export const addProduct = async (newProduct) => {
  try {
    const response = await fetch(`${apiUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    })

    if (!response.ok) {
      // Si la respuesta no es exitosa, lanzar un error con el mensaje del servidor si está disponible
      const errorData = await response.json()
      throw new Error(`Error al agregar producto: ${errorData.message}`)
    }

    // Si la respuesta es exitosa, retornar los datos si es relevante para tu aplicación
    const responseData = await response.json()
    return responseData // Por ejemplo, podrías retornar el producto agregado con su ID, etc.
  } catch (error) {
    // Capturar cualquier error durante la solicitud o manejo de respuestas
    console.error('Error al agregar producto:', error)
    throw error // Asegurarse de lanzar el error para manejarlo en el componente React
  }
}

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${apiUrl}/products/${productId}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Error al eliminar producto')
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    throw error
  }
}

export const updateProduct = async (updatedProductData) => {
  try { // Realizar la solicitud de actualización
    const response = await fetch(`${apiUrl}/products/${updatedProductData.idProducto}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProductData)
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(`Error en api.js al actualizar el producto: ${errorMessage}`)
    }

    // Devolver el producto actualizado
    return await response
  } catch (error) {
    console.error('Error en api.js al actualizar el producto:', error)
    throw error
  }
}

// Función de Carrito
export const getCartItems = async () => {
  try {
    const response = await fetch(`${apiUrl}/cart`)
    if (!response.ok) {
      throw new Error('Error al obtener elementos del carrito')
    }
    const data = await response.json()
    return data.map(productCart => ({
      idProducto: productCart.idProducto,
      marca: productCart.marca,
      nombre: productCart.nombre,
      precio: productCart.precio,
      cantidad: productCart.cantidad
    }))
  } catch (error) {
    console.error('Error al obtener elementos del carrito:', error)
    throw error
  }
}

export const addProductToCart = async (productData) => {
  try {
    const response = await fetch(`${apiUrl}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })

    if (!response.ok) {
      // Intenta parsear el JSON de error
      const errorData = await response.json()
      throw new Error(`THROW Error en el api.js al agregar producto al carrito: ${errorData.error}`)
    }
  } catch (error) {
    console.error('CSL Error en el api.js al agregar producto al carrito:', error)
    throw error
  }
}

export const updateCartItem = async (cartItemId, nuevaCantidad) => {
  try {
    const response = await fetch(`${apiUrl}/cart/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cantidad: nuevaCantidad }) // Solo enviar la nueva cantidad
    })

    if (!response.ok) {
      throw new Error('Error en api.js al actualizar la cantidad del producto en el carrito')
    }

    return response
  } catch (error) {
    console.error('Error en api.js al actualizar la cantidad del producto en el carrito:', error)
    throw error // Maneja el error según la lógica de tu aplicación
  }
}

export const deleteCartItem = async (cartItemId) => {
  try {
    const response = await fetch(`${apiUrl}/cart/${cartItemId}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Error en api.js al eliminar producto del carrito')
    }
  } catch (error) {
    console.error('Error en api.js al eliminar producto del carrito:', error)
    throw error
  }
}

export const emptyCart = async () => {
  try {
    const response = await fetch(`${apiUrl}/cart`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Error en api.js al vaciar el carrito')
    }
  } catch (error) {
    console.error('Error en api.js al vaciar el carrito:', error)
    throw error
  }
}

// Función de RegistroVentas
export const createSaleRecord = async (datosVenta, cliente) => {
  try {
    const response = await fetch(`${apiUrl}/sales_records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ datosVenta, cliente })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error en api.js al crear registro de compra: ${errorData.error}`)
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error en api.js al crear registro de compra:', error)
    throw error
  }
}

export const getAllSalesRecords = async () => {
  try {
    const response = await fetch(`${apiUrl}/sales_records`)
    if (!response.ok) {
      throw new Error('Error en api.js al obtener registros de compra')
    }
    const data = await response.json()
    return data.map(record => ({
      idRegistroVenta: record.idRegistroVenta,
      fechaVenta: new Date(record.fechaVenta),
      datosVenta: record.datosVenta,
      cliente: record.cliente || 'Cliente Desconocido'
    }))
  } catch (error) {
    console.error('Error en api.js al obtener registros de compra:', error)
    throw error
  }
}

export const getSaleRecordById = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/sales_records/${id}`)
    if (!response.ok) {
      throw new Error('Error en api.js al obtener registro de compra')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en api.js al obtener registro de compra por ID:', error)
    throw error
  }
}

export const deleteSaleRecord = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/sales_records/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Error en api.js al eliminar registro de compra')
    }
  } catch (error) {
    console.error('Error en api.js al eliminar registro de compra:', error)
    throw error
  }
}

// Funcion de Proveedores
export const getAllProviders = async () => {
  try {
    const response = await fetch(`${apiUrl}/providers`)
    if (!response.ok) {
      throw new Error('Error en api.js al obtener proveedores')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en api.js al obtener proveedores:', error)
    throw error
  }
}

export const createProvider = async (nombreProveedor, telefonoProveedor, datosProveedor) => {
  try {
    const response = await fetch(`${apiUrl}/providers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombreProveedor, telefonoProveedor, datosProveedor })
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error en api.js al crear proveedor: ${errorData.error}`)
    }
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error en api.js al crear proveedor:', error)
    throw error
  }
}

export const updateProviderById = async (idProveedor, nombreProveedor, telefonoProveedor, datosProveedor) => {
  try {
    const response = await fetch(`${apiUrl}/providers/${idProveedor}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombreProveedor, telefonoProveedor, datosProveedor })
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error en api.js al actualizar proveedor: ${errorData.error}`)
    }
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error en api.js al actualizar proveedor:', error)
    throw error
  }
}

export const deleteProviderById = async (idProveedor) => {
  try {
    const response = await fetch(`${apiUrl}/providers/${idProveedor}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error en api.js al eliminar proveedor: ${errorData.error}`)
    }
  } catch (error) {
    console.error('Error en api.js al eliminar proveedor:', error)
    throw error
  }
}

// Funcion de RegistroCompras
export const getAllPurchaseRecords = async () => {
  try {
    const response = await fetch(`${apiUrl}/purchase_records`)
    if (!response.ok) {
      throw new Error('Error en api.js al obtener registro de compras')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en api.js al obtener registro de compras:', error)
    throw error
  }
}

export const createPurchaseRecord = async (fecha, datos, proveedor, estado) => {
  try {
    const response = await fetch(`${apiUrl}/purchase_records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fecha, datos, proveedor, estado })
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error en api.js al crear registro de compra: ${errorData.error}`)
    }
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error en api.js al crear registro de compra:', error)
    throw error
  }
}

export const updatePurchaseRecordById = async (id, fecha, datos, proveedor, estado) => {
  try {
    const response = await fetch(`${apiUrl}/purchase_records/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fecha, datos, proveedor, estado })
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error en api.js al actualizar registro de compra: ${errorData.error}`)
    }
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error en api.js al actualizar registro de compra:', error)
    throw error
  }
}

export const deletePurchaseRecordById = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/purchase_records/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error en api.js al eliminar registro de compra: ${errorData.error}`)
    }
  } catch (error) {
    console.error('Error en api.js al eliminar registro de compra:', error)
    throw error
  }
}

// Funcion de cambios de aceite
export const getAllOilChangeRecords = async () => {
  try {
    const response = await fetch(`${apiUrl}/oil-change`)
    if (!response.ok) {
      throw new Error('Error al obtener los registros de cambios de aceite')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en api.js al obtener los registros de cambios de aceite:', error)
    throw error
  }
}

export const addOilChangeRecord = async (oilChangeData) => {
  try {
    const response = await fetch(`${apiUrl}/oil-change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(oilChangeData)
    })
    if (!response.ok) {
      throw new Error('Error al agregar un nuevo registro de cambio de aceite')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en api.js al agregar un nuevo registro de cambio de aceite:', error)
    throw error
  }
}

export const updateOilChangeRecord = async (id, oilChangeData) => {
  try {
    const response = await fetch(`${apiUrl}/oil-change/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(oilChangeData)
    })
    if (!response.ok) {
      throw new Error('Error al actualizar el registro de cambio de aceite')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en api.js al actualizar el registro de cambio de aceite:', error)
    throw error
  }
}

export const deleteOilChangeRecord = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/oil-change/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Error al eliminar el registro de cambio de aceite')
    }
  } catch (error) {
    console.error('Error en api.js al eliminar el registro de cambio de aceite:', error)
    throw error
  }
}

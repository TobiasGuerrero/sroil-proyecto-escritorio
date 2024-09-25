import './Budget.css'
import React, { useState } from 'react'
import JsPDF from 'jspdf'

import backgroundImg from '../../../assets/img/background-img.jpg'
import watermarkImg from '../../../assets/img/marca-agua.jpg'

export function Budget () {
  const [items, setItems] = useState([])
  const [item, setItem] = useState({
    cantidad: '',
    detalle: '',
    precioUnidad: '',
    precio: ''
  })
  const [cliente, setCliente] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    fecha: ''
  })
  const [observaciones, setObservaciones] = useState('')

  // Función para devolver "-" si el valor es inexistente
  const formatValue = (value) => {
    return value || '-'
  }

  // Actualizar valor del item
  const handleItemChange = (e) => {
    const { name, value } = e.target
    setItem({
      ...item,
      [name]: value,
      precio: name === 'cantidad' || name === 'precioUnidad'
        ? (item.cantidad * item.precioUnidad) || 0
        : item.precio
    })
  }

  // Actualizar valor del cliente
  const handleClienteChange = (e) => {
    const { name, value } = e.target
    setCliente({
      ...cliente,
      [name]: value
    })
  }

  // Agregar un nuevo item
  const addItem = () => {
    setItems([...items, { ...item, precio: item.cantidad * item.precioUnidad }])
    setItem({ cantidad: '', detalle: '', precioUnidad: '', precio: '' })
  }

  // Remover un item
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  // Calcular el total
  const calculateTotal = () => {
    return items.reduce((total, item) => total + parseFloat(item.precio || 0), 0)
  }

  // Generar PDF
  const generatePDF = async () => {
    const doc = new JsPDF({
      format: 'a4' // Tamaño A4
    })

    // Imagen de fondo (opcional)
    doc.addImage(backgroundImg, 'JPEG', 0, 0, 210, 297) // Imagen cubre toda la página A4

    // Sello de agua (opcional)
    doc.addImage(watermarkImg, 'PNG', 0, 0, 50, 50) // Imagen en la esquina superior izquierda

    // Texto de presupuesto
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(25)
    doc.text('Presupuesto SR oil', 105, 30, { align: 'center' })
    doc.setFontSize(10)
    doc.text('WhatsApp: 11 2128-6629', 105, 35, { align: 'center' })

    // Información del cliente
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 128) // Azul oscuro
    doc.text(`Cliente: ${formatValue(cliente.nombre)}`, 10, 50)
    doc.text(`Teléfono: ${formatValue(cliente.telefono)}`, 10, 60)
    doc.text(`Dirección: ${formatValue(cliente.direccion)}`, 10, 70)
    doc.text(`Fecha: ${formatValue(cliente.fecha)}`, 10, 80)

    // Encabezado de la tabla de productos
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.setFillColor(220, 220, 220) // Color gris claro
    doc.rect(10, 90, 190, 10, 'F') // Rectángulo para títulos de columna
    doc.text('CANTIDAD', 15, 95)
    doc.text('DETALLE', 45, 95)
    doc.text('P. UNITARIO', 140, 95)
    doc.text('PRECIO', 180, 95)

    // Dibujar líneas y detalles de cada producto
    items.forEach((item, index) => {
      const yPosition = 105 + index * 10
      doc.text(formatValue(item.cantidad), 15, yPosition)
      doc.text(formatValue(item.detalle), 45, yPosition)
      doc.text(`$${formatValue(item.precioUnidad)}`, 150, yPosition)
      doc.text(`$${formatValue(item.precio)}`, 180, yPosition)
      doc.line(10, yPosition + 2, 200, yPosition + 2) // Línea debajo del ítem
    })

    // Total
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total: $${calculateTotal()}`, 170, 105 + items.length * 10)

    // Observaciones
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const observacionesLíneas = doc.splitTextToSize(`Observaciones: ${formatValue(observaciones)}`, 190)
    doc.text(observacionesLíneas, 10, 115 + items.length * 10)

    // Guardar el PDF pagina web
    // doc.save('presupuesto.pdf')

    // Convertir el PDF en base64
    const pdfData = doc.output('datauristring').split(',')[1]

    // Enviar el PDF al proceso principal para guardarlo en el escritorio
    const filePath = await window.electronAPI.savePDF(pdfData)

    console.log(`PDF guardado en: ${filePath}`)
  }

  return (
    <main className='budget-main'>
      <h1>Crear Presupuesto</h1>

      {/* Datos del cliente */}
      <div className='budget-add-container'>
        <input
          className='budget-input'
          type='text'
          name='nombre'
          placeholder='Cliente'
          value={cliente.nombre}
          onChange={handleClienteChange}
        />
        <input
          className='budget-input'
          type='text'
          name='telefono'
          placeholder='Teléfono'
          value={cliente.telefono}
          onChange={handleClienteChange}
        />
        <input
          className='budget-input'
          type='text'
          name='direccion'
          placeholder='Dirección'
          value={cliente.direccion}
          onChange={handleClienteChange}
        />
        <input
          className='budget-input'
          type='date'
          name='fecha'
          value={cliente.fecha}
          onChange={handleClienteChange}
        />
      </div>

      <div className='budget-add-container'>
        <input
          className='budget-input'
          type='number'
          name='cantidad'
          placeholder='Cantidad'
          value={item.cantidad}
          onChange={handleItemChange}
        />
        <input
          className='budget-input'
          type='text'
          name='detalle'
          placeholder='Detalle'
          value={item.detalle}
          onChange={handleItemChange}
        />
        <input
          className='budget-input'
          type='number'
          name='precioUnidad'
          placeholder='Precio Unidad'
          value={item.precioUnidad}
          onChange={handleItemChange}
        />
        <button className='budget-button' onClick={addItem}>Agregar</button>
      </div>

      {items.length === 0
        ? (
          <p />
          )
        : (
          <>
            <h1>Presupuesto:</h1>
            <div className='budget-items-container'>
              <h3>CANTIDAD</h3>
              <h3>DETALLE</h3>
              <h3>P. UNIT.</h3>
              <h3>PRECIO</h3>
              <h3>ACCIONES</h3>
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  <p>{item.cantidad}</p>
                  <p>{item.detalle}</p>
                  <p>${item.precioUnidad}</p>
                  <p>${item.precio}</p>
                  <button className='budget-button' onClick={() => removeItem(index)}>Remover</button>
                </React.Fragment>
              ))}
            </div>

            <div className='budget-ob'>
              <textarea
                placeholder='Observaciones'
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                style={{
                  width: '40rem',
                  height: '4rem',
                  resize: 'none',
                  color: 'black',
                  padding: '.5rem'
                }}
              />
              <h3>Total: ${calculateTotal()}</h3>
            </div>
            <button className='budget-button' onClick={generatePDF}>Descargar PDF</button>
          </>
          )}
    </main>
  )
}

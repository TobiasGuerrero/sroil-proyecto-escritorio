import './OilChange.css'
import React, { useState } from 'react'
import { addOilChangeRecord } from '../../services/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function OilChange () {
  // Estado para manejar los campos del formulario
  const [form, setForm] = useState({
    patente: '',
    marcaAuto: '',
    kilometros: '',
    filtroAceite: '',
    filtroAire: '',
    filtroNafta: '',
    filtroHabitaculo: '',
    caja: '',
    marcaAceite: '',
    aditivo: '',
    tipoPago: '',
    pago: '',
    observaciones: ''
  })

  const [loading, setLoading] = useState(false)

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addOilChangeRecord(form)
      toast.success('Registro de cambio de aceite agregado con éxito', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
      setForm({
        patente: '',
        marcaAuto: '',
        kilometros: '',
        filtroAceite: '',
        filtroAire: '',
        filtroNafta: '',
        filtroHabitaculo: '',
        caja: '',
        marcaAceite: '',
        aditivo: '',
        tipoPago: '',
        pago: '',
        observaciones: ''
      }) // Limpiar el formulario
    } catch (err) {
      console.error('Error al agregar el registro de cambio de aceite:', err)
      toast.error('Error al agregar el registro de cambio de aceite', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='oil-main'>
      <h1>Agregar Registro de Cambio de Aceite</h1>
      <form className='oil-form' onSubmit={handleSubmit}>
        <div className='oil-form-data'>
          {/* Crear inputs para cada campo del formulario */}
          <section className='oil-form-section'>
            <label>Patente:</label>
            <input
              class='oil-form-input'
              type='text'
              name='patente'
              value={form.patente}
              onChange={handleChange}
              placeholder='PATENTE'
              required
            />
          </section>

          <section className='oil-form-section'>
            <label>Marca del Auto:</label>
            <input
              class='oil-form-input'
              type='text'
              name='marcaAuto'
              value={form.marcaAuto}
              onChange={handleChange}
              placeholder='MARCA DEL AUTO'
              required
            />
          </section>

          <section className='oil-form-section'>
            <label>Kilómetros:</label>
            <input
              class='oil-form-input'
              type='number'
              name='kilometros'
              value={form.kilometros}
              onChange={handleChange}
              placeholder='KILÓMETROS'
              required
            />
          </section>

          <section className='oil-form-section'>
            <label>Filtro de Aceite:</label>
            <input
              class='oil-form-input'
              type='text'
              name='filtroAceite'
              value={form.filtroAceite}
              onChange={handleChange}
              placeholder='FILTRO DE ACEITE'
              required
            />
          </section>

          <section className='oil-form-section'>
            <label>Filtro de Aire:</label>
            <input
              class='oil-form-input'
              type='text'
              name='filtroAire'
              value={form.filtroAire}
              onChange={handleChange}
              placeholder='FILTRO DE AIRE'
              required
            />
          </section>

          <section className='oil-form-section'>
            <label>Filtro de Nafta:</label>
            <input
              class='oil-form-input'
              type='text'
              name='filtroNafta'
              value={form.filtroNafta}
              onChange={handleChange}
              placeholder='FILTRO DE NAFTA'
              required
            />
          </section>

          <section className='oil-form-section'>
            <label>Filtro Habitáculo:</label>
            <input
              class='oil-form-input'
              type='text'
              name='filtroHabitaculo'
              value={form.filtroHabitaculo}
              onChange={handleChange}
              placeholder='FILTRO HABITÁCULO'
              required
            />
          </section>

          <section className='oil-form-section'>
            <label>Caja:</label>
            <input
              class='oil-form-input'
              type='text'
              name='caja'
              value={form.caja}
              onChange={handleChange}
              placeholder='CAJA'
              required
            />
          </section>

          <section className='oil-form-section'>
            <label>Aceite:</label>
            <input
              class='oil-form-input'
              type='text'
              name='marcaAceite'
              value={form.marcaAceite}
              onChange={handleChange}
              placeholder='ACEITE'
              required
            />
          </section>

          <section className='oil-form-section'>
            <label>Aditivo:</label>
            <input
              class='oil-form-input'
              type='text'
              name='aditivo'
              value={form.aditivo}
              onChange={handleChange}
              placeholder='ADITIVO'
              required
            />
          </section>
        </div>

        <div className='oil-form-pay'>
          <section className='oil-form-section'>
            <label>Tipo de Pago:</label>
            <input
              class='oil-form-input'
              type='text'
              name='tipoPago'
              value={form.tipoPago}
              onChange={handleChange}
              placeholder='TIPO DE PAGO'
              required
            />
          </section>

          <section className='oil-form-section'>
            <label>Pago:</label>
            <input
              class='oil-form-input'
              type='number'
              name='pago'
              value={form.pago}
              onChange={handleChange}
              placeholder='PAGO'
              required
            />
          </section>
        </div>

        <section className='oil-form-section'>
          <label>Observaciones:</label>
          <textarea
            class='oil-form-input'
            name='observaciones'
            value={form.observaciones}
            onChange={handleChange}
            placeholder='OBSERVACIONES'
          />
        </section>

        <button className='product-actions-button' type='submit' disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </main>
  )
}

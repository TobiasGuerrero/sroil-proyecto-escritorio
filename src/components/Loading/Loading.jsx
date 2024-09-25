import React from 'react'
import './Loading.css'

export function Loading () {
  return (
    <div className='loading-screen'>
      <div className='spinner' />
      <p>Cargando...</p>
    </div>
  )
}

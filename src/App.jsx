import './app.css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { NavBar } from './components/NavBar/Header'
import { Products } from './components/Products/Products'
import { Cart } from './components/Cart/Cart'
import { Records } from './components/Records/Records'
import { Providers } from './components/Providers/Providers'
import { OilChange } from './components/OilChange/OilChange'
import { Budget } from './components/Budget/Budget'

export function App () {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route exact path='/' element={<Products />} />
        <Route exact path='/productos' element={<Products />} />
        <Route exact path='/carrito' element={<Cart />} />
        <Route exact path='/registros' element={<Records />} />
        <Route exact path='/proveedores' element={<Providers />} />
        <Route exact path='/cambio-aceite' element={<OilChange />} />
        <Route exact path='/presupuesto' element={<Budget />} />
        <Route exact path='*' element={<h1 className='notFound'>404 NOT FOUND</h1>} />
      </Routes>
      <ToastContainer />
    </HashRouter>
  )
}

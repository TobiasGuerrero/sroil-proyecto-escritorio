import './Header.css'

export function NavBar () {
  return (
    <header>
      <nav className='navbar'>
        <ul className='header-ul'>
          <li className='header-li'><a className='header-li-a' href='#/productos'>PRODUCTOS</a></li>
          <li className='header-li'><a className='header-li-a' href='#/carrito'>CARRITO</a></li>
          <li className='header-li'><a className='header-li-a' href='#/cambio-aceite'>CAMBIO DE ACEITE</a></li>
          <li className='header-li'><a className='header-li-a' href='#/proveedores'>PROVEEDORES</a></li>
          <li className='header-li'><a className='header-li-a' href='#/registros'>REGISTROS</a></li>
          <li className='header-li'><a className='header-li-a' href='#/presupuesto'>PRESUPUESTO</a></li>
        </ul>
      </nav>
    </header>
  )
}

CREATE TABLE IF NOT EXISTS carrito (
    idProducto INTEGER PRIMARY KEY,
    marca TEXT,
    nombre TEXT,
    precio REAL,
    cantidad REAL
);

CREATE TABLE IF NOT EXISTS productos (
    idProducto INTEGER PRIMARY KEY AUTOINCREMENT,
    marca TEXT,
    nombre TEXT,
    precio REAL,
    stock TEXT
);

CREATE TABLE IF NOT EXISTS proveedores (
    idProveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreProveedor TEXT,
    telefonoProveedor INTEGER,
    datosProveedor TEXT
);

CREATE TABLE IF NOT EXISTS registro_cambios_aceite (
    idRegistroCambioAceite INTEGER PRIMARY KEY AUTOINCREMENT,
    patente TEXT,
    marcaAuto TEXT,
    kilometros REAL,
    fechaCambioAceite DATETIME,
    filtroAceite TEXT,
    filtroAire TEXT,
    filtroNafta TEXT,
    filtroHabitaculo TEXT,
    caja TEXT,
    marcaAceite TEXT,
    aditivo TEXT,
    tipoPago TEXT,
    pago INTEGER,
    observaciones TEXT
);

CREATE TABLE IF NOT EXISTS registro_compras (
    idRegistroCompra INTEGER PRIMARY KEY AUTOINCREMENT,
    fechaCompra DATETIME,
    datosCompra TEXT,
    proveedor TEXT,
    estado TEXT
);

CREATE TABLE IF NOT EXISTS registro_ventas (
    idRegistroVenta INTEGER PRIMARY KEY AUTOINCREMENT,
    fechaVenta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    datosVenta TEXT,
    cliente TEXT
);

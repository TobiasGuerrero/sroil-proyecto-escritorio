
# **Sr. Oil - Aplicación de Escritorio**

## **Descripción**

**Sr. Oil** es una aplicación de escritorio desarrollada utilizando **Electron**, **React** y **Vite**. Está diseñada para la gestión de inventario, registros de ventas, compras, proveedores y cambio de aceite de una empresa automotriz. La aplicación ofrece la posibilidad de generar presupuestos en PDF con un diseño personalizado y guardarlos directamente en el escritorio del usuario.

## **Tecnologías Utilizadas**

- **Frontend**: 
  - HTML5/CSS3
  - React (con Vite como build tool)
  - jsPDF para generar archivos PDF
- **Backend**: 
  - Node.js con Express
  - Electron (para empaquetar la aplicación como escritorio)
  - SQLite para la gestión de la base de datos embebida
- **Otros**: 
  - Electron Builder para empaquetar la aplicación para producción
  - Electron-log para registrar eventos
  - Preload para la comunicación segura entre los procesos de renderizado y principal

## **Características**

- **Gestión de inventarios**: permite agregar, editar y eliminar productos.
- **Carrito de compras**: los usuarios pueden crear y gestionar un carrito de productos.
- **Registro de compras y ventas**: la aplicación almacena los registros de cada transacción en una base de datos SQLite.
- **Gestión de proveedores**: se pueden almacenar y editar datos de proveedores.
- **Generación de PDF**: es posible crear presupuestos personalizados y guardarlos directamente en el escritorio del usuario.
- **Soporte offline**: la aplicación no requiere conexión a internet para funcionar.

## **Instalación y Ejecución en Desarrollo**

### **Requisitos previos**

- Node.js (versión 20 o superior)
- Git

### **Pasos de instalación**

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TobiasGuerrero/sroil-proyecto-escritorio.git
   cd sroil-proyecto-escritorio
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Para iniciar el modo de desarrollo (Frontend con React y Vite):
   ```bash
   npm run dev
   ```

4. Para iniciar el backend:
   ```bash
   npm run server
   ```

5. Para iniciar la aplicación de escritorio con Electron:
   ```bash
   npm start
   ```

### **Estructura del Proyecto**

```
📁 assets                    # Imágenes, iconos y recursos estáticos
📁 src
 ┣ 📁 components             # Componentes de React
 ┣ 📁 controllers            # Controladores para las solicitudes
 ┣ 📁 database               # Archivos de conexión y esquema de SQLite
 ┣ 📁 routes                 # Rutas del backend (Express)
 ┣ 📁 service                # API (Contenedor de todas las funciones)
 ┣ 📄 index.js               # Entrada principal del backend
 ┣ 📄 preload.cjs            # Archivo para comunicar el render con el proceso principal de Electron
 ┗ 📄 main.js                # Configuración y creación de la ventana de Electron
```

### **Empaquetar para Producción**

Para empaquetar la aplicación como un ejecutable de escritorio, usa **Electron Builder**:

```bash
npm run package
```

El paquete se generará en la carpeta `dist` del proyecto como SRoil Setup 0.0.0.

## **Uso de la Aplicación**

### **Funciones clave:**

- **Gestion de productos** desde el inventario (Agregar, Editar, Eliminar).
- **Agregar productos** al carrito desde el inventario.
- **Crear registros** de ventas, compras y cambios de aceite.
- **Seguimiento de stock** de compras.
- **Crear presupuesto** a partir de los productos seleccionados.
- **Guardar el PDF** con el presupuesto generado.

### **Generación de Presupuestos en PDF**

La aplicación permite generar y guardar presupuestos en formato PDF. Una vez completado el formulario con los detalles del cliente y los productos, puedes hacer clic en "Generar PDF". El archivo PDF será automáticamente guardado en el escritorio del usuario.

## **Registro de Errores**

La aplicación utiliza `electron-log` para registrar errores y eventos en archivos de log que se guardan en el sistema del usuario (C:\Users\USUARIO\AppData\Roaming\sroil\logs\main). Esto facilita la depuración de problemas en producción.

## **Licencia**

Este proyecto está bajo la licencia MIT. Para más detalles, consulta el archivo [LICENSE](./LICENSE).

## **Contacto**

- Desarrollador: [TobiasGuerrero](https://github.com/TobiasGuerrero)
- Email: [tobiasguerrerdevo@gmail.com]
- LinkedIn: [https://www.linkedin.com/in/tobias-guerrero-dev/](https://www.linkedin.com/in/tobias-guerrero-dev/)

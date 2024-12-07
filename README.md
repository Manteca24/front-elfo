# Frontend de Elfo

Este proyecto es la interfaz de usuario (frontend) de la aplicación ELFO, desarrollada con React y Vite. El propósito de Elfo es permitir a los usuarios encontrar ideas de regalos personalizadas mediante filtros como categorías, edad, intereses y más.

Todo el back de ELFO lo puedes encontrar en: https://github.com/Manteca24/back-elfo

La aplicacion esta desplegada en un entorno productivo de Netlify: https://elfo.netlify.app/

## Funcionalidades Principales

- **Búsqueda de Productos**: Los usuarios pueden buscar productos utilizando filtros como categorías, edad, precio, etc.
- **Filtros Dinámicos**: Los filtros se generan dinámicamente a partir de los productos disponibles en la base de datos.
- **Perfil de Usuario**: Los usuarios pueden crear una cuenta, iniciar sesión y gestionar sus favoritos y personas guardadas.
- **Favoritos**: Los usuarios pueden añadir productos y personas a su lista de favoritos.
- **Detalles del Producto**: Los usuarios pueden ver detalles completos de un producto, incluyendo comentarios y más.

## Tecnologías Utilizadas

- **React**: Framework para construir la interfaz de usuario.
- **Vite**: Herramienta para la construcción y el desarrollo rápido.
- **Axios**: Para la gestión de peticiones HTTP hacia la API de Elfo.
- **Firebase Authentication**: Para gestionar la autenticación de los usuarios.
- **React Router**: Para gestionar la navegación entre las páginas de la aplicación.

## Estructura del Proyecto

La estructura del proyecto está organizada de la siguiente manera:

```
src/
├── assets/ # Archivos estáticos como imágenes, fuentes, etc.
├── config/ # inicializa la aplicación de Firebase con la configuración proporcionada y exporta las instancias de autenticación y almacenamiento de Firebase para su uso en otros componentes.
├── components/ # Componentes reutilizables de la interfaz
├── contexts/ # contexto de usuario en React que gestiona el estado del usuario y su autenticación, realizando una solicitud a la API para obtener los datos del usuario si hay un token de autenticación.
├── pages/ # Páginas principales de la aplicación
├── styles/ # Archivos de estilos (CSS)
├── utils/ # Algunos templates
└── App.jsx # Componente raíz de la aplicación
```

## Páginas

- **Home**: Página de inicio donde los usuarios pueden buscar productos utilizando filtros como precio, edad, aficiones, etc. .
- **ProductDetails**: Página donde se visualiza la información detallada de un producto específico. Incluye la descripción, precio, categorías relacionadas, imagen además de mostrar los comentarios y valoraciones de otros usuarios.
- **Login/Signup**: Páginas donde los usuarios pueden iniciar sesión en su cuenta o registrarse. La página de registro pide información básica como nombre, correo electrónico y contraseña, mientras que la de inicio de sesión permite acceder a la cuenta mediante credenciales válidas.
- **Profile**: Página donde los usuarios gestionan su perfil personal, incluyendo la opción de actualizar su información, ver sus productos favoritos, gestionar las personas a quienes les han guardado regalos y modificar su foto de perfil o preferencias.
- **ResultsPage**: Página que muestra los resultados de búsqueda de productos según los filtros y criterios seleccionados. Los usuarios pueden ver una lista de productos recomendados basada en su búsqueda, ordenados por relevancia valorado en "stores" de MongoDB.
- **SelectPerson**: Página donde los usuarios eligen o añaden una persona para quien buscan regalos. Aquí pueden asignar etiquetas a la persona (por ejemplo, madre, amigo invisible, etc.) para facilitar la búsqueda de productos adecuados.
- **Admin**: Página de administración donde los administradores pueden gestionar productos, usuarios y categorías. También permite gestionar los filtros.
- **Dashboard**: El Home de los registrados.
- **Most-Gifted**: Página que muestra los productos más regalados o populares en la plataforma, basada en las interacciones de los usuarios y las tendencias de "regalados" (pendiente)
- **News**: Últimos productos subidos (pendiente)
- **SignUp**: Página donde los usuarios pueden registrarse creando una cuenta nueva, proporcionando datos como nombre, correo electrónico y una contraseña.
- **UploadGift**: Página donde los usuarios pueden subir sus propios regalos para compartir ideas con otros. Aquí pueden incluir detalles como nombre del regalo, precio, imagen, descripción y las categorías a las que pertenece.

## Componentes

- **SearchBar**: Barra de búsqueda con filtros dinámicos que permite a los usuarios buscar productos de manera eficiente mediante categorías, precios, y otros filtros personalizados.
- **ProductCard**: Tarjeta que muestra información básica de un producto, incluyendo su nombre, imagen, precio y un enlace a la página de detalles del producto.
- **AddPerson**: Componente donde los usuarios pueden agregar una nueva persona a la plataforma para la cual están buscando un regalo. Incluye opciones para añadir información personalizada como nombre, relación y características.
- **CategoryManager**: Componente de gestión de categorías que permite a los administradores añadir, editar o eliminar categorías de productos. Utiliza una interfaz sencilla para la manipulación de categorías.
- **FilterManager**: Componente que permite gestionar los filtros disponibles en la plataforma, ajustando los criterios para refinar la búsqueda de productos.
- **ChooseTags**: Componente que permite a los usuarios o administradores seleccionar etiquetas relacionadas con productos o personas. Ayuda a categorizar los productos para que sean más fáciles de encontrar.
- **GiveAPresent**: Componente donde los usuarios pueden seleccionar y enviar regalos a personas específicas en su perfil. Proporciona una interfaz fácil para elegir productos y personalizarlos para ocasiones especiales.
- **NavBar**: Barra de navegación secundaria que se encuentra en la parte superior de algunas páginas, proporcionando accesos rápidos a las funcionalidades más importantes como el perfil.
- **UnderConstructionPage**: Página que se muestra cuando una sección del sitio o una funcionalidad aún no está disponible. Ofrece una breve descripción de que la página está en construcción.
- **LogOutButton**: Botón que permite a los usuarios cerrar sesión de su cuenta en la aplicación de forma segura.
- **ProtectedRoute**: Componente que asegura que ciertas rutas de la aplicación solo sean accesibles para usuarios autenticados. Redirige a los usuarios no autenticados a la página de inicio de sesión.

## Instalación

### 1. Clona el repositorio

> git clone https://github.com/tu-usuario/elfo-frontend.git
> cd elfo-frontend
> npm install

// Crea un archivo .env en la raíz del proyecto con las siguientes variables:

```javascript
VITE_API_URL=https://back-elfo.onrender.com/products
VITE_FIREBASE_API_KEY=tu_api_key_de_firebase
```

Inicia el servidor de desarrollo

> npm run dev

## Uso

Al acceder a la página de inicio, los usuarios pueden usar los filtros para buscar productos.
Al hacer clic en un producto, se redirige a la página de detalles del producto, donde pueden ver más información y dejar comentarios una vez registrados.
Los usuarios pueden registrar una cuenta, iniciar sesión y gestionar sus favoritos y personas guardadas en el perfil. También pueden subir sus propios productos.
El administrador puede acceder al panel de administración a través de un botón en el perfil.

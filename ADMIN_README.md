# Sistema de Administración - LA LIGA TDV

## Panel de Administración CRUD

Este sistema proporciona un panel de administración completo para gestionar el contenido dinámico del sitio web de La Liga TDV.

## Características

### 1. **Carrusel de Imágenes**
   - Gestiona las imágenes del carrusel principal en la página de inicio
   - Campos:
     - Título
     - URL de imagen
     - Enlace (opcional)
     - Orden de visualización
     - Estado activo/inactivo
   - Auto-avance cada 5 segundos
   - Ruta: `/admin/carousel`

### 2. **Imágenes de Tabla**
   - Gestiona la imagen que aparece al lado de la tabla de posiciones
   - Campos:
     - Título
     - URL de imagen
     - Enlace (opcional)
     - Posición (izquierda/derecha)
     - Estado activo/inactivo
   - Ruta: `/admin/table-images`

### 3. **Sponsors**
   - Administra los patrocinadores mostrados en el sitio
   - Campos:
     - Nombre
     - URL del logo
     - Sitio web (opcional)
     - Orden de visualización
     - Estado activo/inactivo
   - Ruta: `/admin/sponsors`

## Acceso al Panel

### Requisitos
- Usuario con rol de **administrador**
- Token de autenticación válido

### Cómo acceder
1. Iniciar sesión con credenciales de administrador
2. Click en el botón "Admin" en la barra de navegación
3. O navegar directamente a `/admin`

### Usuario Admin por defecto
```
Email: admin@laliga.com
Password: admin123
```

## API Endpoints

### Carrusel
- `GET /api/carousel` - Obtener todas las imágenes
- `GET /api/carousel/active` - Obtener imágenes activas (público)
- `GET /api/carousel/:id` - Obtener imagen por ID
- `POST /api/carousel` - Crear imagen (admin)
- `PUT /api/carousel/:id` - Actualizar imagen (admin)
- `DELETE /api/carousel/:id` - Eliminar imagen (admin)

### Table Images
- `GET /api/table-images` - Obtener todas las imágenes
- `GET /api/table-images/active` - Obtener imágenes activas (público)
- `GET /api/table-images/:id` - Obtener imagen por ID
- `POST /api/table-images` - Crear imagen (admin)
- `PUT /api/table-images/:id` - Actualizar imagen (admin)
- `DELETE /api/table-images/:id` - Eliminar imagen (admin)

### Sponsors
- `GET /api/sponsors` - Obtener todos los sponsors
- `GET /api/sponsors/active` - Obtener sponsors activos (público)
- `GET /api/sponsors/:id` - Obtener sponsor por ID
- `POST /api/sponsors` - Crear sponsor (admin)
- `PUT /api/sponsors/:id` - Actualizar sponsor (admin)
- `DELETE /api/sponsors/:id` - Eliminar sponsor (admin)

## Base de Datos

### Tablas Nuevas

#### carousel_images
```sql
CREATE TABLE carousel_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  link VARCHAR(500),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### table_images
```sql
CREATE TABLE table_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  link VARCHAR(500),
  position ENUM('left', 'right') DEFAULT 'right',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### sponsors
```sql
CREATE TABLE sponsors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500) NOT NULL,
  website VARCHAR(500),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Configuración

### Actualizar Base de Datos
```bash
cd server
node scripts/setup.js
```

Este comando:
1. Crea las tablas necesarias
2. Inserta datos de ejemplo
3. Crea el usuario administrador

## Frontend Components

### Páginas Creadas
- `src/pages/AdminPanel.jsx` - Dashboard principal de admin
- `src/pages/CarouselAdmin.jsx` - Gestión de carrusel
- `src/pages/TableImagesAdmin.jsx` - Gestión de imágenes de tabla
- `src/pages/SponsorsAdmin.jsx` - Gestión de sponsors

### Rutas
```javascript
/admin                   → Panel principal
/admin/carousel         → Gestión de carrusel
/admin/table-images     → Gestión de imágenes
/admin/sponsors         → Gestión de sponsors
```

## Backend Structure

### Controllers
- `server/controllers/carousel.controller.js`
- `server/controllers/tableImage.controller.js`
- `server/controllers/sponsor.controller.js`

### Routes
- `server/routes/carousel.routes.js`
- `server/routes/tableImage.routes.js`
- `server/routes/sponsor.routes.js`

### Middleware
- `verifyToken` - Verifica el token JWT
- `isAdmin` - Verifica que el usuario sea administrador

## Seguridad

- Todas las rutas de modificación requieren autenticación
- Solo usuarios con rol 'admin' pueden crear/editar/eliminar
- Rutas públicas solo obtienen items activos
- Tokens JWT para autenticación

## Uso de Imágenes

### Opciones para URLs de Imágenes
1. **URLs externas** (recomendado para producción):
   ```
   https://tu-cdn.com/imagen.jpg
   ```

2. **Servicios de hosting de imágenes**:
   - Cloudinary
   - AWS S3
   - ImgBB
   - Imgur

3. **Placeholders para desarrollo**:
   ```
   https://via.placeholder.com/1200x400
   ```

## Próximas Mejoras

- [ ] Upload de imágenes directo desde el panel
- [ ] Preview en tiempo real
- [ ] Drag & drop para reordenar
- [ ] Galería de imágenes
- [ ] Estadísticas de visualización
- [ ] Historial de cambios

## Soporte

Para reportar bugs o solicitar funcionalidades, contactar al equipo de desarrollo.

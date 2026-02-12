# Backend - La Liga API

API REST para el sistema de gestión de partidos de voley "La Liga".

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas

## 📦 Instalación

1. Instalar dependencias:
```bash
cd server
npm install
```

2. Configurar variables de entorno:
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de MySQL
```

3. Crear la base de datos:
```bash
# Ejecutar el script SQL en MySQL
mysql -u root -p < database/schema.sql

# O importar desde MySQL Workbench o phpMyAdmin
```

## 🎯 Ejecutar el servidor

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:5000`

## 📚 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere auth)

### Partidos
- `GET /api/matches` - Obtener todos los partidos
- `GET /api/matches/:id` - Obtener partido por ID
- `POST /api/matches` - Crear partido (requiere admin)
- `PUT /api/matches/:id` - Actualizar partido (requiere admin)
- `DELETE /api/matches/:id` - Eliminar partido (requiere admin)

### Equipos
- `GET /api/teams` - Obtener todos los equipos
- `GET /api/teams/:id` - Obtener equipo por ID
- `GET /api/teams/:id/stats` - Obtener estadísticas del equipo
- `POST /api/teams` - Crear equipo (requiere admin)
- `PUT /api/teams/:id` - Actualizar equipo (requiere admin)
- `DELETE /api/teams/:id` - Eliminar equipo (requiere admin)

### Torneos
- `GET /api/tournaments` - Obtener todos los torneos
- `GET /api/tournaments/:id` - Obtener torneo por ID
- `POST /api/tournaments` - Crear torneo (requiere admin)
- `PUT /api/tournaments/:id` - Actualizar torneo (requiere admin)
- `DELETE /api/tournaments/:id` - Eliminar torneo (requiere admin)

## 🔐 Autenticación

Para las rutas protegidas, incluir el token JWT en el header:
```
Authorization: Bearer <token>
```

### Usuario por defecto
- **Email:** admin@laliga.com
- **Password:** admin123
- **Rol:** admin

## 🗄️ Estructura de la base de datos

### Tablas principales:
- **users** - Usuarios del sistema
- **teams** - Equipos
- **tournaments** - Torneos
- **matches** - Partidos

## 📝 Variables de entorno

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=laliga_db
DB_PORT=3306
JWT_SECRET=tu_clave_secreta
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🔧 Estructura del proyecto

```
server/
├── config/
│   └── database.js          # Configuración de MySQL
├── controllers/
│   ├── auth.controller.js   # Lógica de autenticación
│   ├── match.controller.js  # Lógica de partidos
│   ├── team.controller.js   # Lógica de equipos
│   └── tournament.controller.js
├── middleware/
│   └── auth.middleware.js   # Middleware de autenticación
├── routes/
│   ├── auth.routes.js       # Rutas de autenticación
│   ├── match.routes.js      # Rutas de partidos
│   ├── team.routes.js       # Rutas de equipos
│   └── tournament.routes.js
├── database/
│   └── schema.sql           # Schema de la base de datos
├── .env                      # Variables de entorno
├── .env.example             # Ejemplo de variables de entorno
├── index.js                 # Punto de entrada
└── package.json
```

## 🐛 Solución de problemas

### Error al conectar a MySQL
- Verificar que MySQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos exista

### Error de autenticación
- Verificar que el token JWT sea válido
- Verificar que el token no haya expirado
- Verificar formato del header Authorization

## 📄 Licencia

ISC

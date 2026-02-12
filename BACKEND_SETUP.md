# Backend Setup - La Liga

Backend con Node.js, Express y MySQL para el sistema de gestión de partidos de voley.

## 📋 Requisitos previos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## 🔧 Configuración

### 1. Instalar dependencias

```bash
cd server
npm install
```

### 2. Configurar MySQL

Asegúrate de que MySQL esté corriendo en tu máquina. Puedes verificarlo con:

```bash
mysql --version
```

### 3. Crear la base de datos

Importa el schema SQL en MySQL:

**Opción 1: Desde la línea de comandos**
```bash
mysql -u root -p < database/schema.sql
```

**Opción 2: Desde MySQL Workbench**
1. Abre MySQL Workbench
2. Conecta a tu servidor local
3. File > Open SQL Script
4. Selecciona `database/schema.sql`
5. Ejecuta el script

**Opción 3: Desde phpMyAdmin**
1. Abre phpMyAdmin
2. Crea una nueva base de datos llamada `laliga_db`
3. Importa el archivo `database/schema.sql`
**Importante:** Después de crear la base de datos, ejecuta el script de setup:
```bash
npm run setup
```

Este script creará el usuario admin con las credenciales correctas.
### 4. Configurar variables de entorno

El archivo `.env` ya está creado. Si necesitas modificarlo:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=laliga_db
DB_PORT=3306
JWT_SECRET=mi_clave_secreta_super_segura_2026
JWT_EXPIRE=7d
NODE_ENV=development
```

## ▶️ Ejecutar el servidor

### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor se ejecutará en: **http://localhost:5000**

## 🧪 Probar la API

### Usuario de prueba:
- **Email:** admin@laliga.com
- **Password:** admin123

### Test básico con cURL:

```bash
# Obtener todos los partidos
curl http://localhost:5000/api/matches

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@laliga.com","password":"admin123"}'

# Obtener equipos
curl http://localhost:5000/api/teams
```

## 🔗 Conectar con el Frontend

### 1. Instalar el frontend (si aún no lo hiciste):

```bash
# Desde la raíz del proyecto
cd ..
npm install
```

### 2. Asegúrate de que el backend esté corriendo (puerto 5000)

### 3. Ejecutar el frontend:

```bash
npm run dev
```

El frontend se ejecutará en: **http://localhost:5173**

### 4. Probar la integración:

1. Abre http://localhost:5173 en el navegador
2. Ve a la página de Login
3. Usa las credenciales: admin@laliga.com / admin123
4. Deberías poder iniciar sesión correctamente

## 📂 Estructura creada

```
server/
├── config/
│   └── database.js           # Configuración MySQL
├── controllers/
│   ├── auth.controller.js    # Login, register, profile
│   ├── match.controller.js   # CRUD de partidos
│   ├── team.controller.js    # CRUD de equipos
│   └── tournament.controller.js  # CRUD de torneos
├── middleware/
│   └── auth.middleware.js    # Verificación JWT
├── routes/
│   ├── auth.routes.js
│   ├── match.routes.js
│   ├── team.routes.js
│   └── tournament.routes.js
├── database/
│   └── schema.sql            # Schema con datos de ejemplo
├── .env                       # Variables de entorno
├── .env.example              # Plantilla de .env
├── index.js                  # Servidor Express
├── package.json
└── README.md                 # Este archivo
```

## 🐛 Solución de problemas comunes

### Error: "Credenciales inválidas" al hacer login
Si recibes este error con las credenciales correctas:
```bash
cd server
npm run setup
```
Este comando verificará y corregirá el hash del password del usuario admin.

### Error: "Cannot connect to MySQL"
- Verifica que MySQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica el puerto (default: 3306)

### Error: "Database does not exist"
- Ejecuta el script `database/schema.sql`
- O crea manualmente la base de datos: `CREATE DATABASE laliga_db;`

### Error: "Port 5000 already in use"
- Cambia el puerto en `.env` por ejemplo: `PORT=5001`
- O detén el proceso que usa el puerto 5000

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo en http://localhost:5000
- Verifica CORS en `index.js`
- Revisa la consola del navegador para ver errores

## 📚 Endpoints disponibles

### Autenticación (públicos)
- POST `/api/auth/login` - Iniciar sesión
- POST `/api/auth/register` - Registrarse
- GET `/api/auth/profile` - Ver perfil (requiere token)

### Partidos
- GET `/api/matches` - Lista de partidos
- GET `/api/matches/:id` - Detalle de partido
- POST `/api/matches` - Crear partido (admin)
- PUT `/api/matches/:id` - Actualizar partido (admin)
- DELETE `/api/matches/:id` - Eliminar partido (admin)

### Equipos
- GET `/api/teams` - Lista de equipos
- GET `/api/teams/:id` - Detalle de equipo
- GET `/api/teams/:id/stats` - Estadísticas
- POST `/api/teams` - Crear equipo (admin)
- PUT `/api/teams/:id` - Actualizar equipo (admin)
- DELETE `/api/teams/:id` - Eliminar equipo (admin)

### Torneos
- GET `/api/tournaments` - Lista de torneos
- GET `/api/tournaments/:id` - Detalle de torneo
- POST `/api/tournaments` - Crear torneo (admin)
- PUT `/api/tournaments/:id` - Actualizar torneo (admin)
- DELETE `/api/tournaments/:id` - Eliminar torneo (admin)

## 📝 Siguientes pasos

1. ✅ Backend creado
2. ✅ Base de datos configurada
3. ✅ Frontend actualizado para conectarse al backend
4. 🔄 Actualizar componentes Home.jsx para cargar datos del backend
5. 🔄 Crear panel de administración para gestionar partidos/equipos

¿Necesitas ayuda con algún paso? ¡Déjame saber!

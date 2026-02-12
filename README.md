# Volley - Frontend

Sistema de gestión de tabla deportiva de voleibol. Frontend estático con React, Vite y TailwindCSS.

## 🚀 Tecnologías

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework de CSS
- **React Router** - Navegación
- **Autenticación Mock** - Login sin backend

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🎯 Características

- ✅ Página de login con diseño moderno
- ✅ Vista pública de resultados y torneos
- ✅ Navegación completa (Torneos, Partidos, Clubes, Jugadores, etc.)
- ✅ Sistema de autenticación mock (localStorage)
- ✅ Diseño responsivo con TailwindCSS
- ✅ Rutas protegidas opcionales

## 📁 Estructura del Proyecto

```
tabla/
├── src/
│   ├── components/     # Componentes reutilizables
│   │   └── Navbar.jsx
│   ├── context/        # Context API (Auth)
│   │   └── AuthContext.jsx
│   ├── pages/          # Páginas principales
│   │   ├── Login.jsx
│   │   └── Home.jsx
│   ├── App.jsx         # Componente principal + routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Estilos globales
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔐 Autenticación

El sistema usa autenticación mock. Cualquier email/password funciona para el login.
Los datos se guardan en localStorage.

```javascript
// Login de ejemplo
email: cualquiera@email.com
password: cualquiera
```

## 🎨 Personalización

Los colores principales se pueden modificar en `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#4F46E5',    // Azul
      secondary: '#06B6D4',  // Cyan
    }
  }
}
```

## 📄 Licencia


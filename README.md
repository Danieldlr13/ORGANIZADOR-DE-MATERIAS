# 📚 Organizador de Materias

Aplicación web moderna para organizar materias, calendario de eventos y tareas académicas. Incluye autenticación con Google, almacenamiento en la nube con Firestore y funcionalidad offline.

🌐 **Demo en vivo:** [https://materias-cf8d7.web.app](https://materias-cf8d7.web.app)

## ✨ Características

- 🔐 **Autenticación**: Inicio de sesión con Google (Firebase Auth)
- 📖 **Gestión de materias**: Crea, edita y elimina materias con información detallada
- 📅 **Calendario de eventos**: Visualiza eventos por fecha con vista de calendario
- ✅ **Sistema de tareas**: Organiza tareas con estados (pendiente, en progreso, completada)
- 💾 **Persistencia offline**: Los datos se sincronizan automáticamente
- 📱 **Diseño responsive**: Funciona perfectamente en móvil, tablet y escritorio
- 🎨 **Interfaz moderna**: Sidebar colapsable, temas personalizables por materia

## 🚀 Demo Local

```bash
npm install
npm run dev
```

La aplicación se abrirá en `http://localhost:5173/`

## 📋 Requisitos

- Node.js 18+
- npm 9+
- Cuenta de Firebase (para desarrollo)

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/Danieldlr13/ORGANIZADOR-DE-MATERIAS.git
cd ORGANIZADOR-DE-MATERIAS
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase (Desarrollo)

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** (Google Sign-In)
3. Crea una base de datos **Firestore**
4. Copia las credenciales de tu proyecto
5. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

6. Completa `.env.local` con tus credenciales:
```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Compilar para producción
```bash
npm run build
```

## 🌐 Desplegar a Firebase Hosting

1. Instala Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Inicia sesión:
```bash
firebase login
```

3. Inicializa Firebase Hosting:
```bash
firebase init hosting
```

4. Despliega:
```bash
npm run build
firebase deploy --only hosting
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes de React
│   ├── Calendario.tsx   # Vista de calendario
│   ├── Header.tsx       # Encabezado
│   ├── Materias.tsx     # Gestión de materias
│   ├── Plantilla.tsx    # Plantilla base
│   └── Sidebar.tsx      # Barra lateral de navegación
├── context/            # Contextos de React
│   ├── AuthContext.tsx      # Autenticación
│   └── NavigationContext.tsx # Navegación
├── hooks/              # Custom hooks
│   ├── useFirestoreEventos.ts
│   └── useFirestoreMaterias.ts
├── config/
│   └── firebase.ts     # Configuración de Firebase
├── types/              # Tipos de TypeScript
└── main.tsx           # Punto de entrada
```

## 🔒 Seguridad

- Las credenciales de Firebase son públicas por diseño (lado del cliente)
- La seguridad real está en las **Firestore Security Rules**
- Cada usuario solo puede acceder a sus propios datos
- Autenticación requerida para todas las operaciones

### Reglas de Firestore recomendadas:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🛠️ Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Firebase**
  - Authentication (Google Sign-In)
  - Firestore (Base de datos NoSQL)
  - Hosting (Despliegue)
- **CSS3** - Estilos personalizados con diseño responsive

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 👤 Autor

**Daniel de la Rosa**

- GitHub: [@Danieldlr13](https://github.com/Danieldlr13)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
src/
  main.tsx             # Punto de entrada
  index.css            # Estilos globales (layout, colores, tipografia)
  components/
    Header.tsx         # Cabecera con nombre del desarrollador
    Materis.tsx        # Contenedor de todas las tarjetas
    Plantilla.tsx      # Componente para una tarjeta individual
  assets/              # Recursos estaticos (logos, imagenes)
```

## Personalizacion rapida

- **Actualizar materias:** edita `src/components/Materis.tsx` para agregar, quitar o cambiar materias.
- **Cambiar enlaces e imagenes:** cada tarjeta recibe `nombre`, `lugar`, `imagen` y `link` como props en `Plantilla.tsx`.
- **Modificar estilos:** ajusta colores, tipografias y layout en `src/index.css`.
- **Titulo principal:** reemplaza el texto del encabezado en `src/components/Header.tsx`.

## Tecnologias

- React 18 con TypeScript
- Vite como bundler y servidor de desarrollo
- CSS puro para la capa de presentacion

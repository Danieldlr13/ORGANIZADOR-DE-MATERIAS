# Configuración de Firebase para el Calendario

## Paso 1: Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o "Add project"
3. Nombra tu proyecto (ej: `organizador-materias`)
4. Acepta los términos y crea el proyecto

## Paso 2: Activar Firestore Database

1. En el menú lateral, ve a **Build** > **Firestore Database**
2. Haz clic en "Crear base de datos" o "Create database"
3. Selecciona **Modo de producción** (production mode)
4. Elige la ubicación más cercana (ej: `us-east1` o `southamerica-east1`)

## Paso 3: Configurar reglas de seguridad

En la pestaña **Reglas** de Firestore, reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /eventos/{eventoId} {
      // Permitir lectura y escritura solo a eventos del usuario autenticado
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      // Permitir crear eventos si el userId coincide
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Paso 4: Activar Authentication (anónima)

1. Ve a **Build** > **Authentication**
2. Haz clic en "Comenzar" o "Get started"
3. En la pestaña **Sign-in method**, habilita **Anónimo** (Anonymous)

## Paso 5: Obtener credenciales de tu app web

1. En el inicio de Firebase Console, haz clic en el ícono `</>` (Web)
2. Registra la app con un nombre (ej: `calendario-web`)
3. **No** marques Firebase Hosting (opcional)
4. Copia las credenciales que aparecen (firebaseConfig)

## Paso 6: Configurar variables de entorno

1. Crea un archivo `.env.local` en la raíz del proyecto:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y pega tus credenciales de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tu-api-key-real
   VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
   VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
   ```

3. **Importante**: El archivo `.env.local` está en `.gitignore` y NO se sube a GitHub

## Paso 7: Reiniciar el servidor de desarrollo

```bash
npm run dev
```

## Verificar funcionamiento

- El calendario debería cargar y mostrar "Sincronizado" en el header
- Crea un evento y abre la app en otro dispositivo (o navegador)
- El evento debería aparecer automáticamente en tiempo real
- Todos los dispositivos con la misma cuenta anónima verán los mismos eventos

## Solución de problemas

### "Error al conectar con el servidor"
- Verifica que las credenciales en `.env.local` sean correctas
- Asegúrate de haber activado Authentication (anónimo)

### "Error al sincronizar eventos"
- Verifica las reglas de Firestore
- Revisa la consola del navegador para errores específicos

### Los eventos no se sincronizan entre dispositivos
- Los usuarios anónimos son únicos por navegador
- Para sincronizar entre dispositivos, considera implementar autenticación con Google/Email

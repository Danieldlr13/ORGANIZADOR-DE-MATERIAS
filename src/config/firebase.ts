import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase
// En desarrollo: usa variables de entorno (.env.local)
// En producción: usa credenciales hardcodeadas
const firebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
} : {
  // Credenciales de producción (Firebase Hosting)
  apiKey: "AIzaSyCxwAInY64F_a0e0zv8YLD5sl7oyykam6M",
  authDomain: "materias-cf8d7.firebaseapp.com",
  projectId: "materias-cf8d7",
  storageBucket: "materias-cf8d7.firebasestorage.app",
  messagingSenderId: "79550482987",
  appId: "1:79550482987:web:5974efcb5d308e17d6786e"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Habilitar persistencia offline
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Persistencia offline no disponible: múltiples tabs abiertas');
  } else if (err.code === 'unimplemented') {
    console.warn('Persistencia offline no soportada en este navegador');
  }
});

// Inicializar Auth
export const auth = getAuth(app);

// Utilidad para migrar eventos de localStorage a Firestore
// Ejecuta esto en la consola del navegador si ya tenías eventos en localStorage

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export async function migrateLocalStorageToFirestore() {
  const STORAGE_KEY = "organizador.eventos.v1";
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      console.log('No hay eventos en localStorage para migrar');
      return;
    }

    const eventos = JSON.parse(raw);
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error('Usuario no autenticado. Espera a que cargue la app.');
      return;
    }

    console.log(`Migrando ${eventos.length} eventos a Firestore...`);

    for (const evento of eventos) {
      await addDoc(collection(db, 'eventos'), {
        title: evento.title,
        description: evento.description || '',
        start: evento.start,
        color: evento.color || '#1b95d2',
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    console.log('✅ Migración completada!');
    console.log('Puedes eliminar los datos de localStorage si quieres:');
    console.log(`localStorage.removeItem("${STORAGE_KEY}")`);

  } catch (err) {
    console.error('Error en la migración:', err);
  }
}

// Para ejecutar en consola del navegador:
// import { migrateLocalStorageToFirestore } from './utils/migrate';
// migrateLocalStorageToFirestore();

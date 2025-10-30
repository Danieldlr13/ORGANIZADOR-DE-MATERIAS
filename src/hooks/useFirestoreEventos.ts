import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export type Evento = {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO date (YYYY-MM-DD)
  color?: string;
  userId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export function useFirestoreEventos() {
  const { user } = useAuth(); // Usar usuario del contexto
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Suscripción en tiempo real a los eventos del usuario
  useEffect(() => {
    if (!user) {
      setEventos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'eventos'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventosData: Evento[] = [];
        snapshot.forEach((doc) => {
          eventosData.push({
            id: doc.id,
            ...doc.data()
          } as Evento);
        });
        setEventos(eventosData);
        setLoading(false);
        setSyncing(false);
      },
      (err) => {
        console.error('Error al cargar eventos:', err);
        setError('Error al sincronizar eventos');
        setLoading(false);
        setSyncing(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Crear evento
  const createEvento = async (evento: Omit<Evento, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('No autenticado');
    
    setSyncing(true);
    try {
      await addDoc(collection(db, 'eventos'), {
        ...evento,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error al crear evento:', err);
      setError('Error al guardar el evento');
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  // Actualizar evento
  const updateEvento = async (id: string, data: Partial<Omit<Evento, 'id' | 'userId'>>) => {
    setSyncing(true);
    try {
      const eventoRef = doc(db, 'eventos', id);
      await updateDoc(eventoRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error al actualizar evento:', err);
      setError('Error al actualizar el evento');
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  // Eliminar evento
  const deleteEvento = async (id: string) => {
    setSyncing(true);
    try {
      await deleteDoc(doc(db, 'eventos', id));
    } catch (err) {
      console.error('Error al eliminar evento:', err);
      setError('Error al eliminar el evento');
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  return {
    eventos,
    loading,
    error,
    syncing,
    createEvento,
    updateEvento,
    deleteEvento
  };
}

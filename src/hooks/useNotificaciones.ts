import { create } from 'zustand';

interface Notificacion {
  id: string;
  mensaje: string;
  tipo: 'info' | 'exito' | 'error';
  duracion?: number;
}

interface NotificacionesStore {
  notificaciones: Notificacion[];
  mostrarNotificacion: (notificacion: Omit<Notificacion, 'id'>) => void;
  eliminarNotificacion: (id: string) => void;
}

export const useNotificaciones = create<NotificacionesStore>((set) => ({
  notificaciones: [],
  mostrarNotificacion: (notificacion) => {
    const id = crypto.randomUUID();
    set((state) => ({
      notificaciones: [...state.notificaciones, { ...notificacion, id }],
    }));

    if (notificacion.duracion !== undefined) {
      setTimeout(() => {
        set((state) => ({
          notificaciones: state.notificaciones.filter((n) => n.id !== id),
        }));
      }, notificacion.duracion);
    }
  },
  eliminarNotificacion: (id) => {
    set((state) => ({
      notificaciones: state.notificaciones.filter((n) => n.id !== id),
    }));
  },
}));
import { create } from 'zustand';
import { Movimiento } from '../types/movimiento';

interface MovimientosStore {
  movimientos: Movimiento[];
  agregarMovimiento: (movimiento: Omit<Movimiento, 'id'> & { id?: string }) => void;
  actualizarMovimiento: (id: string, movimiento: Partial<Movimiento>) => void;
  eliminarMovimiento: (id: string) => void;
  obtenerMovimientosPorCuenta: (cuentaId: string) => Movimiento[];
  obtenerMovimientosPorCategoria: (categoria: string) => Movimiento[];
  reiniciarMovimientos: () => void;
}

export const useMovimientosStore = create<MovimientosStore>((set, get) => ({
  movimientos: [],
  agregarMovimiento: (movimiento) => {
    const nuevoMovimiento = {
      ...movimiento,
      id: movimiento.id || crypto.randomUUID(),
    };
    set((state) => ({
      movimientos: [...state.movimientos, nuevoMovimiento],
    }));
  },
  actualizarMovimiento: (id, movimiento) => {
    set((state) => ({
      movimientos: state.movimientos.map((m) =>
        m.id === id ? { ...m, ...movimiento } : m
      ),
    }));
  },
  eliminarMovimiento: (id) => {
    set((state) => ({
      movimientos: state.movimientos.filter((m) => m.id !== id),
    }));
  },
  obtenerMovimientosPorCuenta: (cuentaId) => {
    return get().movimientos.filter((m) => m.cuentaId === cuentaId);
  },
  obtenerMovimientosPorCategoria: (categoria) => {
    return get().movimientos.filter((m) => m.categoria === categoria);
  },
  reiniciarMovimientos: () => {
    set({ movimientos: [] });
  },
}));
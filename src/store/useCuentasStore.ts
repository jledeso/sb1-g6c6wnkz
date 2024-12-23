import { create } from 'zustand';
import { Cuenta } from '../types/cuenta';

interface CuentasStore {
  cuentas: Cuenta[];
  agregarCuenta: (cuenta: Omit<Cuenta, 'id'> & { id?: string }) => void;
  actualizarCuenta: (id: string, cuenta: Partial<Cuenta>) => void;
  eliminarCuenta: (id: string) => void;
  obtenerCuenta: (id: string) => Cuenta | undefined;
  reiniciarCuentas: () => void;
}

export const useCuentasStore = create<CuentasStore>((set, get) => ({
  cuentas: [],
  agregarCuenta: (cuenta) => {
    const nuevaCuenta = {
      ...cuenta,
      id: cuenta.id || crypto.randomUUID(),
    };
    set((state) => ({
      cuentas: [...state.cuentas, nuevaCuenta],
    }));
  },
  actualizarCuenta: (id, cuenta) => {
    set((state) => ({
      cuentas: state.cuentas.map((c) =>
        c.id === id ? { ...c, ...cuenta } : c
      ),
    }));
  },
  eliminarCuenta: (id) => {
    set((state) => ({
      cuentas: state.cuentas.filter((c) => c.id !== id),
    }));
  },
  obtenerCuenta: (id) => {
    return get().cuentas.find((c) => c.id === id);
  },
  reiniciarCuentas: () => {
    set({ cuentas: [] });
  },
}));
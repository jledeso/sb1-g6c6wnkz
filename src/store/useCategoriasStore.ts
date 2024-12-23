import { create } from 'zustand';
import { Categoria } from '../types/categoria';

interface CategoriasStore {
  categorias: Categoria[];
  agregarCategoria: (categoria: Omit<Categoria, 'id'> & { id?: string }) => void;
  actualizarCategoria: (id: string, categoria: Partial<Categoria>) => void;
  eliminarCategoria: (id: string) => void;
  reiniciarCategorias: () => void;
}

export const useCategoriasStore = create<CategoriasStore>((set) => ({
  categorias: [],
  agregarCategoria: (categoria) => {
    const nuevaCategoria = {
      ...categoria,
      id: categoria.id || crypto.randomUUID(),
    };
    set((state) => ({
      categorias: [...state.categorias, nuevaCategoria],
    }));
  },
  actualizarCategoria: (id, categoria) => {
    set((state) => ({
      categorias: state.categorias.map((c) =>
        c.id === id ? { ...c, ...categoria } : c
      ),
    }));
  },
  eliminarCategoria: (id) => {
    set((state) => ({
      categorias: state.categorias.filter((c) => c.id !== id),
    }));
  },
  reiniciarCategorias: () => {
    set({ categorias: [] });
  },
}));
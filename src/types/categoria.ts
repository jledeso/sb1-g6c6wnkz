export interface Categoria {
  id: string;
  nombre: string;
  tipo: 'ingreso' | 'gasto' | 'ambos';
  color: string;
  icono?: string;
}

export const CATEGORIAS_PREDETERMINADAS: Omit<Categoria, 'id'>[] = [
  { nombre: 'Nómina', tipo: 'ingreso', color: '#10B981' },
  { nombre: 'Alimentación', tipo: 'gasto', color: '#EF4444' },
  { nombre: 'Transporte', tipo: 'gasto', color: '#F59E0B' },
  { nombre: 'Ocio', tipo: 'gasto', color: '#6366F1' },
  { nombre: 'Hogar', tipo: 'gasto', color: '#8B5CF6' },
  { nombre: 'Salud', tipo: 'gasto', color: '#EC4899' },
  { nombre: 'Otros', tipo: 'ambos', color: '#6B7280' },
];
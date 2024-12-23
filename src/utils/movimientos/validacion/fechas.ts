import { startOfDay } from 'date-fns';

export function obtenerFechaKey(fecha: Date): string {
  return startOfDay(fecha).toISOString();
}
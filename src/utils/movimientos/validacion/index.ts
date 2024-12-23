export * from './actualizador';
export * from './fechas';
export * from './procesador';
export * from './validaciones';

export function obtenerIdOriginal(id: string): string {
  return id.split('_')[0];
}
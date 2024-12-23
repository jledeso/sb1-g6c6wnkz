import { Movimiento } from '../types/movimiento';
import { formatearMoneda } from './formato';
import { formatearFecha } from './fecha';

export function exportarMovimientosCSV(movimientos: Movimiento[]): string {
  const cabeceras = [
    'Fecha',
    'Concepto',
    'Categoría',
    'Tipo',
    'Importe',
    'Cuenta',
  ].join(',');

  const filas = movimientos.map((movimiento) => {
    return [
      formatearFecha(movimiento.fecha),
      `"${movimiento.concepto}"`,
      `"${movimiento.categoria}"`,
      movimiento.tipo,
      formatearMoneda(movimiento.importe).replace('€', '').trim(),
      `"${movimiento.cuentaId}"`,
    ].join(',');
  });

  return [cabeceras, ...filas].join('\n');
}

export function descargarCSV(contenido: string, nombreArchivo: string): void {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', nombreArchivo);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
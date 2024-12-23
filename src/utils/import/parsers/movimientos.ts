import { Movimiento } from '../../../types/movimiento';
import { limpiarValorCampo, parsearFechaDesdeCSV } from './csv';
import { parseBase64JSON } from './base64';
import { parseValidaciones } from './validaciones';

export function parsearMovimientos(contenido: string): Movimiento[] {
  if (!contenido) return [];

  const lineas = contenido.split('\n').filter(l => l.trim());
  const headers = lineas[0].split(',').map(h => h.trim());
  
  return lineas.slice(1).map(linea => {
    const valores = linea.split(',').map(limpiarValorCampo);
    const movimiento: any = {};
    
    headers.forEach((header, index) => {
      if (['fecha', 'fechaInicio', 'fechaFin'].includes(header) && valores[index]) {
        movimiento[header] = parsearFechaDesdeCSV(valores[index]);
      } else if (header === 'importe') {
        movimiento[header] = Number(valores[index]);
      } else if (header === 'esPeriodico') {
        movimiento[header] = valores[index].toLowerCase() === 'true';
      } else if (header === 'configuracionPeriodicidad' && valores[index]) {
        movimiento[header] = parseBase64JSON(valores[index]);
      } else if (header === 'validaciones' && valores[index]) {
        movimiento[header] = parseValidaciones(valores[index]);
      } else {
        movimiento[header] = valores[index];
      }
    });

    return movimiento;
  });
}
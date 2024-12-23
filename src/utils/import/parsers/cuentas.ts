import { Cuenta } from '../../../types/cuenta';
import { limpiarValorCampo, parsearFechaDesdeCSV } from './csv';

export function parsearCuentas(contenido: string): Cuenta[] {
  if (!contenido) return [];

  const lineas = contenido.split('\n').filter(l => l.trim());
  const headers = lineas[0].split(',').map(h => h.trim());
  
  return lineas.slice(1).map(linea => {
    const valores = linea.split(',').map(limpiarValorCampo);
    const cuenta: any = {
      saldosReales: [] // Inicializar array vacío por defecto
    };
    
    headers.forEach((header, index) => {
      if (header === 'configuracionCredito' && valores[index]) {
        try {
          cuenta[header] = JSON.parse(valores[index]);
        } catch {
          cuenta[header] = undefined;
        }
      } else if (['saldo', 'saldoInicial', 'limiteCredito'].includes(header)) {
        cuenta[header] = valores[index] ? Number(valores[index]) : undefined;
      } else if (header === 'fechaSaldoInicial') {
        cuenta[header] = parsearFechaDesdeCSV(valores[index]);
      } else {
        cuenta[header] = valores[index];
      }
    });

    return cuenta;
  });
}
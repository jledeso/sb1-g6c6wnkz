import { dividirEnSecciones } from './parsers/csv';
import { parsearCuentas } from './parsers/cuentas';
import { parsearCategorias } from './parsers/categorias';
import { parsearMovimientos } from './parsers/movimientos';
import { Cuenta, SaldoReal } from '../../types/cuenta';

function parsearSaldosReales(contenido: string): { cuentaId: string; saldoReal: SaldoReal }[] {
  if (!contenido) return [];

  const lineas = contenido.split('\n').filter(l => l.trim());
  if (lineas.length < 2) return [];

  const headers = lineas[0].split(',').map(h => h.trim());
  
  return lineas.slice(1).map(linea => {
    const valores = linea.split(',').map(v => v.trim());
    const saldoReal: any = {};
    
    headers.forEach((header, index) => {
      if (header === 'saldo') {
        saldoReal[header] = Number(valores[index]);
      } else if (header === 'fecha') {
        saldoReal.fecha = new Date(valores[index].split('/').reverse().join('-'));
      } else if (header === 'notas') {
        saldoReal[header] = valores[index].replace(/^"(.*)"$/, '$1') || '';
      } else if (header === 'cuentaId') {
        saldoReal.cuentaId = valores[index];
      } else {
        saldoReal[header] = valores[index];
      }
    });

    const { cuentaId, ...saldoRealSinCuentaId } = saldoReal;
    return { cuentaId, saldoReal: saldoRealSinCuentaId };
  });
}

export function importarDatosDesdeCSV(contenido: string) {
  try {
    const secciones = dividirEnSecciones(contenido);
    const cuentas = parsearCuentas(secciones.CUENTAS || '');
    
    // Si hay sección de saldos reales, procesarla y asignar a las cuentas correspondientes
    if (secciones.SALDOS_REALES) {
      const saldosReales = parsearSaldosReales(secciones.SALDOS_REALES);
      saldosReales.forEach(({ cuentaId, saldoReal }) => {
        const cuenta = cuentas.find(c => c.id === cuentaId);
        if (cuenta) {
          cuenta.saldosReales.push(saldoReal);
        }
      });
    }

    return {
      cuentas,
      categorias: parsearCategorias(secciones.CATEGORIAS || ''),
      movimientos: parsearMovimientos(secciones.MOVIMIENTOS || '')
    };
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Error al importar los datos. Por favor, verifica el formato del archivo.');
  }
}
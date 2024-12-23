import { dividirEnSecciones } from './parsers/csv';
import { parsearCuentas } from './parsers/cuentas';
import { parsearCategorias } from './parsers/categorias';
import { parsearMovimientos } from './parsers/movimientos';

export function importarDatosDesdeCSV(contenido: string) {
  try {
    const secciones = dividirEnSecciones(contenido);
    
    return {
      cuentas: parsearCuentas(secciones.CUENTAS || ''),
      categorias: parsearCategorias(secciones.CATEGORIAS || ''),
      movimientos: parsearMovimientos(secciones.MOVIMIENTOS || '')
    };
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Error al importar los datos. Por favor, verifica el formato del archivo.');
  }
}
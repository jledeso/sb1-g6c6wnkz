import { Categoria } from '../../../types/categoria';
import { limpiarValorCampo } from './csv';

export function parsearCategorias(contenido: string): Categoria[] {
  if (!contenido) return [];

  const lineas = contenido.split('\n').filter(l => l.trim());
  const headers = lineas[0].split(',').map(h => h.trim());
  
  return lineas.slice(1).map(linea => {
    const valores = linea.split(',').map(limpiarValorCampo);
    const categoria: any = {};
    
    headers.forEach((header, index) => {
      categoria[header] = valores[index];
    });

    return categoria;
  });
}
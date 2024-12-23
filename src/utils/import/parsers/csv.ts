import { parsearFecha } from '../../fecha';

export function dividirEnSecciones(contenido: string): Record<string, string> {
  const secciones: Record<string, string> = {};
  let seccionActual = '';
  let contenidoSeccion: string[] = [];

  contenido.split('\n').forEach(linea => {
    const lineaTrimmed = linea.trim();
    if (lineaTrimmed.startsWith('[') && lineaTrimmed.endsWith(']')) {
      if (seccionActual) {
        secciones[seccionActual] = contenidoSeccion.join('\n');
      }
      seccionActual = lineaTrimmed.slice(1, -1);
      contenidoSeccion = [];
    } else if (lineaTrimmed && seccionActual) {
      contenidoSeccion.push(lineaTrimmed);
    }
  });

  if (seccionActual) {
    secciones[seccionActual] = contenidoSeccion.join('\n');
  }

  return secciones;
}

export function parsearFechaDesdeCSV(valor: string): Date {
  const fecha = parsearFecha(valor, 'dd/MM/yyyy');
  if (!fecha) {
    throw new Error(`Fecha inválida: ${valor}`);
  }
  return fecha;
}

export function limpiarValorCampo(valor: string): string {
  return valor.replace(/^"(.*)"$/, '$1').trim();
}
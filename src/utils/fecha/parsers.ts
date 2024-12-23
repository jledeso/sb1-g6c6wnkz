import { parse, isValid } from 'date-fns';

export function parsearFecha(fecha: string, formato: string = 'yyyy-MM-dd'): Date | null {
  try {
    const fechaParseada = parse(fecha, formato, new Date());
    return isValid(fechaParseada) ? fechaParseada : null;
  } catch {
    return null;
  }
}

export function parsearFechaDesdeISO(fecha: string): Date | null {
  try {
    const fechaParseada = new Date(fecha);
    return isValid(fechaParseada) ? fechaParseada : null;
  } catch {
    return null;
  }
}
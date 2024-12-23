import { format, isValid, isFuture, isPast, isToday, parse } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatters
export function formatearFecha(fecha: Date | string | number): string {
  const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
  
  if (!isValid(fechaObj)) {
    return 'Fecha inválida';
  }
  
  return format(fechaObj, 'd MMMM yyyy', { locale: es });
}

export function formatearFechaCorta(fecha: Date | string | number): string {
  const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
  
  if (!isValid(fechaObj)) {
    return 'Fecha inválida';
  }
  
  return format(fechaObj, 'dd/MM/yyyy', { locale: es });
}

export function formatearFechaInput(fecha: Date | string | number): string {
  const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
  
  if (!isValid(fechaObj)) {
    return '';
  }
  
  return format(fechaObj, 'yyyy-MM-dd');
}

// Parsers
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

// Validators
export function esFechaValida(fecha: Date | string | number): boolean {
  const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
  return isValid(fechaObj);
}

export function esFechaFutura(fecha: Date | string | number): boolean {
  const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
  return isValid(fechaObj) && isFuture(fechaObj);
}

export function esFechaPasada(fecha: Date | string | number): boolean {
  const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
  return isValid(fechaObj) && isPast(fechaObj);
}

export function esFechaHoy(fecha: Date | string | number): boolean {
  const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
  return isValid(fechaObj) && isToday(fechaObj);
}
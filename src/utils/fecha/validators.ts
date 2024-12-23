import { isValid, isFuture, isPast, isToday } from 'date-fns';

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
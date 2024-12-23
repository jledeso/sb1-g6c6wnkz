import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

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
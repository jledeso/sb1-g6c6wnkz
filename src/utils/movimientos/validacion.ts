import { Movimiento } from '../../types/movimiento';
import { MovimientoProcesado } from './tipos';
import { startOfDay } from 'date-fns';

export interface ValidacionInfo {
  fechaReal: Date;
  validado: boolean;
}

export function obtenerIdOriginal(id: string): string {
  return id.split('_')[0];
}

export function obtenerFechaKey(fecha: Date): string {
  return startOfDay(fecha).toISOString();
}

export function obtenerValidacionMovimiento(
  movimiento: Movimiento,
  fechaPrevista: Date
): ValidacionInfo | null {
  if (!movimiento.validaciones) {
    return null;
  }

  const fechaKey = obtenerFechaKey(fechaPrevista);
  const validacion = movimiento.validaciones[fechaKey];

  if (!validacion) {
    return null;
  }

  return {
    fechaReal: new Date(validacion.fecha),
    validado: validacion.validado
  };
}

export function procesarMovimientoConValidacion(
  movimiento: Movimiento,
  fechaPrevista: Date
): MovimientoProcesado {
  const validacion = obtenerValidacionMovimiento(movimiento, fechaPrevista);

  return {
    ...movimiento,
    fechaPrevista,
    fechaReal: validacion?.fechaReal || fechaPrevista,
    validado: !!validacion?.validado,
    fecha: validacion?.fechaReal || fechaPrevista // La fecha efectiva para cálculos
  };
}

export function actualizarValidacionMovimiento(
  movimiento: Movimiento,
  fechaPrevista: Date,
  fechaReal: Date,
  validado: boolean
): Movimiento {
  const fechaKey = obtenerFechaKey(fechaPrevista);
  const validacionesActuales = movimiento.validaciones || {};

  return {
    ...movimiento,
    validaciones: {
      ...validacionesActuales,
      [fechaKey]: {
        fecha: fechaReal,
        validado
      }
    }
  };
}
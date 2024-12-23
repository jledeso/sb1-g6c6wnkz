import { Movimiento } from '../../../types/movimiento';
import { ValidacionInfo } from '../tipos';
import { obtenerFechaKey } from './fechas';

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
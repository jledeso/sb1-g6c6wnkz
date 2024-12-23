import { Movimiento } from '../../../types/movimiento';
import { obtenerFechaKey } from './fechas';

export function actualizarValidacionMovimiento(
  movimiento: Movimiento,
  fechaPrevista: Date,
  fechaReal: Date,
  validado: boolean
): Movimiento {
  const fechaKey = obtenerFechaKey(fechaPrevista);
  const validacionesActuales = movimiento.validaciones || {};

  // Si estamos desvalidando, la fecha real vuelve a ser la fecha prevista
  const fechaFinal = validado ? fechaReal : fechaPrevista;

  return {
    ...movimiento,
    validaciones: {
      ...validacionesActuales,
      [fechaKey]: {
        fecha: fechaFinal,
        validado
      }
    }
  };
}
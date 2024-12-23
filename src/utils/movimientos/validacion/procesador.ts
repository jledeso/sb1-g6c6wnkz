import { Movimiento } from '../../../types/movimiento';
import { MovimientoProcesado } from '../tipos';
import { obtenerValidacionMovimiento } from './validaciones';

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
    fecha: validacion?.fechaReal || fechaPrevista
  };
}
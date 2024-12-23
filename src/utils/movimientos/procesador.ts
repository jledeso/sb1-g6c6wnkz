import { Movimiento } from '../../types/movimiento';
import { generarMovimientosMensuales } from './generador';

export function procesarMovimientosPeriodo(
  movimientos: Movimiento[],
  fechaInicio: Date,
  fechaFin: Date
): Movimiento[] {
  return movimientos.flatMap(movimiento => 
    generarMovimientosMensuales(movimiento, fechaInicio, fechaFin)
  );
}

export function calcularSaldoAcumulado(
  movimientos: Movimiento[],
  fechaInicio: Date,
  fechaFin: Date
): { fecha: Date; saldo: number }[] {
  const movimientosProcesados = procesarMovimientosPeriodo(movimientos, fechaInicio, fechaFin)
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

  let saldoAcumulado = 0;
  return movimientosProcesados.map(mov => {
    saldoAcumulado += mov.tipo === 'ingreso' ? mov.importe : -mov.importe;
    return {
      fecha: mov.fecha,
      saldo: saldoAcumulado
    };
  });
}
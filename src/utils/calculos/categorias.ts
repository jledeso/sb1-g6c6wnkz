import { Movimiento } from '../../types/movimiento';
import { generarMovimientosPeriodicos } from '../movimientos/movimientosPeriodicos';

export const calcularGastosPorCategoria = (
  movimientos: Movimiento[],
  categoria: string,
  fechaInicio: Date,
  fechaFin: Date
): number => {
  const todosLosMovimientos = movimientos.flatMap(mov =>
    generarMovimientosPeriodicos(mov, fechaInicio, fechaFin)
  );

  return todosLosMovimientos
    .filter(m => 
      m.categoria === categoria && 
      m.tipo === 'gasto' &&
      m.fecha >= fechaInicio &&
      m.fecha <= fechaFin
    )
    .reduce((total, m) => total + m.importe, 0);
};

export const calcularBalancePeriodo = (
  movimientos: Movimiento[],
  fechaInicio: Date,
  fechaFin: Date
): number => {
  const todosLosMovimientos = movimientos.flatMap(mov =>
    generarMovimientosPeriodicos(mov, fechaInicio, fechaFin)
  );

  return todosLosMovimientos
    .filter(m => m.fecha >= fechaInicio && m.fecha <= fechaFin)
    .reduce((total, m) => {
      if (m.tipo === 'transferencia') return total;
      return total + (m.tipo === 'ingreso' ? m.importe : -m.importe);
    }, 0);
};
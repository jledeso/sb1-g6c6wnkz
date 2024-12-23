import { Movimiento } from '../types/movimiento';
import { Cuenta } from '../types/cuenta';

export const calcularSaldoTotal = (cuentas: Cuenta[]): number => {
  return cuentas.reduce((total, cuenta) => total + cuenta.saldo, 0);
};

export const calcularSaldoActual = (
  cuenta: Cuenta,
  movimientos: Movimiento[]
): number => {
  const movimientosCuenta = movimientos.filter(
    m => m.cuentaId === cuenta.id || m.cuentaDestinoId === cuenta.id
  );

  return movimientosCuenta.reduce((saldo, mov) => {
    if (mov.cuentaId === cuenta.id) {
      return saldo + (mov.tipo === 'ingreso' ? mov.importe : -mov.importe);
    } else {
      // Es una transferencia recibida
      return saldo + mov.importe;
    }
  }, cuenta.saldoInicial || 0);
};

export const calcularGastosPorCategoria = (
  movimientos: Movimiento[],
  categoria: string
): number => {
  return movimientos
    .filter(m => m.categoria === categoria && m.tipo === 'gasto')
    .reduce((total, m) => total + m.importe, 0);
};

export const calcularBalancePeriodo = (
  movimientos: Movimiento[],
  fechaInicio: Date,
  fechaFin: Date
): number => {
  return movimientos
    .filter(m => m.fecha >= fechaInicio && m.fecha <= fechaFin)
    .reduce((total, m) => {
      if (m.tipo === 'transferencia') return total;
      return total + (m.tipo === 'ingreso' ? m.importe : -m.importe);
    }, 0);
};
import { Cuenta } from '../../types/cuenta';
import { Movimiento } from '../../types/movimiento';
import { generarMovimientosPeriodicos } from '../movimientos/movimientosPeriodicos';

export const calcularSaldoTotal = (
  cuentas: Cuenta[],
  fecha: Date = new Date()
): number => {
  return cuentas.reduce((total, cuenta) => {
    const saldoActual = calcularSaldoActual(cuenta, [], fecha);
    return total + saldoActual;
  }, 0);
};

export const calcularSaldoActual = (
  cuenta: Cuenta,
  movimientos: Movimiento[],
  fecha: Date = new Date()
): number => {
  // Filtrar movimientos de la cuenta
  const movimientosCuenta = movimientos.filter(
    m => m.cuentaId === cuenta.id || m.cuentaDestinoId === cuenta.id
  );

  // Expandir movimientos periódicos
  const todosLosMovimientos = movimientosCuenta.flatMap(mov => 
    generarMovimientosPeriodicos(mov, cuenta.fechaSaldoInicial, fecha)
  );

  // Filtrar por fecha y calcular saldo
  const saldoMovimientos = todosLosMovimientos
    .filter(m => m.fecha <= fecha)
    .reduce((saldo, mov) => {
      if (mov.cuentaId === cuenta.id) {
        return saldo + (mov.tipo === 'ingreso' ? mov.importe : -mov.importe);
      } else {
        // Es una transferencia recibida
        return saldo + mov.importe;
      }
    }, 0);

  return cuenta.saldoInicial + saldoMovimientos;
};
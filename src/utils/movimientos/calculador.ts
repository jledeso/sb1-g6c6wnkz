import { Movimiento } from '../../types/movimiento';
import { MovimientoValidado } from './tipos';
import { generarMovimientosPeriodicos } from './movimientosPeriodicos';
import { procesarMovimientoConValidacion } from './validacion';

function procesarMovimientos(
  movimientos: Movimiento[],
  fechaInicio: Date,
  fechaFin: Date
): MovimientoValidado[] {
  return movimientos
    .flatMap(mov => generarMovimientosPeriodicos(mov, fechaInicio, fechaFin))
    .map(mov => procesarMovimientoConValidacion(mov, mov.fecha));
}

function filtrarMovimientosPorFecha(
  movimientos: MovimientoValidado[],
  fechaInicio: Date,
  fechaFin: Date,
  soloValidados: boolean
): MovimientoValidado[] {
  return movimientos.filter(mov => {
    // Usar la fecha real si el movimiento está validado
    const fechaEfectiva = mov.validado ? mov.fechaReal : mov.fechaPrevista;
    const cumpleFecha = fechaEfectiva >= fechaInicio && fechaEfectiva <= fechaFin;
    return cumpleFecha && (!soloValidados || mov.validado);
  });
}

export function obtenerMovimientosEfectivos(
  movimientos: Movimiento[],
  fechaInicio: Date,
  fechaFin: Date,
  soloValidados: boolean = false
): MovimientoValidado[] {
  const movimientosProcesados = procesarMovimientos(movimientos, fechaInicio, fechaFin);
  return filtrarMovimientosPorFecha(movimientosProcesados, fechaInicio, fechaFin, soloValidados)
    .sort((a, b) => {
      const fechaA = a.validado ? a.fechaReal : a.fechaPrevista;
      const fechaB = b.validado ? b.fechaReal : b.fechaPrevista;
      return fechaA.getTime() - fechaB.getTime();
    });
}

export function calcularSaldoPorCuenta(
  movimientos: Movimiento[],
  cuentaId: string,
  fechaInicio: Date,
  fechaFin: Date,
  soloValidados: boolean = false
): number {
  const movimientosFiltrados = obtenerMovimientosEfectivos(
    movimientos.filter(m => m.cuentaId === cuentaId || m.cuentaDestinoId === cuentaId),
    fechaInicio,
    fechaFin,
    soloValidados
  );

  return movimientosFiltrados.reduce((saldo, mov) => {
    if (mov.cuentaId === cuentaId) {
      return saldo + (mov.tipo === 'ingreso' ? mov.importe : -mov.importe);
    } else if (mov.cuentaDestinoId === cuentaId) {
      return saldo + mov.importe;
    }
    return saldo;
  }, 0);
}

export function calcularSaldoAcumulado(
  movimientos: Movimiento[],
  cuentaId: string,
  fechaInicio: Date,
  fechaFin: Date,
  soloValidados: boolean = false
): { fecha: Date; saldo: number }[] {
  const movimientosFiltrados = obtenerMovimientosEfectivos(
    movimientos.filter(m => m.cuentaId === cuentaId || m.cuentaDestinoId === cuentaId),
    fechaInicio,
    fechaFin,
    soloValidados
  );

  let saldoAcumulado = 0;
  return movimientosFiltrados.map(mov => {
    if (mov.cuentaId === cuentaId) {
      saldoAcumulado += mov.tipo === 'ingreso' ? mov.importe : -mov.importe;
    } else if (mov.cuentaDestinoId === cuentaId) {
      saldoAcumulado += mov.importe;
    }
    return {
      fecha: mov.validado ? mov.fechaReal : mov.fechaPrevista,
      saldo: saldoAcumulado
    };
  });
}
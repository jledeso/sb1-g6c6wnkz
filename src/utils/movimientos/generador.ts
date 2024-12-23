import { Movimiento } from '../../types/movimiento';
import { MovimientoProcesado, PuntoEvolucion } from './tipos';
import { procesarMovimientoConValidacion } from './validacion';
import { 
  eachDayOfInterval,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter
} from 'date-fns';

export function generarMovimientosPeriodicos(
  movimiento: Movimiento,
  fechaInicio: Date,
  fechaFin: Date
): MovimientoProcesado[] {
  if (!movimiento.esPeriodico || !movimiento.configuracionPeriodicidad) {
    return [procesarMovimientoConValidacion(movimiento, movimiento.fecha)];
  }

  const fechaInicioMov = startOfDay(new Date(movimiento.fechaInicio || movimiento.fecha));
  const fechaFinMov = movimiento.fechaFin ? startOfDay(new Date(movimiento.fechaFin)) : undefined;

  const dias = eachDayOfInterval({ 
    start: startOfDay(fechaInicio), 
    end: endOfDay(fechaFin) 
  });

  const fechasEjecucion = dias.filter(dia => {
    const diaDelMes = movimiento.configuracionPeriodicidad!.diaEjecucion;
    return dia.getDate() === diaDelMes && 
           !isBefore(dia, fechaInicioMov) &&
           (!fechaFinMov || !isAfter(dia, fechaFinMov));
  });

  return fechasEjecucion.map(fechaPrevista => {
    const movimientoProcesado = procesarMovimientoConValidacion(movimiento, fechaPrevista);
    return {
      ...movimientoProcesado,
      id: `${movimiento.id}_${fechaPrevista.getTime()}`
    };
  });
}

export function generarPuntosEvolucion(
  movimientos: Movimiento[],
  fechaInicio: Date,
  fechaFin: Date,
  saldoInicial: number
): PuntoEvolucion[] {
  const fechaInicioNorm = startOfDay(fechaInicio);
  const fechaFinNorm = endOfDay(fechaFin);

  const dias = eachDayOfInterval({ 
    start: fechaInicioNorm, 
    end: fechaFinNorm 
  });

  const todosLosMovimientos = movimientos.flatMap(mov => 
    generarMovimientosPeriodicos(mov, fechaInicio, fechaFin)
  );

  // Ordenar por fecha efectiva (real si está validado, prevista si no)
  todosLosMovimientos.sort((a, b) => {
    const fechaA = a.validado ? a.fechaReal : a.fechaPrevista;
    const fechaB = b.validado ? b.fechaReal : b.fechaPrevista;
    return fechaA.getTime() - fechaB.getTime();
  });

  let saldoActual = saldoInicial;
  return dias.map(fecha => {
    const movimientosDelDia = todosLosMovimientos.filter(m => {
      const fechaEfectiva = m.validado ? m.fechaReal : m.fechaPrevista;
      return startOfDay(fechaEfectiva).getTime() === fecha.getTime();
    });

    movimientosDelDia.forEach(mov => {
      if (mov.tipo === 'transferencia') {
        if (mov.cuentaId === mov.cuentaDestinoId) {
          saldoActual += mov.importe;
        } else {
          saldoActual -= mov.importe;
        }
      } else {
        saldoActual += mov.tipo === 'ingreso' ? mov.importe : -mov.importe;
      }
    });

    return {
      fecha,
      saldo: saldoActual
    };
  });
}
import { Movimiento } from '../../types/movimiento';
import { 
  addDays, 
  addMonths, 
  addYears, 
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  isBefore,
  isAfter,
  setDate,
  getDate,
  setMonth,
  getMonth,
  startOfDay,
  endOfDay
} from 'date-fns';

export function generarMovimientosPeriodicos(
  movimiento: Movimiento,
  fechaInicio: Date,
  fechaFin: Date
): Movimiento[] {
  if (!movimiento.esPeriodico || !movimiento.configuracionPeriodicidad) {
    return [movimiento];
  }

  const fechaInicioMovimiento = new Date(movimiento.fechaInicio || movimiento.fecha);
  const fechaFinMovimiento = movimiento.fechaFin ? new Date(movimiento.fechaFin) : undefined;

  // Normalizar fechas para evitar problemas con las horas
  const fechaInicioNorm = startOfDay(fechaInicio);
  const fechaFinNorm = endOfDay(fechaFin);
  const fechaInicioMovNorm = startOfDay(fechaInicioMovimiento);
  const fechaFinMovNorm = fechaFinMovimiento ? endOfDay(fechaFinMovimiento) : undefined;

  // Ajustar fechas de inicio y fin según el rango solicitado
  const fechaInicioCalculo = isAfter(fechaInicioNorm, fechaInicioMovNorm) 
    ? fechaInicioNorm 
    : fechaInicioMovNorm;

  const fechaFinCalculo = fechaFinMovNorm && isBefore(fechaFinMovNorm, fechaFinNorm)
    ? fechaFinMovNorm
    : fechaFinNorm;

  const fechasEjecucion = obtenerFechasEjecucion(
    movimiento.periodicidad!,
    movimiento.configuracionPeriodicidad,
    fechaInicioCalculo,
    fechaFinCalculo
  );

  return fechasEjecucion.map(fecha => ({
    ...movimiento,
    fecha,
    id: `${movimiento.id}_${fecha.getTime()}` // ID único para cada instancia
  }));
}

function obtenerFechasEjecucion(
  periodicidad: string,
  config: { diaEjecucion: number; mesEjecucion?: number },
  fechaInicio: Date,
  fechaFin: Date
): Date[] {
  switch (periodicidad) {
    case 'diario':
      return eachDayOfInterval({ start: fechaInicio, end: fechaFin });

    case 'semanal': {
      const fechas: Date[] = [];
      let fechaActual = fechaInicio;
      while (isBefore(fechaActual, fechaFin)) {
        if (getDate(fechaActual) % 7 === config.diaEjecucion % 7) {
          fechas.push(fechaActual);
        }
        fechaActual = addDays(fechaActual, 1);
      }
      return fechas;
    }

    case 'mensual': {
      return eachMonthOfInterval({ start: fechaInicio, end: fechaFin })
        .map(fecha => {
          const fechaEjecucion = setDate(fecha, config.diaEjecucion);
          if (isBefore(fechaEjecucion, fechaInicio) || isAfter(fechaEjecucion, fechaFin)) {
            return null;
          }
          return fechaEjecucion;
        })
        .filter((fecha): fecha is Date => fecha !== null);
    }

    case 'anual': {
      return eachYearOfInterval({ start: fechaInicio, end: fechaFin })
        .map(fecha => {
          const fechaEjecucion = setDate(
            setMonth(fecha, (config.mesEjecucion || 1) - 1),
            config.diaEjecucion
          );
          if (isBefore(fechaEjecucion, fechaInicio) || isAfter(fechaEjecucion, fechaFin)) {
            return null;
          }
          return fechaEjecucion;
        })
        .filter((fecha): fecha is Date => fecha !== null);
    }

    default:
      return [fechaInicio];
  }
}
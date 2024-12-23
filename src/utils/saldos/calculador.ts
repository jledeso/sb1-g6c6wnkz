import { Cuenta, SaldoReal } from '../../types/cuenta';
import { startOfDay, isAfter, isBefore, isEqual } from 'date-fns';

export function obtenerSaldoRealEnFecha(cuenta: Cuenta, fecha: Date): number | null {
  if (!cuenta.saldosReales?.length) return null;

  const fechaNormalizada = startOfDay(fecha);
  
  // Ordenar saldos reales por fecha, del más reciente al más antiguo
  const saldosOrdenados = [...cuenta.saldosReales].sort((a, b) => 
    b.fecha.getTime() - a.fecha.getTime()
  );

  // Buscar el saldo real más cercano anterior o igual a la fecha
  const saldoReal = saldosOrdenados.find(s => 
    isBefore(startOfDay(s.fecha), fechaNormalizada) || 
    isEqual(startOfDay(s.fecha), fechaNormalizada)
  );

  return saldoReal?.saldo ?? null;
}

export function validarSaldoReal(
  cuenta: Cuenta,
  fecha: Date,
  saldo: number
): { esValido: boolean; mensaje?: string } {
  const fechaNormalizada = startOfDay(fecha);

  // No permitir fechas futuras
  if (isAfter(fechaNormalizada, startOfDay(new Date()))) {
    return {
      esValido: false,
      mensaje: 'No se pueden registrar saldos reales con fechas futuras'
    };
  }

  // No permitir fechas anteriores a la fecha de saldo inicial
  if (isBefore(fechaNormalizada, startOfDay(cuenta.fechaSaldoInicial))) {
    return {
      esValido: false,
      mensaje: 'No se pueden registrar saldos reales anteriores a la fecha de saldo inicial'
    };
  }

  return { esValido: true };
}
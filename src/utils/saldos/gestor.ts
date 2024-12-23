import { Cuenta, SaldoReal } from '../../types/cuenta';
import { startOfDay, isEqual } from 'date-fns';
import { validarSaldoReal } from './calculador';

export function agregarSaldoReal(
  cuenta: Cuenta,
  saldoReal: Omit<SaldoReal, 'id'>
): Cuenta {
  const validacion = validarSaldoReal(cuenta, saldoReal.fecha, saldoReal.saldo);
  if (!validacion.esValido) {
    throw new Error(validacion.mensaje);
  }

  const nuevoSaldoReal: SaldoReal = {
    ...saldoReal,
    id: crypto.randomUUID(),
    fecha: startOfDay(saldoReal.fecha)
  };

  return {
    ...cuenta,
    saldosReales: [
      ...(cuenta.saldosReales || []),
      nuevoSaldoReal
    ].sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
  };
}

export function actualizarSaldoReal(
  cuenta: Cuenta,
  id: string,
  saldoReal: Omit<SaldoReal, 'id'>
): Cuenta {
  const validacion = validarSaldoReal(cuenta, saldoReal.fecha, saldoReal.saldo);
  if (!validacion.esValido) {
    throw new Error(validacion.mensaje);
  }

  return {
    ...cuenta,
    saldosReales: cuenta.saldosReales.map(sr => 
      sr.id === id 
        ? { ...saldoReal, id, fecha: startOfDay(saldoReal.fecha) }
        : sr
    ).sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
  };
}

export function eliminarSaldoReal(cuenta: Cuenta, id: string): Cuenta {
  return {
    ...cuenta,
    saldosReales: cuenta.saldosReales.filter(sr => sr.id !== id)
  };
}
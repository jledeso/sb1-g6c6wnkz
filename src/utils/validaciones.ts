import { Cuenta } from '../types/cuenta';
import { Movimiento } from '../types/movimiento';

export const validarSaldoSuficiente = (cuenta: Cuenta, importe: number): boolean => {
  if (cuenta.tipo === 'credito') {
    return cuenta.saldo + (cuenta.limiteCredito || 0) >= importe;
  }
  return cuenta.saldo >= importe;
};

export const validarFechaMovimiento = (movimiento: Movimiento): boolean => {
  const fechaActual = new Date();
  return !movimiento.esPeriodico || 
    (!!movimiento.fechaInicio && movimiento.fechaInicio <= fechaActual);
};

export const validarImportePositivo = (importe: number): boolean => {
  return importe > 0;
};

export const validarCamposObligatorios = (objeto: Record<string, any>, campos: string[]): boolean => {
  return campos.every(campo => {
    const valor = objeto[campo];
    return valor !== undefined && valor !== null && valor !== '';
  });
};
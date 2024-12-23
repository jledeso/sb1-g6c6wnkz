import { TipoCuenta } from '../types/cuenta';

export const traducirTipoCuenta = (tipo: TipoCuenta): string => {
  const traducciones: Record<TipoCuenta, string> = {
    corriente: 'Cuenta Corriente',
    monedero: 'Monedero',
    credito: 'Tarjeta de Crédito',
    debito: 'Tarjeta de Débito'
  };
  return traducciones[tipo];
};
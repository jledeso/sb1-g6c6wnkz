const FORMATO_MONEDA = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

export const formatearMoneda = (cantidad: number): string => {
  return FORMATO_MONEDA.format(cantidad);
};

export const formatearPorcentaje = (valor: number): string => {
  return `${(valor * 100).toFixed(1)}%`;
};

export const formatearNumero = (numero: number): string => {
  return new Intl.NumberFormat('es-ES').format(numero);
};

export const formatearConcepto = (concepto: string): string => {
  return concepto.charAt(0).toUpperCase() + concepto.slice(1).toLowerCase();
};
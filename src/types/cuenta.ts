export type TipoCuenta = 'corriente' | 'monedero' | 'credito' | 'debito';
export type TipoLiquidacion = 'total' | 'parcial';

export interface SaldoReal {
  id: string;
  fecha: Date;
  saldo: number;
  notas?: string;
}

export interface ConfiguracionCredito {
  cuentaLiquidacionId: string;
  diaInicioCiclo: number;
  diaLiquidacion: number;
  tipoLiquidacion: TipoLiquidacion;
  importeLiquidacionParcial?: number;
}

export interface Cuenta {
  id: string;
  nombre: string;
  tipo: TipoCuenta;
  saldoInicial: number;
  fechaSaldoInicial: Date;
  saldo: number;
  limiteCredito?: number;
  configuracionCredito?: ConfiguracionCredito;
  saldosReales: SaldoReal[];
}
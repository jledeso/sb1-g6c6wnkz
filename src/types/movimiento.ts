export type TipoPeriodicidad = 'diario' | 'semanal' | 'mensual' | 'anual';
export type TipoMovimiento = 'ingreso' | 'gasto' | 'transferencia';

export interface ConfiguracionPeriodicidad {
  diaEjecucion: number;
  mesEjecucion?: number; // 1-12 para periodicidad anual
}

export interface MovimientoValidado {
  fecha: Date;
  validado: boolean;
}

export interface Movimiento {
  id: string;
  cuentaId: string;
  cuentaDestinoId?: string;
  fecha: Date;
  importe: number;
  concepto: string;
  categoria: string;
  tipo: TipoMovimiento;
  esPeriodico: boolean;
  periodicidad?: TipoPeriodicidad;
  configuracionPeriodicidad?: ConfiguracionPeriodicidad;
  fechaInicio?: Date;
  fechaFin?: Date;
  validaciones?: Record<string, MovimientoValidado>; // key: fecha en ISO string
}
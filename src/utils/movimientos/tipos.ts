import { Cuenta } from '../../types/cuenta';

export interface PuntoEvolucion {
  fecha: Date;
  saldo: number;
}

export interface EvolucionCuenta {
  cuenta: Cuenta;
  evolucion: PuntoEvolucion[];
  saldosReales: PuntoEvolucion[];
}

export interface DatoGrafico {
  fecha: string;
  timestamp: number;
  [key: string]: any;
}

export interface MovimientoProcesado extends Omit<Cuenta, 'saldosReales'> {
  fechaPrevista: Date;
  fechaReal: Date;
  validado: boolean;
}
import { Cuenta } from '../../types/cuenta';
import { Categoria } from '../../types/categoria';
import { Movimiento } from '../../types/movimiento';
import { formatearFechaCorta } from '../fecha';

interface ExportData {
  cuentas: Cuenta[];
  categorias: Categoria[];
  movimientos: Movimiento[];
}

export function exportarDatosACsv(data: ExportData): string {
  const secciones = [
    exportarSeccionCuentas(data.cuentas),
    exportarSeccionCategorias(data.categorias),
    exportarSeccionMovimientos(data.movimientos)
  ];

  return secciones.join('\n\n');
}

function exportarSeccionCuentas(cuentas: Cuenta[]): string {
  const header = '[CUENTAS]';
  const headers = [
    'id',
    'nombre',
    'tipo',
    'saldoInicial',
    'fechaSaldoInicial',
    'saldo',
    'limiteCredito',
    'configuracionCredito'
  ].join(',');
  
  const rows = cuentas.map(cuenta => {
    return [
      cuenta.id,
      `"${cuenta.nombre}"`,
      cuenta.tipo,
      cuenta.saldoInicial,
      formatearFechaCorta(cuenta.fechaSaldoInicial),
      cuenta.saldo,
      cuenta.limiteCredito || '',
      cuenta.configuracionCredito ? JSON.stringify(cuenta.configuracionCredito) : ''
    ].join(',');
  });

  // Añadir sección de saldos reales
  const saldosRealesHeader = '[SALDOS_REALES]';
  const saldosRealesHeaders = ['cuentaId', 'fecha', 'saldo', 'notas', 'id'].join(',');
  
  const saldosRealesRows = cuentas.flatMap(cuenta => 
    cuenta.saldosReales.map(saldoReal => [
      cuenta.id,
      formatearFechaCorta(saldoReal.fecha),
      saldoReal.saldo,
      `"${saldoReal.notas || ''}"`,
      saldoReal.id
    ].join(','))
  );

  return [
    header, 
    headers, 
    ...rows, 
    '', // Línea en blanco para separar secciones
    saldosRealesHeader,
    saldosRealesHeaders,
    ...saldosRealesRows
  ].join('\n');
}

function exportarSeccionCategorias(categorias: Categoria[]): string {
  const header = '[CATEGORIAS]';
  const headers = ['id', 'nombre', 'tipo', 'color'].join(',');
  
  const rows = categorias.map(categoria => {
    return [
      categoria.id,
      `"${categoria.nombre}"`,
      categoria.tipo,
      categoria.color
    ].join(',');
  });

  return [header, headers, ...rows].join('\n');
}

function exportarSeccionMovimientos(movimientos: Movimiento[]): string {
  const header = '[MOVIMIENTOS]';
  const headers = [
    'id',
    'cuentaId',
    'cuentaDestinoId',
    'fecha',
    'importe',
    'concepto',
    'categoria',
    'tipo',
    'esPeriodico',
    'periodicidad',
    'configuracionPeriodicidad',
    'fechaInicio',
    'fechaFin',
    'validaciones'
  ].join(',');
  
  const rows = movimientos.map(mov => {
    return [
      mov.id,
      mov.cuentaId,
      mov.cuentaDestinoId || '',
      formatearFechaCorta(mov.fecha),
      mov.importe,
      `"${mov.concepto}"`,
      mov.categoria,
      mov.tipo,
      mov.esPeriodico,
      mov.periodicidad || '',
      mov.configuracionPeriodicidad ? btoa(JSON.stringify(mov.configuracionPeriodicidad)) : '',
      mov.fechaInicio ? formatearFechaCorta(mov.fechaInicio) : '',
      mov.fechaFin ? formatearFechaCorta(mov.fechaFin) : '',
      mov.validaciones ? btoa(JSON.stringify(mov.validaciones)) : ''
    ].join(',');
  });

  return [header, headers, ...rows].join('\n');
}

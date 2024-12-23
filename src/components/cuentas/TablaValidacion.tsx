import React from 'react';
import { Check, X } from 'lucide-react';
import { MovimientoProcesado } from '../../utils/movimientos/tipos';
import { formatearMoneda } from '../../utils/formato';
import { formatearFecha, formatearFechaInput } from '../../utils/fecha';

interface TablaValidacionProps {
  movimientos: MovimientoProcesado[];
  fechasReales: Record<string, string>;
  onValidar: (movimientoId: string, fechaPrevista: Date) => void;
  onCambiarFechaReal: (movimientoId: string, fechaPrevista: Date, nuevaFecha: string) => void;
}

export function TablaValidacion({
  movimientos,
  fechasReales,
  onValidar,
  onCambiarFechaReal
}: TablaValidacionProps) {
  const getFechaRealValue = (movimiento: MovimientoProcesado) => {
    const key = `${movimiento.id}_${movimiento.fechaPrevista.toISOString()}`;
    
    if (fechasReales[key]) {
      return fechasReales[key];
    }
    
    if (movimiento.validado && movimiento.fechaReal) {
      return formatearFechaInput(movimiento.fechaReal);
    }
    
    return formatearFechaInput(movimiento.fechaPrevista);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Prevista
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Real
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Concepto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Importe
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Validar
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {movimientos.map((movimiento) => {
            const key = `${movimiento.id}_${movimiento.fechaPrevista.toISOString()}`;
            const fechaRealValue = getFechaRealValue(movimiento);
            
            return (
              <tr key={key} className={movimiento.validado ? 'bg-green-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatearFecha(movimiento.fechaPrevista)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="date"
                    value={fechaRealValue}
                    onChange={(e) => onCambiarFechaReal(
                      movimiento.id,
                      movimiento.fechaPrevista,
                      e.target.value
                    )}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {movimiento.concepto}
                  {movimiento.esPeriodico && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Periódico
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {movimiento.tipo}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right ${
                  movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatearMoneda(movimiento.importe)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onValidar(movimiento.id, movimiento.fechaPrevista)}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                      movimiento.validado 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={movimiento.validado ? 'Desvalidar movimiento' : 'Validar movimiento'}
                  >
                    {movimiento.validado ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
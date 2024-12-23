import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { SaldoReal } from '../../../types/cuenta';
import { formatearFecha } from '../../../utils/fecha';
import { formatearMoneda } from '../../../utils/formato';

interface ListaSaldosRealesProps {
  saldosReales: SaldoReal[];
  onEditar: (saldoReal: SaldoReal) => void;
  onEliminar: (id: string) => void;
}

export function ListaSaldosReales({ 
  saldosReales, 
  onEditar, 
  onEliminar 
}: ListaSaldosRealesProps) {
  const saldosOrdenados = [...saldosReales].sort((a, b) => 
    b.fecha.getTime() - a.fecha.getTime()
  );

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Saldos Reales</h3>
      
      {saldosOrdenados.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No hay saldos reales registrados
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {saldosOrdenados.map((saldoReal) => (
                <tr key={saldoReal.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatearFecha(saldoReal.fecha)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatearMoneda(saldoReal.saldo)}
                  </td>
                  <td className="px-6 py-4">
                    {saldoReal.notas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEditar(saldoReal)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onEliminar(saldoReal.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { Modal } from '../common/Modal';
import { Calendar } from 'lucide-react';
import { Movimiento } from '../../types/movimiento';
import { useMovimientosStore } from '../../store/useMovimientosStore';
import { obtenerMovimientosEfectivos } from '../../utils/movimientos/calculador';
import { formatearMoneda } from '../../utils/formato';
import { formatearFecha } from '../../utils/fecha';

interface MovimientosPrevistosProps {
  cuentaId: string;
  nombreCuenta: string;
  fechaSaldoInicial: Date;
  onClose: () => void;
}

export function MovimientosPrevistos({ 
  cuentaId, 
  nombreCuenta,
  fechaSaldoInicial,
  onClose 
}: MovimientosPrevistosProps) {
  const [fechaHasta, setFechaHasta] = React.useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const { movimientos } = useMovimientosStore();

  const movimientosPrevistos = React.useMemo(() => {
    const fechaFin = new Date(fechaHasta);
    return obtenerMovimientosEfectivos(
      movimientos.filter(m => m.cuentaId === cuentaId || m.cuentaDestinoId === cuentaId),
      fechaSaldoInicial,
      fechaFin
    ).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [movimientos, cuentaId, fechaSaldoInicial, fechaHasta]);

  const calcularSaldoAcumulado = (movimientos: Movimiento[]): (number | null)[] => {
    let saldo = 0;
    return movimientos.map(mov => {
      if (mov.cuentaId === cuentaId) {
        saldo += mov.tipo === 'ingreso' ? mov.importe : -mov.importe;
      } else if (mov.cuentaDestinoId === cuentaId) {
        saldo += mov.importe; // Transferencia recibida
      }
      return saldo;
    });
  };

  const saldosAcumulados = calcularSaldoAcumulado(movimientosPrevistos);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Movimientos previstos - ${nombreCuenta}`}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movimientosPrevistos.map((movimiento, index) => (
                <tr key={movimiento.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatearFecha(movimiento.fecha)}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    {formatearMoneda(saldosAcumulados[index] || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
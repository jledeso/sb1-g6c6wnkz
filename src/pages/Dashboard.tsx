import React from 'react';
import { ResumenCuentas } from '../components/dashboard/ResumenCuentas';
import { ResumenCategorias } from '../components/dashboard/ResumenCategorias';
import { EvolucionSaldo } from '../components/dashboard/EvolucionSaldo';
import { ImportExportData } from '../components/common/ImportExportData';
import { Card } from '../components/common/Card';
import { useCuentasStore } from '../store/useCuentasStore';
import { useMovimientosStore } from '../store/useMovimientosStore';
import { calcularSaldoTotal } from '../utils/calculos';
import { formatearMoneda } from '../utils/formato';
import { startOfMonth, endOfMonth } from 'date-fns';

export function Dashboard() {
  const [fechaCalculo, setFechaCalculo] = React.useState(new Date());
  const [fechaInicio, setFechaInicio] = React.useState(startOfMonth(new Date()));
  const [fechaFin, setFechaFin] = React.useState(endOfMonth(new Date()));
  
  const { cuentas } = useCuentasStore();
  const { movimientos } = useMovimientosStore();

  const movimientosFiltrados = React.useMemo(() => {
    return movimientos.filter(m => new Date(m.fecha) <= fechaCalculo);
  }, [movimientos, fechaCalculo]);

  const saldoTotal = React.useMemo(() => {
    return calcularSaldoTotal(cuentas);
  }, [cuentas]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <ImportExportData />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h2 className="text-xl font-semibold mb-2">Balance Total</h2>
          <p className="text-3xl font-bold">{formatearMoneda(saldoTotal)}</p>
        </Card>

        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Fecha de cálculo</h2>
            <input
              type="date"
              value={fechaCalculo.toISOString().split('T')[0]}
              onChange={(e) => setFechaCalculo(new Date(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </Card>
      </div>

      <ResumenCuentas fechaCalculo={fechaCalculo} />

      <div className="space-y-4">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha inicio
              </label>
              <input
                type="date"
                value={fechaInicio.toISOString().split('T')[0]}
                onChange={(e) => setFechaInicio(new Date(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha fin
              </label>
              <input
                type="date"
                value={fechaFin.toISOString().split('T')[0]}
                onChange={(e) => setFechaFin(new Date(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResumenCategorias fechaInicio={fechaInicio} fechaFin={fechaFin} />
          <EvolucionSaldo fechaInicio={fechaInicio} fechaFin={fechaFin} />
        </div>
      </div>
    </div>
  );
}
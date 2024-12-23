import React from 'react';
import { useCategoriasStore } from '../../store/useCategoriasStore';
import { useCuentasStore } from '../../store/useCuentasStore';

interface FiltrosMovimientosProps {
  onFiltroChange: (filtros: FiltrosMovimientos) => void;
}

export interface FiltrosMovimientos {
  fechaInicio?: Date;
  fechaFin?: Date;
  categoria?: string;
  cuenta?: string;
  concepto?: string;
  tipo?: 'todos' | 'ingreso' | 'gasto' | 'transferencia';
}

export function FiltrosMovimientos({ onFiltroChange }: FiltrosMovimientosProps) {
  const { categorias } = useCategoriasStore();
  const { cuentas } = useCuentasStore();
  const [filtros, setFiltros] = React.useState<FiltrosMovimientos>({
    tipo: 'todos',
  });

  const handleFiltroChange = (campo: keyof FiltrosMovimientos, valor: any) => {
    const nuevosFiltros = { ...filtros, [campo]: valor };
    setFiltros(nuevosFiltros);
    onFiltroChange(nuevosFiltros);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha inicio
          </label>
          <input
            type="date"
            onChange={(e) => handleFiltroChange('fechaInicio', e.target.value ? new Date(e.target.value) : undefined)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha fin
          </label>
          <input
            type="date"
            onChange={(e) => handleFiltroChange('fechaFin', e.target.value ? new Date(e.target.value) : undefined)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            onChange={(e) => handleFiltroChange('categoria', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cuenta
          </label>
          <select
            onChange={(e) => handleFiltroChange('cuenta', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Todas las cuentas</option>
            {cuentas.map((cuenta) => (
              <option key={cuenta.id} value={cuenta.id}>
                {cuenta.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            value={filtros.tipo}
            onChange={(e) => handleFiltroChange('tipo', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="todos">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
            <option value="transferencia">Transferencias</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Concepto
          </label>
          <input
            type="text"
            onChange={(e) => handleFiltroChange('concepto', e.target.value)}
            placeholder="Buscar por concepto..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
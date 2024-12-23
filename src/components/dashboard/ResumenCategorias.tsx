import React from 'react';
import { useMovimientosStore } from '../../store/useMovimientosStore';
import { useCategoriasStore } from '../../store/useCategoriasStore';
import { obtenerMovimientosEfectivos } from '../../utils/movimientos/calculador';
import { formatearMoneda } from '../../utils/formato';
import { formatearFechaCorta } from '../../utils/fecha';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../common/Card';

interface ResumenCategoriasProps {
  fechaInicio: Date;
  fechaFin: Date;
}

export function ResumenCategorias({ fechaInicio, fechaFin }: ResumenCategoriasProps) {
  const { movimientos } = useMovimientosStore();
  const { categorias } = useCategoriasStore();

  const datosGrafico = React.useMemo(() => {
    const movimientosEfectivos = obtenerMovimientosEfectivos(
      movimientos,
      fechaInicio,
      fechaFin
    );

    const gastosPorCategoria = movimientosEfectivos
      .filter(m => m.tipo === 'gasto')
      .reduce((acc, mov) => {
        const categoria = categorias.find(c => c.id === mov.categoria);
        if (categoria) {
          acc[categoria.id] = (acc[categoria.id] || 0) + mov.importe;
        }
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(gastosPorCategoria).map(([categoriaId, total]) => {
      const categoria = categorias.find(c => c.id === categoriaId);
      return {
        name: categoria?.nombre || 'Sin categoría',
        value: total,
        color: categoria?.color || '#6B7280',
      };
    });
  }, [movimientos, categorias, fechaInicio, fechaFin]);

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Gastos por Categoría</h2>
          <span className="text-sm text-gray-500">
            {formatearFechaCorta(fechaInicio)} - {formatearFechaCorta(fechaFin)}
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosGrafico}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${formatearMoneda(value)}`}
              >
                {datosGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatearMoneda(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
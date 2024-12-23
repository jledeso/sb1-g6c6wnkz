import React from 'react';
import { useCuentasStore } from '../../store/useCuentasStore';
import { useMovimientosStore } from '../../store/useMovimientosStore';
import { formatearMoneda } from '../../utils/formato';
import { formatearFechaCorta } from '../../utils/fecha';
import { generarPuntosEvolucion } from '../../utils/movimientos/generador';
import { transformarDatosGrafico } from '../../utils/movimientos/transformador';
import { EvolucionCuenta } from '../../utils/movimientos/tipos';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter
} from 'recharts';
import { Card } from '../common/Card';

interface EvolucionSaldoProps {
  fechaInicio: Date;
  fechaFin: Date;
}

export function EvolucionSaldo({ fechaInicio, fechaFin }: EvolucionSaldoProps) {
  const { movimientos } = useMovimientosStore();
  const { cuentas } = useCuentasStore();

  const datosGrafico = React.useMemo(() => {
    // Generar evolución para cada cuenta
    const evolucionPorCuenta: EvolucionCuenta[] = cuentas.map(cuenta => {
      const movimientosCuenta = movimientos.filter(
        m => m.cuentaId === cuenta.id || m.cuentaDestinoId === cuenta.id
      );

      // Filtrar saldos reales dentro del rango de fechas
      const saldosRealesFiltrados = cuenta.saldosReales
        .filter(sr => {
          const fecha = new Date(sr.fecha);
          return fecha >= fechaInicio && fecha <= fechaFin;
        })
        .map(sr => ({
          fecha: new Date(sr.fecha),
          saldo: sr.saldo
        }));

      return {
        cuenta,
        evolucion: generarPuntosEvolucion(
          movimientosCuenta,
          fechaInicio,
          fechaFin,
          cuenta.saldoInicial
        ),
        saldosReales: saldosRealesFiltrados
      };
    });

    return transformarDatosGrafico(evolucionPorCuenta);
  }, [movimientos, cuentas, fechaInicio, fechaFin]);

  if (cuentas.length === 0) {
    return (
      <Card>
        <div className="text-center text-gray-500">
          No hay cuentas disponibles para mostrar la evolución del saldo
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Evolución del Saldo</h2>
          <span className="text-sm text-gray-500">
            {formatearFechaCorta(fechaInicio)} - {formatearFechaCorta(fechaFin)}
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="fecha"
                interval={Math.floor(Math.max(1, datosGrafico.length / 10))}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                tickFormatter={(value) => formatearMoneda(value)}
              />
              <Tooltip 
                formatter={(value) => formatearMoneda(Number(value))}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Legend />
              {cuentas.map((cuenta) => (
                <React.Fragment key={cuenta.id}>
                  <Line
                    type="stepAfter"
                    dataKey={`saldo_${cuenta.id}`}
                    name={`${cuenta.nombre} (Calculado)`}
                    stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                    dot={false}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                  <Scatter
                    dataKey={`saldoReal_${cuenta.id}`}
                    name={`${cuenta.nombre} (Real)`}
                    fill="#FF0000"
                    shape="star"
                    legendType="star"
                  />
                </React.Fragment>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
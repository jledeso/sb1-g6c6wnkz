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
  ReferenceLine
} from 'recharts';
import { Card } from '../common/Card';

interface EvolucionSaldoProps {
  fechaInicio: Date;
  fechaFin: Date;
}

export function EvolucionSaldo({ fechaInicio, fechaFin }: EvolucionSaldoProps) {
  const { movimientos } = useMovimientosStore();
  const { cuentas } = useCuentasStore();

  console.log('Fechas de la gráfica:', {
    fechaInicio: new Date(fechaInicio),
    fechaFin: new Date(fechaFin)
  });

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
          const enRango = fecha >= fechaInicio && fecha <= fechaFin;
          console.log('Filtrando saldo real:', {
            fecha,
            saldo: sr.saldo,
            fechaInicio,
            fechaFin,
            enRango,
            cuenta: cuenta.nombre
          });
          return enRango;
        })
        .map(sr => ({
          fecha: new Date(sr.fecha),
          saldo: sr.saldo
        }));

      console.log('Saldos reales filtrados para cuenta:', {
        cuenta: cuenta.nombre,
        saldos: saldosRealesFiltrados
      });

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
              {cuentas.map((cuenta) => {
                // Color para la línea de movimientos calculados
                const colorMovimientos = `#${Math.floor(Math.random()*16777215).toString(16)}`;
                // Color para la línea de saldos reales (usando un tono más oscuro)
                const colorSaldosReales = `#FF0000`;

                return (
                  <React.Fragment key={cuenta.id}>
                    {/* Línea de movimientos calculados */}
                    <Line
                      type="stepAfter"
                      dataKey={`saldo_${cuenta.id}`}
                      name={`${cuenta.nombre} (Calculado)`}
                      stroke={colorMovimientos}
                      dot={false}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                    {/* Línea de saldos reales */}
                    <Line
                      type="stepAfter"
                      dataKey={`saldoReal_${cuenta.id}`}
                      name={`${cuenta.nombre} (Real)`}
                      stroke={colorSaldosReales}
                      strokeWidth={2}
                      dot={(props: any) => {
                        const esSaldoRealIntroducido = props.payload[`esSaldoRealIntroducido_${cuenta.id}`];
                        if (!esSaldoRealIntroducido) return null;
                        
                        return (
                          <circle
                            key={`dot-${cuenta.id}-${props.payload.fecha}`}
                            cx={props.cx}
                            cy={props.cy}
                            r={6}
                            fill={colorSaldosReales}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        );
                      }}
                      activeDot={(props: any) => (
                        <circle
                          key={`activeDot-${cuenta.id}-${props.payload.fecha}`}
                          cx={props.cx}
                          cy={props.cy}
                          r={8}
                          fill={colorSaldosReales}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      )}
                      connectNulls={true}
                    />
                  </React.Fragment>
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
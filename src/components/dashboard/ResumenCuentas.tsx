import React from 'react';
import { useCuentasStore } from '../../store/useCuentasStore';
import { useMovimientosStore } from '../../store/useMovimientosStore';
import { calcularSaldoPorCuenta } from '../../utils/movimientos/calculador';
import { formatearMoneda } from '../../utils/formato';
import { formatearFechaCorta } from '../../utils/fecha';
import { Card } from '../common/Card';

interface ResumenCuentasProps {
  fechaCalculo: Date;
}

export function ResumenCuentas({ fechaCalculo }: ResumenCuentasProps) {
  const { cuentas } = useCuentasStore();
  const { movimientos } = useMovimientosStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Resumen de Cuentas</h2>
        <span className="text-sm text-gray-500">
          Saldos al {formatearFechaCorta(fechaCalculo)}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cuentas.map((cuenta) => {
          const saldoMovimientos = calcularSaldoPorCuenta(
            movimientos,
            cuenta.id,
            cuenta.fechaSaldoInicial,
            fechaCalculo,
            true // Solo movimientos validados
          );
          const saldoActual = cuenta.saldoInicial + saldoMovimientos;
          const variacion = saldoActual - cuenta.saldoInicial;
          
          return (
            <Card key={cuenta.id}>
              <h3 className="text-lg font-semibold mb-2">{cuenta.nombre}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Saldo inicial:</span>
                  <span>{formatearMoneda(cuenta.saldoInicial)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fecha saldo inicial:</span>
                  <span>{formatearFechaCorta(cuenta.fechaSaldoInicial)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saldo actual:</span>
                  <span className="font-semibold">{formatearMoneda(saldoActual)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Variación:</span>
                  <span className={variacion >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatearMoneda(variacion)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
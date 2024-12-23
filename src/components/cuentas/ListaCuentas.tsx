import React from 'react';
import { Pencil, Trash2, Calendar, CheckSquare, Scale } from 'lucide-react';
import { useCuentasStore } from '../../store/useCuentasStore';
import { useMovimientosStore } from '../../store/useMovimientosStore';
import { formatearMoneda } from '../../utils/formato';
import { formatearFecha } from '../../utils/fecha';
import { traducirTipoCuenta } from '../../utils/traducciones';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { MovimientosPrevistos } from './MovimientosPrevistos';
import { ValidacionMovimientos } from './ValidacionMovimientos';
import { GestionSaldosReales } from './saldos/GestionSaldosReales';

type SeccionExpandida = 'saldos' | 'validacion' | null;

interface SeccionCuenta {
  id: string;
  tipo: SeccionExpandida;
}

export function ListaCuentas() {
  const { cuentas } = useCuentasStore();
  const { movimientos } = useMovimientosStore();
  const [cuentaMovimientos, setCuentaMovimientos] = React.useState<string | null>(null);
  const [seccionExpandida, setSeccionExpandida] = React.useState<SeccionCuenta | null>(null);

  const toggleSeccion = (cuentaId: string, tipo: SeccionExpandida) => {
    if (seccionExpandida?.id === cuentaId && seccionExpandida?.tipo === tipo) {
      setSeccionExpandida(null);
    } else {
      setSeccionExpandida({ id: cuentaId, tipo });
    }
  };

  return (
    <div className="space-y-4">
      {cuentas.map((cuenta) => (
        <Card key={cuenta.id}>
          <div className="space-y-4">
            {/* Encabezado */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {cuenta.nombre}
                </h3>
                <p className="text-sm text-gray-500">
                  {traducirTipoCuenta(cuenta.tipo)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCuentaMovimientos(cuenta.id)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Ver movimientos previstos"
                >
                  <Calendar className="h-5 w-5" />
                </button>
                <button
                  onClick={() => toggleSeccion(cuenta.id, 'validacion')}
                  className={`${
                    seccionExpandida?.id === cuenta.id && seccionExpandida?.tipo === 'validacion'
                      ? 'text-green-800 bg-green-100'
                      : 'text-green-600 hover:text-green-900'
                  } p-1 rounded-lg transition-colors`}
                  title="Validar movimientos"
                >
                  <CheckSquare className="h-5 w-5" />
                </button>
                <button
                  onClick={() => toggleSeccion(cuenta.id, 'saldos')}
                  className={`${
                    seccionExpandida?.id === cuenta.id && seccionExpandida?.tipo === 'saldos'
                      ? 'text-purple-800 bg-purple-100'
                      : 'text-purple-600 hover:text-purple-900'
                  } p-1 rounded-lg transition-colors`}
                  title="Gestionar saldos reales"
                >
                  <Scale className="h-5 w-5" />
                </button>
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  title="Editar cuenta"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  title="Eliminar cuenta"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Información básica */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Saldo inicial</p>
                <p className="text-lg font-medium">{formatearMoneda(cuenta.saldoInicial)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Saldo actual</p>
                <p className="text-lg font-medium">{formatearMoneda(cuenta.saldo)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha saldo inicial</p>
                <p className="text-lg font-medium">{formatearFecha(cuenta.fechaSaldoInicial)}</p>
              </div>
              {cuenta.tipo === 'credito' && (
                <div>
                  <p className="text-sm text-gray-500">Límite de crédito</p>
                  <p className="text-lg font-medium">{formatearMoneda(cuenta.limiteCredito || 0)}</p>
                </div>
              )}
            </div>

            {/* Sección expandible */}
            {seccionExpandida?.id === cuenta.id && (
              <div className="mt-4 border-t pt-4">
                {seccionExpandida.tipo === 'saldos' && (
                  <GestionSaldosReales 
                    cuenta={cuenta} 
                    onClose={() => setSeccionExpandida(null)} 
                  />
                )}
                {seccionExpandida.tipo === 'validacion' && (
                  <ValidacionMovimientos
                    cuentaId={cuenta.id}
                    nombreCuenta={cuenta.nombre}
                    fechaSaldoInicial={cuenta.fechaSaldoInicial}
                  />
                )}
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Modal para movimientos previstos */}
      {cuentaMovimientos && (
        <Modal
          isOpen={true}
          onClose={() => setCuentaMovimientos(null)}
          title="Movimientos Previstos"
        >
          <MovimientosPrevistos
            cuentaId={cuentaMovimientos}
            nombreCuenta={cuentas.find(c => c.id === cuentaMovimientos)?.nombre || ''}
            fechaSaldoInicial={cuentas.find(c => c.id === cuentaMovimientos)?.fechaSaldoInicial || new Date()}
            onClose={() => setCuentaMovimientos(null)}
          />
        </Modal>
      )}
    </div>
  );
}
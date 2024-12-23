import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useMovimientosStore } from '../../store/useMovimientosStore';
import { useCuentasStore } from '../../store/useCuentasStore';
import { useCategoriasStore } from '../../store/useCategoriasStore';
import { formatearMoneda } from '../../utils/formato';
import { formatearFecha, esFechaValida } from '../../utils/fecha';
import { Modal } from '../common/Modal';
import { FormularioMovimiento } from './FormularioMovimiento';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { validarSaldoSuficiente } from '../../utils/validaciones';

export function ListaMovimientos() {
  const [movimientoEditar, setMovimientoEditar] = React.useState<string | null>(null);
  const { movimientos, eliminarMovimiento, actualizarMovimiento } = useMovimientosStore();
  const { cuentas, actualizarCuenta, obtenerCuenta } = useCuentasStore();
  const { categorias } = useCategoriasStore();
  const { mostrarNotificacion } = useNotificaciones();

  const obtenerNombreCuenta = (cuentaId: string) => {
    return cuentas.find(c => c.id === cuentaId)?.nombre || 'Cuenta desconocida';
  };

  const obtenerNombreCategoria = (categoriaId: string) => {
    return categorias.find(c => c.id === categoriaId)?.nombre || 'Sin categoría';
  };

  const renderizarFecha = (fecha: Date) => {
    if (!esFechaValida(fecha)) {
      return 'Fecha inválida';
    }
    return formatearFecha(fecha);
  };

  const handleEliminar = (movimiento: any) => {
    try {
      // Revertir el efecto del movimiento en la cuenta
      const cuenta = obtenerCuenta(movimiento.cuentaId);
      if (cuenta) {
        const ajusteSaldo = movimiento.tipo === 'ingreso' ? -movimiento.importe : movimiento.importe;
        actualizarCuenta(cuenta.id, { saldo: cuenta.saldo + ajusteSaldo });
      }

      // Si es una transferencia, también revertir en la cuenta destino
      if (movimiento.tipo === 'transferencia' && movimiento.cuentaDestinoId) {
        const cuentaDestino = obtenerCuenta(movimiento.cuentaDestinoId);
        if (cuentaDestino) {
          actualizarCuenta(cuentaDestino.id, { 
            saldo: cuentaDestino.saldo - movimiento.importe 
          });
        }
      }

      eliminarMovimiento(movimiento.id);
      mostrarNotificacion({
        mensaje: 'Movimiento eliminado correctamente',
        tipo: 'exito',
        duracion: 3000,
      });
    } catch (error) {
      mostrarNotificacion({
        mensaje: 'Error al eliminar el movimiento',
        tipo: 'error',
        duracion: 5000,
      });
    }
  };

  const handleEditar = (movimientoId: string) => {
    setMovimientoEditar(movimientoId);
  };

  const handleSubmitEdicion = (datosMovimiento: any) => {
    try {
      const movimientoOriginal = movimientos.find(m => m.id === movimientoEditar);
      if (!movimientoOriginal) return;

      // Revertir el movimiento original
      const cuentaOriginal = obtenerCuenta(movimientoOriginal.cuentaId);
      if (cuentaOriginal) {
        const ajusteSaldoOriginal = movimientoOriginal.tipo === 'ingreso' 
          ? -movimientoOriginal.importe 
          : movimientoOriginal.importe;
        actualizarCuenta(cuentaOriginal.id, { 
          saldo: cuentaOriginal.saldo + ajusteSaldoOriginal 
        });
      }

      // Aplicar el nuevo movimiento
      const cuentaNueva = obtenerCuenta(datosMovimiento.cuentaId);
      if (cuentaNueva) {
        const ajusteSaldoNuevo = datosMovimiento.tipo === 'ingreso' 
          ? datosMovimiento.importe 
          : -datosMovimiento.importe;

        if (datosMovimiento.tipo === 'gasto' && 
            !validarSaldoSuficiente(cuentaNueva, datosMovimiento.importe)) {
          throw new Error('Saldo insuficiente');
        }

        actualizarCuenta(cuentaNueva.id, { 
          saldo: cuentaNueva.saldo + ajusteSaldoNuevo 
        });
      }

      actualizarMovimiento(movimientoEditar, datosMovimiento);
      setMovimientoEditar(null);
      mostrarNotificacion({
        mensaje: 'Movimiento actualizado correctamente',
        tipo: 'exito',
        duracion: 3000,
      });
    } catch (error) {
      mostrarNotificacion({
        mensaje: error instanceof Error ? error.message : 'Error al actualizar el movimiento',
        tipo: 'error',
        duracion: 5000,
      });
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuenta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Concepto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Importe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movimientos.map((movimiento) => (
              <tr key={movimiento.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderizarFecha(movimiento.fecha)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {obtenerNombreCuenta(movimiento.cuentaId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {movimiento.concepto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {obtenerNombreCategoria(movimiento.categoria)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${
                  movimiento.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatearMoneda(movimiento.importe)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditar(movimiento.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEliminar(movimiento)}
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

      <Modal
        isOpen={!!movimientoEditar}
        onClose={() => setMovimientoEditar(null)}
        title="Editar Movimiento"
      >
        {movimientoEditar && (
          <FormularioMovimiento
            onSubmit={handleSubmitEdicion}
            datosIniciales={movimientos.find(m => m.id === movimientoEditar)}
          />
        )}
      </Modal>
    </>
  );
}
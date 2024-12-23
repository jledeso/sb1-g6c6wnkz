import React from 'react';
import { Cuenta } from '../../../types/cuenta';
import { FormularioSaldoReal } from './FormularioSaldoReal';
import { ListaSaldosReales } from './ListaSaldosReales';
import { useCuentasStore } from '../../../store/useCuentasStore';
import { useNotificaciones } from '../../../hooks/useNotificaciones';
import { agregarSaldoReal, actualizarSaldoReal, eliminarSaldoReal } from '../../../utils/saldos/gestor';

interface GestionSaldosRealesProps {
  cuenta: Cuenta;
  onClose: () => void;
}

export function GestionSaldosReales({ cuenta, onClose }: GestionSaldosRealesProps) {
  const { actualizarCuenta } = useCuentasStore();
  const { mostrarNotificacion } = useNotificaciones();
  const [saldoRealEditar, setSaldoRealEditar] = React.useState<string | null>(null);

  const handleSubmit = (saldoReal: any) => {
    try {
      let cuentaActualizada: Cuenta;
      
      if (saldoRealEditar) {
        cuentaActualizada = actualizarSaldoReal(cuenta, saldoRealEditar, saldoReal);
        mostrarNotificacion({
          mensaje: 'Saldo real actualizado correctamente',
          tipo: 'exito',
          duracion: 3000
        });
      } else {
        cuentaActualizada = agregarSaldoReal(cuenta, saldoReal);
        mostrarNotificacion({
          mensaje: 'Saldo real registrado correctamente',
          tipo: 'exito',
          duracion: 3000
        });
      }

      actualizarCuenta(cuenta.id, cuentaActualizada);
      setSaldoRealEditar(null);
    } catch (error) {
      mostrarNotificacion({
        mensaje: error instanceof Error ? error.message : 'Error al gestionar el saldo real',
        tipo: 'error',
        duracion: 5000
      });
    }
  };

  const handleEliminar = (id: string) => {
    try {
      const cuentaActualizada = eliminarSaldoReal(cuenta, id);
      actualizarCuenta(cuenta.id, cuentaActualizada);
      mostrarNotificacion({
        mensaje: 'Saldo real eliminado correctamente',
        tipo: 'exito',
        duracion: 3000
      });
    } catch (error) {
      mostrarNotificacion({
        mensaje: 'Error al eliminar el saldo real',
        tipo: 'error',
        duracion: 5000
      });
    }
  };

  const handleEditar = (saldoReal: any) => {
    setSaldoRealEditar(saldoReal.id);
  };

  const handleCancel = () => {
    setSaldoRealEditar(null);
    onClose();
  };

  const saldoRealActual = saldoRealEditar 
    ? cuenta.saldosReales.find(sr => sr.id === saldoRealEditar)
    : undefined;

  return (
    <div className="space-y-6">
      <FormularioSaldoReal
        onSubmit={handleSubmit}
        datosIniciales={saldoRealActual}
        onCancel={handleCancel}
      />

      <ListaSaldosReales
        saldosReales={cuenta.saldosReales}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />
    </div>
  );
}
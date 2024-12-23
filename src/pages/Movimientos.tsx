import React from 'react';
import { ListaMovimientos } from '../components/movimientos/ListaMovimientos';
import { FormularioMovimiento } from '../components/movimientos/FormularioMovimiento';
import { FiltrosMovimientos } from '../components/filtros/FiltrosMovimientos';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { PlusCircle } from 'lucide-react';
import { useMovimientosStore } from '../store/useMovimientosStore';
import { useCuentasStore } from '../store/useCuentasStore';
import { useNotificaciones } from '../hooks/useNotificaciones';
import { validarSaldoSuficiente } from '../utils/validaciones';

export function Movimientos() {
  const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
  const [filtros, setFiltros] = React.useState({});
  
  const { agregarMovimiento } = useMovimientosStore();
  const { obtenerCuenta, actualizarCuenta } = useCuentasStore();
  const { mostrarNotificacion } = useNotificaciones();

  const handleSubmit = (movimiento: any) => {
    try {
      if (movimiento.tipo === 'transferencia') {
        const cuentaOrigen = obtenerCuenta(movimiento.cuentaId);
        const cuentaDestino = obtenerCuenta(movimiento.cuentaDestinoId);

        if (!cuentaOrigen || !cuentaDestino) {
          throw new Error('Cuenta no encontrada');
        }

        if (!validarSaldoSuficiente(cuentaOrigen, movimiento.importe)) {
          mostrarNotificacion({
            mensaje: 'Saldo insuficiente en la cuenta de origen',
            tipo: 'error',
            duracion: 3000,
          });
          return;
        }

        // Actualizar saldos
        actualizarCuenta(movimiento.cuentaId, {
          saldo: cuentaOrigen.saldo - movimiento.importe
        });
        actualizarCuenta(movimiento.cuentaDestinoId, {
          saldo: cuentaDestino.saldo + movimiento.importe
        });

        // Registrar movimientos
        agregarMovimiento({
          ...movimiento,
          tipo: 'gasto',
          concepto: `Transferencia enviada: ${movimiento.concepto}`,
          categoria: 'transferencia'
        });

        agregarMovimiento({
          ...movimiento,
          cuentaId: movimiento.cuentaDestinoId,
          tipo: 'ingreso',
          concepto: `Transferencia recibida: ${movimiento.concepto}`,
          categoria: 'transferencia'
        });
      } else {
        const cuenta = obtenerCuenta(movimiento.cuentaId);
        if (!cuenta) {
          throw new Error('Cuenta no encontrada');
        }

        if (movimiento.tipo === 'gasto' && !validarSaldoSuficiente(cuenta, movimiento.importe)) {
          mostrarNotificacion({
            mensaje: 'Saldo insuficiente',
            tipo: 'error',
            duracion: 3000,
          });
          return;
        }

        // Actualizar saldo
        const nuevoSaldo = cuenta.saldo + (
          movimiento.tipo === 'ingreso' ? movimiento.importe : -movimiento.importe
        );
        actualizarCuenta(cuenta.id, { saldo: nuevoSaldo });

        // Registrar movimiento
        agregarMovimiento(movimiento);
      }

      setMostrarFormulario(false);
      mostrarNotificacion({
        mensaje: 'Movimiento registrado correctamente',
        tipo: 'exito',
        duracion: 3000,
      });
    } catch (error) {
      mostrarNotificacion({
        mensaje: 'Error al registrar el movimiento',
        tipo: 'error',
        duracion: 5000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Movimientos</h1>
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => setMostrarFormulario(true)}
        >
          Nuevo Movimiento
        </Button>
      </div>

      <FiltrosMovimientos onFiltroChange={setFiltros} />
      <ListaMovimientos />

      <Modal
        isOpen={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        title="Nuevo Movimiento"
      >
        <FormularioMovimiento onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
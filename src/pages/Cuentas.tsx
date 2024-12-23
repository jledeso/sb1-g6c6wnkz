import React from 'react';
import { ListaCuentas } from '../components/cuentas/ListaCuentas';
import { FormularioCuenta } from '../components/cuentas/FormularioCuenta';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { PlusCircle } from 'lucide-react';
import { useCuentasStore } from '../store/useCuentasStore';
import { useNotificaciones } from '../hooks/useNotificaciones';

export function Cuentas() {
  const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
  const { agregarCuenta } = useCuentasStore();
  const { mostrarNotificacion } = useNotificaciones();

  const handleSubmit = (cuenta: any) => {
    try {
      agregarCuenta(cuenta);
      setMostrarFormulario(false);
      mostrarNotificacion({
        mensaje: 'Cuenta creada correctamente',
        tipo: 'exito',
        duracion: 3000,
      });
    } catch (error) {
      mostrarNotificacion({
        mensaje: 'Error al crear la cuenta',
        tipo: 'error',
        duracion: 5000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Cuentas</h1>
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => setMostrarFormulario(true)}
        >
          Nueva Cuenta
        </Button>
      </div>

      <ListaCuentas />

      <Modal
        isOpen={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        title="Nueva Cuenta"
      >
        <FormularioCuenta onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
import React from 'react';
import { Cuenta, TipoCuenta } from '../../types/cuenta';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { formatearFechaInput } from '../../utils/fecha';

interface FormularioCuentaProps {
  onSubmit: (cuenta: Omit<Cuenta, 'id'>) => void;
  datosIniciales?: Cuenta;
}

export function FormularioCuenta({ onSubmit, datosIniciales }: FormularioCuentaProps) {
  const { mostrarNotificacion } = useNotificaciones();
  const [formData, setFormData] = React.useState({
    nombre: datosIniciales?.nombre || '',
    tipo: datosIniciales?.tipo || 'corriente' as TipoCuenta,
    saldoInicial: datosIniciales?.saldoInicial || 0,
    fechaSaldoInicial: formatearFechaInput(datosIniciales?.fechaSaldoInicial || new Date()),
    saldo: datosIniciales?.saldo || 0,
    limiteCredito: datosIniciales?.limiteCredito || 0,
    configuracionCredito: datosIniciales?.configuracionCredito || {
      cuentaLiquidacionId: '',
      diaInicioCiclo: 1,
      diaLiquidacion: 1,
      tipoLiquidacion: 'total' as const,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      mostrarNotificacion({
        mensaje: 'El nombre de la cuenta es obligatorio',
        tipo: 'error',
        duracion: 3000,
      });
      return;
    }

    const cuenta = {
      ...formData,
      saldoInicial: Number(formData.saldoInicial),
      fechaSaldoInicial: new Date(formData.fechaSaldoInicial),
      saldo: Number(formData.saldoInicial), // El saldo inicial es el saldo actual al crear la cuenta
      limiteCredito: formData.tipo === 'credito' ? Number(formData.limiteCredito) : undefined,
      configuracionCredito: formData.tipo === 'credito' ? formData.configuracionCredito : undefined,
    };

    onSubmit(cuenta);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la cuenta
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoCuenta })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="corriente">Cuenta Corriente</option>
          <option value="monedero">Monedero</option>
          <option value="credito">Tarjeta de Crédito</option>
          <option value="debito">Tarjeta de Débito</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fecha saldo inicial
        </label>
        <input
          type="date"
          value={formData.fechaSaldoInicial}
          onChange={(e) => setFormData({ ...formData, fechaSaldoInicial: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Saldo inicial
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.saldoInicial}
          onChange={(e) => setFormData({ ...formData, saldoInicial: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      {formData.tipo === 'credito' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Límite de crédito
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.limiteCredito}
              onChange={(e) => setFormData({ ...formData, limiteCredito: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Aquí irían los campos de configuración de crédito */}
        </>
      )}

      <button
        type="submit"
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {datosIniciales ? 'Actualizar Cuenta' : 'Crear Cuenta'}
      </button>
    </form>
  );
}
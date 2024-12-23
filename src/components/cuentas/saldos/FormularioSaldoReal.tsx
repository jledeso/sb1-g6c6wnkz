import React from 'react';
import { SaldoReal } from '../../../types/cuenta';
import { useNotificaciones } from '../../../hooks/useNotificaciones';
import { formatearFechaInput } from '../../../utils/fecha';

interface FormularioSaldoRealProps {
  onSubmit: (saldoReal: Omit<SaldoReal, 'id'>) => void;
  datosIniciales?: SaldoReal;
  onCancel: () => void;
}

export function FormularioSaldoReal({ onSubmit, datosIniciales, onCancel }: FormularioSaldoRealProps) {
  const { mostrarNotificacion } = useNotificaciones();
  const [formData, setFormData] = React.useState({
    fecha: datosIniciales ? formatearFechaInput(datosIniciales.fecha) : formatearFechaInput(new Date()),
    saldo: datosIniciales?.saldo || 0,
    notas: datosIniciales?.notas || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fecha) {
      mostrarNotificacion({
        mensaje: 'La fecha es obligatoria',
        tipo: 'error',
        duracion: 3000
      });
      return;
    }

    onSubmit({
      fecha: new Date(formData.fecha),
      saldo: formData.saldo,
      notas: formData.notas
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fecha
        </label>
        <input
          type="date"
          value={formData.fecha}
          onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Saldo Real
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.saldo}
          onChange={(e) => setFormData({ ...formData, saldo: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notas (opcional)
        </label>
        <textarea
          value={formData.notas}
          onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {datosIniciales ? 'Actualizar' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
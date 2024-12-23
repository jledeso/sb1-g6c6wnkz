import React from 'react';
import { Categoria } from '../../types/categoria';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { validarCamposObligatorios } from '../../utils/validaciones';

interface FormularioCategoriaProps {
  onSubmit: (categoria: Omit<Categoria, 'id'>) => void;
  datosIniciales?: Categoria;
  onCancel?: () => void;
}

export function FormularioCategoria({ onSubmit, datosIniciales, onCancel }: FormularioCategoriaProps) {
  const { mostrarNotificacion } = useNotificaciones();
  const [formData, setFormData] = React.useState({
    nombre: datosIniciales?.nombre || '',
    tipo: datosIniciales?.tipo || 'gasto',
    color: datosIniciales?.color || '#6B7280',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCamposObligatorios(formData, ['nombre', 'tipo', 'color'])) {
      mostrarNotificacion({
        mensaje: 'Por favor, completa todos los campos obligatorios',
        tipo: 'error',
        duracion: 3000,
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre
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
        <label className="block text-sm font-medium text-gray-700">
          Tipo
        </label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Categoria['tipo'] })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
          <option value="ambos">Ambos</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <div className="mt-1 flex items-center space-x-2">
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="h-8 w-8 rounded border border-gray-300"
          />
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            pattern="^#[0-9A-Fa-f]{6}$"
            placeholder="#000000"
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {datosIniciales ? 'Actualizar' : 'Crear'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
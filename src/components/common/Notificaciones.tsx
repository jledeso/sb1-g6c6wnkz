import React from 'react';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export function Notificaciones() {
  const { notificaciones, eliminarNotificacion } = useNotificaciones();

  const iconosPorTipo = {
    info: Info,
    exito: CheckCircle,
    error: AlertCircle,
  };

  const estilosPorTipo = {
    info: 'bg-blue-50 text-blue-800',
    exito: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
  };

  return (
    <div className="fixed bottom-0 right-0 p-6 space-y-4 z-50">
      {notificaciones.map((notificacion) => {
        const Icono = iconosPorTipo[notificacion.tipo];
        return (
          <div
            key={notificacion.id}
            className={`${estilosPorTipo[notificacion.tipo]} p-4 rounded-lg shadow-lg max-w-sm flex items-start`}
          >
            <Icono className="h-5 w-5 mr-3 mt-0.5" />
            <p className="flex-1">{notificacion.mensaje}</p>
            <button
              onClick={() => eliminarNotificacion(notificacion.id)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
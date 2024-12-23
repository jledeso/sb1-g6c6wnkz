import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../common/Button';
import { useMovimientosFiltrados } from '../../hooks/useMovimientosFiltrados';
import { exportarMovimientosCSV, descargarCSV } from '../../utils/exportar';
import { useNotificaciones } from '../../hooks/useNotificaciones';

export function ExportarMovimientos() {
  const movimientos = useMovimientosFiltrados({});
  const { mostrarNotificacion } = useNotificaciones();

  const handleExportar = () => {
    try {
      const contenidoCSV = exportarMovimientosCSV(movimientos);
      const fecha = new Date().toISOString().split('T')[0];
      descargarCSV(contenidoCSV, `movimientos_${fecha}.csv`);
      
      mostrarNotificacion({
        mensaje: 'Movimientos exportados correctamente',
        tipo: 'exito',
        duracion: 3000,
      });
    } catch (error) {
      mostrarNotificacion({
        mensaje: 'Error al exportar los movimientos',
        tipo: 'error',
        duracion: 5000,
      });
    }
  };

  return (
    <Button
      variant="secondary"
      icon={Download}
      onClick={handleExportar}
      className="ml-4"
    >
      Exportar
    </Button>
  );
}
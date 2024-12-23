import React from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from './Button';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { useCuentasStore } from '../../store/useCuentasStore';
import { useCategoriasStore } from '../../store/useCategoriasStore';
import { useMovimientosStore } from '../../store/useMovimientosStore';
import { exportarDatosACsv } from '../../utils/export/exportToCsv';
import { importarDatosDesdeCSV } from '../../utils/import/importFromCsv';

export function ImportExportData() {
  const { mostrarNotificacion } = useNotificaciones();
  const { cuentas, agregarCuenta, reiniciarCuentas } = useCuentasStore();
  const { categorias, agregarCategoria, reiniciarCategorias } = useCategoriasStore();
  const { movimientos, agregarMovimiento, reiniciarMovimientos } = useMovimientosStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const contenidoCSV = exportarDatosACsv({ cuentas, categorias, movimientos });
      const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `finanzas_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      mostrarNotificacion({
        mensaje: 'Datos exportados correctamente',
        tipo: 'exito',
        duracion: 3000,
      });
    } catch (error) {
      mostrarNotificacion({
        mensaje: 'Error al exportar los datos',
        tipo: 'error',
        duracion: 5000,
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const contenido = e.target?.result as string;
        const datos = importarDatosDesdeCSV(contenido);

        // Reiniciar todos los datos antes de importar
        reiniciarCuentas();
        reiniciarCategorias();
        reiniciarMovimientos();

        // Importar en orden para mantener las relaciones
        datos.categorias.forEach(categoria => agregarCategoria(categoria));
        datos.cuentas.forEach(cuenta => agregarCuenta(cuenta));
        datos.movimientos.forEach(movimiento => agregarMovimiento(movimiento));

        mostrarNotificacion({
          mensaje: 'Datos importados correctamente',
          tipo: 'exito',
          duracion: 3000,
        });

        // Limpiar el input file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error al importar:', error);
        mostrarNotificacion({
          mensaje: 'Error al importar los datos',
          tipo: 'error',
          duracion: 5000,
        });
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex space-x-4">
      <Button
        variant="secondary"
        icon={Download}
        onClick={handleExport}
      >
        Exportar Datos
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".csv"
        className="hidden"
      />
      <Button
        variant="secondary"
        icon={Upload}
        onClick={() => fileInputRef.current?.click()}
      >
        Importar Datos
      </Button>
    </div>
  );
}
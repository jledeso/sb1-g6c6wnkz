import React from 'react';
import { useMovimientosStore } from '../../store/useMovimientosStore';
import { obtenerMovimientosEfectivos } from '../../utils/movimientos/calculador';
import { Card } from '../common/Card';
import { obtenerIdOriginal, actualizarValidacionMovimiento } from '../../utils/movimientos/validacion';
import { TablaValidacion } from './TablaValidacion';
import { FiltroPeriodo } from '../common/FiltroPeriodo';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { formatearFechaInput } from '../../utils/fecha';

interface ValidacionMovimientosProps {
  cuentaId: string;
  nombreCuenta: string;
  fechaSaldoInicial: Date;
}

export function ValidacionMovimientos({ 
  cuentaId, 
  nombreCuenta,
  fechaSaldoInicial 
}: ValidacionMovimientosProps) {
  const [fechaInicio, setFechaInicio] = React.useState(formatearFechaInput(fechaSaldoInicial));
  const [fechaFin, setFechaFin] = React.useState(formatearFechaInput(new Date()));
  const [fechasReales, setFechasReales] = React.useState<Record<string, string>>({});
  
  const { movimientos, actualizarMovimiento } = useMovimientosStore();
  const { mostrarNotificacion } = useNotificaciones();

  const movimientosFiltrados = React.useMemo(() => {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    
    return obtenerMovimientosEfectivos(
      movimientos.filter(m => m.cuentaId === cuentaId || m.cuentaDestinoId === cuentaId),
      fechaInicioDate,
      fechaFinDate
    ).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [movimientos, cuentaId, fechaInicio, fechaFin]);

  const handleValidarMovimiento = (movimientoId: string, fechaPrevista: Date) => {
    try {
      const idOriginal = obtenerIdOriginal(movimientoId);
      const movimientoOriginal = movimientos.find(m => m.id === idOriginal);
      if (!movimientoOriginal) return;

      const key = `${idOriginal}_${fechaPrevista.toISOString()}`;
      const fechaReal = fechasReales[key] 
        ? new Date(fechasReales[key])
        : fechaPrevista;

      const movimientoActualizado = actualizarValidacionMovimiento(
        movimientoOriginal,
        fechaPrevista,
        fechaReal,
        !movimientoOriginal.validaciones?.[fechaPrevista.toISOString()]?.validado
      );

      actualizarMovimiento(idOriginal, movimientoActualizado);

      mostrarNotificacion({
        mensaje: movimientoActualizado.validaciones?.[fechaPrevista.toISOString()]?.validado
          ? 'Movimiento validado'
          : 'Validación removida',
        tipo: 'exito',
        duracion: 2000,
      });
    } catch (error) {
      mostrarNotificacion({
        mensaje: error instanceof Error ? error.message : 'Error al actualizar el movimiento',
        tipo: 'error',
        duracion: 5000,
      });
    }
  };

  const handleCambiarFechaReal = (
    movimientoId: string, 
    fechaPrevista: Date, 
    nuevaFecha: string
  ) => {
    const idOriginal = obtenerIdOriginal(movimientoId);
    const key = `${idOriginal}_${fechaPrevista.toISOString()}`;
    setFechasReales(prev => ({
      ...prev,
      [key]: nuevaFecha
    }));

    // Actualizar automáticamente la validación con la nueva fecha
    const movimientoOriginal = movimientos.find(m => m.id === idOriginal);
    if (movimientoOriginal && movimientoOriginal.validaciones?.[fechaPrevista.toISOString()]?.validado) {
      const movimientoActualizado = actualizarValidacionMovimiento(
        movimientoOriginal,
        fechaPrevista,
        new Date(nuevaFecha),
        true
      );
      actualizarMovimiento(idOriginal, movimientoActualizado);
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Validación de Movimientos - {nombreCuenta}</h2>
        </div>

        <FiltroPeriodo
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          onFechaInicioChange={setFechaInicio}
          onFechaFinChange={setFechaFin}
        />

        <TablaValidacion
          movimientos={movimientosFiltrados}
          fechasReales={fechasReales}
          onValidar={handleValidarMovimiento}
          onCambiarFechaReal={handleCambiarFechaReal}
        />
      </div>
    </Card>
  );
}
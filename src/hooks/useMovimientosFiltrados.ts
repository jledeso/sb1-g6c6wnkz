import { useMemo } from 'react';
import { useMovimientosStore } from '../store/useMovimientosStore';
import { FiltrosMovimientos } from '../components/filtros/FiltrosMovimientos';
import { isAfter, isBefore, isEqual } from 'date-fns';

export function useMovimientosFiltrados(filtros: FiltrosMovimientos) {
  const { movimientos } = useMovimientosStore();

  return useMemo(() => {
    return movimientos.filter(movimiento => {
      if (filtros.fechaInicio && isAfter(filtros.fechaInicio, movimiento.fecha)) {
        return false;
      }
      if (filtros.fechaFin && isBefore(filtros.fechaFin, movimiento.fecha)) {
        return false;
      }
      if (filtros.categoria && movimiento.categoria !== filtros.categoria) {
        return false;
      }
      if (filtros.cuenta && movimiento.cuentaId !== filtros.cuenta) {
        return false;
      }
      if (filtros.tipo && filtros.tipo !== 'todos' && movimiento.tipo !== filtros.tipo) {
        return false;
      }
      if (filtros.concepto && !movimiento.concepto.toLowerCase().includes(filtros.concepto.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [movimientos, filtros]);
}
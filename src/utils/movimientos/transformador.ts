import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EvolucionCuenta, DatoGrafico } from './tipos';

export function transformarDatosGrafico(evolucionPorCuenta: EvolucionCuenta[]): DatoGrafico[] {
  if (evolucionPorCuenta.length === 0) {
    return [];
  }

  // Obtener todas las fechas únicas de todas las cuentas
  const fechasUnicas = new Set<number>();
  evolucionPorCuenta.forEach(({ evolucion, saldosReales }) => {
    evolucion.forEach(punto => {
      fechasUnicas.add(punto.fecha.getTime());
    });
    saldosReales.forEach(punto => {
      fechasUnicas.add(punto.fecha.getTime());
    });
  });

  // Convertir a array y ordenar
  const fechasOrdenadas = Array.from(fechasUnicas).sort();

  // Crear datos para cada fecha
  return fechasOrdenadas.map(timestamp => {
    const fecha = new Date(timestamp);
    const datos: DatoGrafico = {
      fecha: format(fecha, 'd MMM', { locale: es }),
      timestamp,
    };

    // Agregar datos de todas las cuentas
    evolucionPorCuenta.forEach(({ cuenta, evolucion, saldosReales }) => {
      const puntoEvolucion = evolucion.find(
        p => p.fecha.getTime() === timestamp
      );
      const saldoReal = saldosReales.find(
        p => p.fecha.getTime() === timestamp
      );

      datos[`saldo_${cuenta.id}`] = puntoEvolucion?.saldo ?? null;
      datos[`saldoReal_${cuenta.id}`] = saldoReal?.saldo ?? null;
      datos[`nombre_${cuenta.id}`] = cuenta.nombre;
    });

    return datos;
  });
}
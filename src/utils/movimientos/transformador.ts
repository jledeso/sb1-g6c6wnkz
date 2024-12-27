import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EvolucionCuenta, DatoGrafico } from './tipos';

export function transformarDatosGrafico(evolucionPorCuenta: EvolucionCuenta[]): DatoGrafico[] {
  if (evolucionPorCuenta.length === 0) {
    return [];
  }

  // Obtener todas las fechas únicas de todas las cuentas
  const fechasUnicas = new Set<string>();
  evolucionPorCuenta.forEach(({ evolucion, saldosReales }) => {
    evolucion.forEach(punto => {
      fechasUnicas.add(format(new Date(punto.fecha), 'd MMM', { locale: es }));
    });
    saldosReales.forEach(punto => {
      const fecha = format(new Date(punto.fecha), 'd MMM', { locale: es });
      console.log('Añadiendo fecha de saldo real:', {
        fecha,
        saldo: punto.saldo
      });
      fechasUnicas.add(fecha);
    });
  });

  // Convertir a array y ordenar por fecha
  const fechasOrdenadas = Array.from(fechasUnicas).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  console.log('Fechas ordenadas:', fechasOrdenadas);

  // Crear datos para cada fecha
  let ultimosSaldosReales: { [key: string]: number } = {};
  
  return fechasOrdenadas.map(fecha => {
    const datos: DatoGrafico = {
      fecha,
      timestamp: new Date(fecha).getTime(),
    };

    // Agregar datos de todas las cuentas
    evolucionPorCuenta.forEach(({ cuenta, evolucion, saldosReales }) => {
      // Buscar punto de evolución para esta fecha
      const puntoEvolucion = evolucion.find(
        p => format(new Date(p.fecha), 'd MMM', { locale: es }) === fecha
      );

      // Buscar saldo real para esta fecha
      const saldoReal = saldosReales.find(
        p => format(new Date(p.fecha), 'd MMM', { locale: es }) === fecha
      );

      if (saldoReal) {
        console.log('Encontrado saldo real para fecha:', {
          fecha,
          saldo: saldoReal.saldo,
          cuenta: cuenta.nombre
        });
        // Actualizar el último saldo real conocido para esta cuenta
        ultimosSaldosReales[cuenta.id] = saldoReal.saldo;
      }

      // Asignar valores
      datos[`saldo_${cuenta.id}`] = puntoEvolucion?.saldo ?? null;
      // Usar el último saldo real conocido o null si no hay ninguno
      datos[`saldoReal_${cuenta.id}`] = ultimosSaldosReales[cuenta.id] ?? null;
      // Marcar si esta fecha tiene un saldo real introducido
      datos[`esSaldoRealIntroducido_${cuenta.id}`] = saldoReal !== undefined;
      datos[`nombre_${cuenta.id}`] = cuenta.nombre;
    });

    return datos;
  });
}
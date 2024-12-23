import { useState } from 'react';

interface OpcionesPaginacion {
  elementosPorPagina?: number;
  paginaInicial?: number;
}

export function usePaginacion<T>({ 
  elementosPorPagina = 10, 
  paginaInicial = 1 
}: OpcionesPaginacion = {}) {
  const [paginaActual, setPaginaActual] = useState(paginaInicial);

  const paginar = (elementos: T[]): T[] => {
    const inicio = (paginaActual - 1) * elementosPorPagina;
    return elementos.slice(inicio, inicio + elementosPorPagina);
  };

  const cambiarPagina = (numeroPagina: number) => {
    setPaginaActual(numeroPagina);
  };

  const calcularTotalPaginas = (totalElementos: number): number => {
    return Math.ceil(totalElementos / elementosPorPagina);
  };

  return {
    paginaActual,
    elementosPorPagina,
    paginar,
    cambiarPagina,
    calcularTotalPaginas,
  };
}
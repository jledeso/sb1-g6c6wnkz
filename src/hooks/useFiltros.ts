import { useState, useCallback } from 'react';

export interface FiltroBase {
  campo: string;
  valor: any;
  operador?: 'igual' | 'contiene' | 'mayor' | 'menor';
}

export function useFiltros<T>() {
  const [filtros, setFiltros] = useState<FiltroBase[]>([]);

  const aplicarFiltros = useCallback((elementos: T[]): T[] => {
    return elementos.filter(elemento => {
      return filtros.every(filtro => {
        const valor = (elemento as any)[filtro.campo];
        
        switch (filtro.operador) {
          case 'contiene':
            return String(valor)
              .toLowerCase()
              .includes(String(filtro.valor).toLowerCase());
          case 'mayor':
            return valor > filtro.valor;
          case 'menor':
            return valor < filtro.valor;
          default:
            return valor === filtro.valor;
        }
      });
    });
  }, [filtros]);

  const agregarFiltro = (filtro: FiltroBase) => {
    setFiltros(filtrosActuales => [...filtrosActuales, filtro]);
  };

  const eliminarFiltro = (campo: string) => {
    setFiltros(filtrosActuales => 
      filtrosActuales.filter(f => f.campo !== campo)
    );
  };

  const limpiarFiltros = () => {
    setFiltros([]);
  };

  return {
    filtros,
    aplicarFiltros,
    agregarFiltro,
    eliminarFiltro,
    limpiarFiltros,
  };
}
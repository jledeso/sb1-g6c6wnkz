import { useState } from 'react';

type DireccionOrden = 'asc' | 'desc';

interface OpcionesOrdenacion<T> {
  campoInicial?: keyof T;
  direccionInicial?: DireccionOrden;
}

export function useOrdenacion<T>({ 
  campoInicial, 
  direccionInicial = 'asc' 
}: OpcionesOrdenacion<T> = {}) {
  const [campoOrden, setCampoOrden] = useState<keyof T | undefined>(campoInicial);
  const [direccionOrden, setDireccionOrden] = useState<DireccionOrden>(direccionInicial);

  const ordenar = (elementos: T[]): T[] => {
    if (!campoOrden) return elementos;

    return [...elementos].sort((a, b) => {
      const valorA = a[campoOrden];
      const valorB = b[campoOrden];

      if (valorA < valorB) return direccionOrden === 'asc' ? -1 : 1;
      if (valorA > valorB) return direccionOrden === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const cambiarOrden = (campo: keyof T) => {
    if (campo === campoOrden) {
      setDireccionOrden(direccionOrden === 'asc' ? 'desc' : 'asc');
    } else {
      setCampoOrden(campo);
      setDireccionOrden('asc');
    }
  };

  return {
    campoOrden,
    direccionOrden,
    ordenar,
    cambiarOrden,
  };
}
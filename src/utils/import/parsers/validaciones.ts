import { parseBase64JSON } from './base64';

export interface ValidacionImportada {
  fecha: Date;
  validado: boolean;
}

export function parseValidaciones(validacionesBase64: string): Record<string, ValidacionImportada> | undefined {
  const validaciones = parseBase64JSON<Record<string, { fecha: string; validado: boolean }>>(validacionesBase64);
  if (!validaciones) return undefined;

  return Object.entries(validaciones).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: {
      fecha: new Date(value.fecha),
      validado: value.validado
    }
  }), {});
}
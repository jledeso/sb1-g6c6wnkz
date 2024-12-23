import React from 'react';
import { Movimiento, TipoMovimiento, TipoPeriodicidad } from '../../types/movimiento';
import { useCategoriasStore } from '../../store/useCategoriasStore';
import { useCuentasStore } from '../../store/useCuentasStore';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { Modal } from '../common/Modal';
import { FormularioCategoria } from '../categorias/FormularioCategoria';
import { validarCamposObligatorios } from '../../utils/validaciones';
import { formatearFechaInput } from '../../utils/fecha';

interface FormularioMovimientoProps {
  onSubmit: (movimiento: Omit<Movimiento, 'id'>) => void;
  datosIniciales?: Movimiento;
}

export function FormularioMovimiento({ onSubmit, datosIniciales }: FormularioMovimientoProps) {
  const { categorias, agregarCategoria } = useCategoriasStore();
  const { cuentas } = useCuentasStore();
  const { mostrarNotificacion } = useNotificaciones();
  const [mostrarFormularioCategoria, setMostrarFormularioCategoria] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    cuentaId: datosIniciales?.cuentaId || '',
    cuentaDestinoId: datosIniciales?.cuentaDestinoId || '',
    fecha: formatearFechaInput(datosIniciales?.fecha || new Date()),
    importe: datosIniciales?.importe || 0,
    concepto: datosIniciales?.concepto || '',
    categoria: datosIniciales?.categoria || '',
    tipo: datosIniciales?.tipo || 'gasto' as TipoMovimiento,
    esPeriodico: datosIniciales?.esPeriodico || false,
    periodicidad: datosIniciales?.periodicidad || 'mensual' as TipoPeriodicidad,
    diaEjecucion: datosIniciales?.configuracionPeriodicidad?.diaEjecucion || 1,
    mesEjecucion: datosIniciales?.configuracionPeriodicidad?.mesEjecucion || 1,
    fechaInicio: datosIniciales?.fechaInicio ? formatearFechaInput(datosIniciales.fechaInicio) : formatearFechaInput(new Date()),
    fechaFin: datosIniciales?.fechaFin ? formatearFechaInput(datosIniciales.fechaFin) : '',
  });

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const camposObligatorios = ['cuentaId', 'fecha', 'importe', 'concepto'];
    if (formData.tipo === 'transferencia') {
      camposObligatorios.push('cuentaDestinoId');
    } else {
      camposObligatorios.push('categoria');
    }

    if (formData.esPeriodico) {
      camposObligatorios.push('periodicidad', 'fechaInicio');
      if (formData.periodicidad === 'anual') {
        camposObligatorios.push('mesEjecucion');
      }
    }

    if (!validarCamposObligatorios(formData, camposObligatorios)) {
      mostrarNotificacion({
        mensaje: 'Por favor, completa todos los campos obligatorios',
        tipo: 'error',
        duracion: 3000,
      });
      return;
    }

    const configuracionPeriodicidad = formData.esPeriodico ? {
      diaEjecucion: formData.diaEjecucion,
      mesEjecucion: formData.periodicidad === 'anual' ? formData.mesEjecucion : undefined,
    } : undefined;

    onSubmit({
      ...formData,
      fecha: new Date(formData.fecha),
      fechaInicio: formData.esPeriodico ? new Date(formData.fechaInicio) : undefined,
      fechaFin: formData.fechaFin ? new Date(formData.fechaFin) : undefined,
      configuracionPeriodicidad,
    });
  };

  const handleNuevaCategoria = (categoria: any) => {
    agregarCategoria(categoria);
    setMostrarFormularioCategoria(false);
    mostrarNotificacion({
      mensaje: 'Categoría creada correctamente',
      tipo: 'exito',
      duracion: 3000,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoMovimiento })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cuenta {formData.tipo === 'transferencia' ? 'origen' : ''}
          </label>
          <select
            value={formData.cuentaId}
            onChange={(e) => setFormData({ ...formData, cuentaId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Selecciona una cuenta</option>
            {cuentas.map((cuenta) => (
              <option key={cuenta.id} value={cuenta.id}>
                {cuenta.nombre}
              </option>
            ))}
          </select>
        </div>

        {formData.tipo === 'transferencia' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cuenta destino
            </label>
            <select
              value={formData.cuentaDestinoId}
              onChange={(e) => setFormData({ ...formData, cuentaDestinoId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Selecciona una cuenta</option>
              {cuentas
                .filter(cuenta => cuenta.id !== formData.cuentaId)
                .map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.nombre}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Importe
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.importe}
            onChange={(e) => setFormData({ ...formData, importe: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Concepto
          </label>
          <input
            type="text"
            value={formData.concepto}
            onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        {formData.tipo !== 'transferencia' && (
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <button
                type="button"
                onClick={() => setMostrarFormularioCategoria(true)}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Nueva categoría
              </button>
            </div>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias
                .filter((cat) => cat.tipo === 'ambos' || cat.tipo === formData.tipo)
                .map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="esPeriodico"
            checked={formData.esPeriodico}
            onChange={(e) => setFormData({ ...formData, esPeriodico: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="esPeriodico" className="ml-2 block text-sm text-gray-700">
            Es movimiento periódico
          </label>
        </div>

        {formData.esPeriodico && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Periodicidad
              </label>
              <select
                value={formData.periodicidad}
                onChange={(e) => setFormData({ ...formData, periodicidad: e.target.value as TipoPeriodicidad })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
                <option value="anual">Anual</option>
              </select>
            </div>

            {formData.periodicidad === 'anual' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mes de ejecución
                  </label>
                  <select
                    value={formData.mesEjecucion}
                    onChange={(e) => setFormData({ ...formData, mesEjecucion: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    {meses.map((mes, index) => (
                      <option key={index + 1} value={index + 1}>
                        {mes}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Día del mes
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={formData.diaEjecucion}
                    onChange={(e) => setFormData({ ...formData, diaEjecucion: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            )}

            {formData.periodicidad !== 'diario' && formData.periodicidad !== 'anual' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Día de ejecución
                </label>
                <input
                  type="number"
                  min={1}
                  max={formData.periodicidad === 'semanal' ? 7 : 31}
                  value={formData.diaEjecucion}
                  onChange={(e) => setFormData({ ...formData, diaEjecucion: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.periodicidad === 'semanal' 
                    ? '1 = Lunes, 7 = Domingo' 
                    : 'Día del mes (1-31)'}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha inicio
              </label>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha fin (opcional)
              </label>
              <input
                type="date"
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {datosIniciales ? 'Actualizar Movimiento' : 'Crear Movimiento'}
        </button>
      </form>

      <Modal
        isOpen={mostrarFormularioCategoria}
        onClose={() => setMostrarFormularioCategoria(false)}
        title="Nueva Categoría"
      >
        <FormularioCategoria
          onSubmit={handleNuevaCategoria}
          onCancel={() => setMostrarFormularioCategoria(false)}
        />
      </Modal>
    </>
  );
}
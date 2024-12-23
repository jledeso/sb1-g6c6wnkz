import React from 'react';
import { useCategoriasStore } from '../store/useCategoriasStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { FormularioCategoria } from '../components/categorias/FormularioCategoria';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useNotificaciones } from '../hooks/useNotificaciones';

export function Categorias() {
  const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
  const [categoriaEditar, setCategoriaEditar] = React.useState<string | null>(null);
  const { categorias, agregarCategoria, actualizarCategoria, eliminarCategoria } = useCategoriasStore();
  const { mostrarNotificacion } = useNotificaciones();

  const handleSubmit = (datosCategoria: any) => {
    try {
      if (categoriaEditar) {
        actualizarCategoria(categoriaEditar, datosCategoria);
        mostrarNotificacion({
          mensaje: 'Categoría actualizada correctamente',
          tipo: 'exito',
          duracion: 3000,
        });
      } else {
        agregarCategoria(datosCategoria);
        mostrarNotificacion({
          mensaje: 'Categoría creada correctamente',
          tipo: 'exito',
          duracion: 3000,
        });
      }
      setMostrarFormulario(false);
      setCategoriaEditar(null);
    } catch (error) {
      mostrarNotificacion({
        mensaje: 'Error al guardar la categoría',
        tipo: 'error',
        duracion: 5000,
      });
    }
  };

  const handleEditar = (id: string) => {
    setCategoriaEditar(id);
    setMostrarFormulario(true);
  };

  const handleEliminar = (id: string) => {
    try {
      eliminarCategoria(id);
      mostrarNotificacion({
        mensaje: 'Categoría eliminada correctamente',
        tipo: 'exito',
        duracion: 3000,
      });
    } catch (error) {
      mostrarNotificacion({
        mensaje: 'Error al eliminar la categoría',
        tipo: 'error',
        duracion: 5000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => {
            setCategoriaEditar(null);
            setMostrarFormulario(true);
          }}
        >
          Nueva Categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map((categoria) => (
          <Card key={categoria.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: categoria.color }}
                />
                <h3 className="text-lg font-medium text-gray-900">
                  {categoria.nombre}
                </h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditar(categoria.id)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEliminar(categoria.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 capitalize">
              {categoria.tipo}
            </p>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={mostrarFormulario}
        onClose={() => {
          setMostrarFormulario(false);
          setCategoriaEditar(null);
        }}
        title={categoriaEditar ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <FormularioCategoria
          onSubmit={handleSubmit}
          datosIniciales={categoriaEditar ? categorias.find(c => c.id === categoriaEditar) : undefined}
          onCancel={() => {
            setMostrarFormulario(false);
            setCategoriaEditar(null);
          }}
        />
      </Modal>
    </div>
  );
}
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  Tags,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [menuAbierto, setMenuAbierto] = React.useState(false);

  const enlaces = [
    { to: '/', icon: LayoutDashboard, texto: 'Dashboard' },
    { to: '/cuentas', icon: Wallet, texto: 'Cuentas' },
    { to: '/movimientos', icon: ArrowRightLeft, texto: 'Movimientos' },
    { to: '/categorias', icon: Tags, texto: 'Categorías' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra superior móvil */}
      <div className="lg:hidden bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-gray-800">Finanzas</h1>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú lateral */}
      <div className={`
        fixed inset-y-0 left-0 transform 
        ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        w-64 bg-white shadow-lg 
        transition duration-200 ease-in-out
        z-30 lg:z-0
      `}>
        <div className="p-6 hidden lg:block">
          <h1 className="text-2xl font-bold text-gray-800">Finanzas</h1>
        </div>
        <nav className="mt-6">
          {enlaces.map(({ to, icon: Icon, texto }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50
                ${isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''}
              `}
              onClick={() => setMenuAbierto(false)}
            >
              <Icon className="h-5 w-5 mr-3" />
              {texto}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-64">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Overlay para cerrar menú en móvil */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}
    </div>
  );
}
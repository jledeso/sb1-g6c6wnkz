import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Cuentas } from './pages/Cuentas';
import { Movimientos } from './pages/Movimientos';
import { Categorias } from './pages/Categorias';
import { Notificaciones } from './components/common/Notificaciones';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cuentas" element={<Cuentas />} />
          <Route path="/movimientos" element={<Movimientos />} />
          <Route path="/categorias" element={<Categorias />} />
        </Routes>
      </Layout>
      <Notificaciones />
    </BrowserRouter>
  );
}

export default App;
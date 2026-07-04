import { AuthProvider, useAuth } from './context/AuthContext';
import { Router, navigate } from './context/Router';
import { ToastContainer } from './components/Toast';
import DashboardLayout from './components/DashboardLayout';

import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';

import UsuarioDashboard from './pages/usuario/Dashboard';
import AbrirChamado from './pages/usuario/AbrirChamado';
import Historico from './pages/usuario/Historico';
import Perfil from './pages/usuario/Perfil';

import AdminDashboard from './pages/admin/Dashboard';
import AdminChamados from './pages/admin/Chamados';
import AdminAmbulancias from './pages/admin/Ambulancias';
import AdminEquipes from './pages/admin/Equipes';
import AdminPlanos from './pages/admin/Planos';

import './App.css';

function AppRoutes() {
  const { user, isAdmin, isUsuario } = useAuth();

  return (
    <Router>
      {(path) => {
        if (!user && path !== '/' && path !== '/cadastro') {
          setTimeout(() => navigate('/'), 0);
          return null;
        }
        if (user && path === '/') {
          setTimeout(() => navigate(isAdmin ? '/admin/dashboard' : '/usuario/dashboard'), 0);
          return null;
        }

        if (path === '/') return <LoginPage />;
        if (path === '/cadastro') return <CadastroPage />;

        if (path.startsWith('/usuario/') && isUsuario) {
          const pageMap = {
            '/usuario/dashboard': <UsuarioDashboard />,
            '/usuario/chamado': <AbrirChamado />,
            '/usuario/historico': <Historico />,
            '/usuario/perfil': <Perfil />,
          };
          const page = pageMap[path];
          if (page) return <DashboardLayout currentPath={path}>{page}</DashboardLayout>;
        }

        if (path.startsWith('/admin/') && isAdmin) {
          const pageMap = {
            '/admin/dashboard': <AdminDashboard />,
            '/admin/chamados': <AdminChamados />,
            '/admin/ambulancias': <AdminAmbulancias />,
            '/admin/equipes': <AdminEquipes />,
            '/admin/planos': <AdminPlanos />,
          };
          const page = pageMap[path];
          if (page) return <DashboardLayout currentPath={path}>{page}</DashboardLayout>;
        }

        return (
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: 16 }}>
            <div style={{ fontSize: 64 }}>🚧</div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>Página não encontrada</h1>
            <button onClick={() => navigate('/')} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: 600 }}>
              Voltar ao início
            </button>
          </div>
        );
      }}
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer />
    </AuthProvider>
  );
}

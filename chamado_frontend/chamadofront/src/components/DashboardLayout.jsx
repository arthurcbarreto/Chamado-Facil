import { useAuth } from '../context/AuthContext';
import { navigate } from '../context/Router';

const usuarioNavItems = [
  { path: '/usuario/dashboard', icon: '🏠', label: 'Início' },
  { path: '/usuario/chamado',   icon: '🚨', label: 'Abrir Chamado' },
  { path: '/usuario/historico', icon: '📋', label: 'Histórico' },
  { path: '/usuario/perfil',    icon: '👤', label: 'Meu Perfil' },
];

const adminNavItems = [
  { path: '/admin/dashboard',   icon: '📊', label: 'Dashboard' },
  { path: '/admin/chamados',    icon: '🚑', label: 'Chamados' },
  { path: '/admin/ambulancias', icon: '🚒', label: 'Frota' },
  { path: '/admin/equipes',     icon: '👥', label: 'Equipes' },
  { path: '/admin/planos',      icon: '📋', label: 'Planos' },
];

export default function DashboardLayout({ children, currentPath }) {
  const { user, logout, isAdmin } = useAuth();
  const navItems = isAdmin ? adminNavItems : usuarioNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside style={{
        width: 256,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0,
        height: '100vh',
        zIndex: 100,
        boxShadow: '1px 0 0 var(--border)',
      }}>

        {/* Logo */}
        <div style={{ padding: '22px 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: 12,
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
              boxShadow: '0 2px 8px rgba(220,38,38,0.30)',
            }}>🚑</div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontSize: 15,
                letterSpacing: '-0.01em',
              }}>ChamadoFácil</div>
              <div style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                marginTop: 1,
                fontWeight: 500,
              }}>{isAdmin ? 'Administrador' : 'Usuário'}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => {
            const active = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? 'var(--accent-subtle)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  width: '100%',
                  borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                <span style={{ fontSize: 17, lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Usuário + Logout */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            background: 'var(--surface-2)',
            marginBottom: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--accent-subtle)',
              border: '1px solid var(--accent-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}>👤</div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.nome || user?.email}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            🚪 Sair da conta
          </button>
        </div>
      </aside>

      {/* ── Conteúdo principal ─────────────────────────────────── */}
      <main style={{
        flex: 1,
        marginLeft: 256,
        padding: '36px 40px',
        minHeight: '100vh',
        maxWidth: 'calc(100vw - 256px)',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.25s ease both',
      }}>
        {children}
      </main>
    </div>
  );
}

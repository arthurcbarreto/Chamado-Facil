import { useState, useEffect } from 'react';
import { listarChamados, listarAmbulancias, listarEquipes } from '../../services/api';
import { Card, Badge, PageHeader, Btn } from '../../components/UI';
import { navigate } from '../../context/Router';
import Loading from '../../components/Loading';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ chamados: [], ambulancias: [], equipes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listarChamados(), listarAmbulancias(), listarEquipes()])
      .then(([chamados, ambulancias, equipes]) => setStats({ chamados, ambulancias, equipes }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const { chamados, ambulancias, equipes } = stats;
  const chamadosAtivos = chamados.filter(c => c.status === 'ABERTO' || c.status === 'EM_ATENDIMENTO');
  const ambulanciasDisponiveis = ambulancias.filter(a => a.status === 'DISPONIVEL');

  if (loading) return <Loading />;

  const kpis = [
    { label: 'Chamados Ativos',         value: chamadosAtivos.length,         icon: '🔴', accent: true },
    { label: 'Total de Chamados',        value: chamados.length,               icon: '📋', accent: false },
    { label: 'Ambulâncias Disponíveis',  value: ambulanciasDisponiveis.length, icon: '✅', accent: false },
    { label: 'Frota Total',             value: ambulancias.length,            icon: '🚑', accent: false },
    { label: 'Equipes',                 value: equipes.length,                icon: '👥', accent: false },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.25s ease both' }}>
      <PageHeader title="Dashboard" subtitle="Visão geral do sistema de chamados" />

      {/* KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 14,
        marginBottom: 28,
      }}>
        {kpis.map(s => (
          <Card key={s.label} style={{
            padding: '18px 20px',
            borderLeft: s.accent ? '3px solid var(--accent)' : '3px solid transparent',
            transition: 'box-shadow 0.15s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{
                  fontSize: 28, fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: s.accent ? 'var(--accent)' : 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                  {s.label}
                </div>
              </div>
              <span style={{ fontSize: 22, opacity: 0.8 }}>{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Chamados recentes */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Chamados Recentes
            </h2>
            <Btn variant="ghost" size="sm" onClick={() => navigate('/admin/chamados')}>Ver todos</Btn>
          </div>
          {chamados.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Nenhum chamado ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...chamados].reverse().slice(0, 6).map(c => (
                <div key={c.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: 10,
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  transition: 'background 0.12s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Chamado #{c.id}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{c.usuarioCpf}</div>
                  </div>
                  <Badge label={c.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Status da frota */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Status da Frota
            </h2>
            <Btn variant="ghost" size="sm" onClick={() => navigate('/admin/ambulancias')}>Gerenciar</Btn>
          </div>
          {ambulancias.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Nenhuma ambulância cadastrada.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ambulancias.slice(0, 6).map(a => (
                <div key={a.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: 10,
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  transition: 'background 0.12s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{a.placa}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{a.tipo}</div>
                  </div>
                  <Badge label={a.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

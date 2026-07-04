import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { listarChamadosUsuario } from '../../services/api';
import { navigate } from '../../context/Router';
import { Card, Badge, Btn, EmptyState } from '../../components/UI';
import Loading from '../../components/Loading';

export default function UsuarioDashboard() {
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.cpf) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setLoading(true);
    listarChamadosUsuario(user.cpf)
      .then(setChamados)
      .catch(() => setChamados([]))
      .finally(() => setLoading(false));
  }, [user]);

  const recentes = chamados.slice(-5).reverse();
  const abertos = chamados.filter(c => c.status === 'ABERTO' || c.status === 'EM_ATENDIMENTO');

  return (
    <div style={{ animation: 'fadeIn 0.25s ease both' }}>

      {/* Boas-vindas */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, #b91c1c 100%)',
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 24,
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: '0 8px 32px rgba(220,38,38,0.25)',
      }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.01em' }}>
            Olá, {user?.nome?.split(' ')[0] || 'Usuário'}! 👋
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>
            {abertos.length > 0
              ? `Você tem ${abertos.length} chamado(s) em andamento.`
              : 'Você não tem chamados ativos no momento.'}
          </p>
        </div>
        <Btn
          onClick={() => navigate('/usuario/chamado')}
          style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--accent)', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        >
          🚨 Abrir Emergência
        </Btn>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
        gap: 14,
        marginBottom: 24,
      }}>
        {[
          { label: 'Total de Chamados', value: chamados.length, icon: '📋' },
          { label: 'Em Andamento',      value: abertos.length,  icon: '🔴' },
          { label: 'Concluídos',        value: chamados.filter(c => c.status === 'CONCLUIDO').length,  icon: '✅' },
          { label: 'Cancelados',        value: chamados.filter(c => c.status === 'CANCELADO').length,  icon: '❌' },
        ].map(s => (
          <Card key={s.label} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '18px 18px',
            transition: 'box-shadow 0.15s',
          }}>
            <span style={{ fontSize: 26 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chamados recentes */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Chamados Recentes
          </h2>
          <Btn variant="ghost" size="sm" onClick={() => navigate('/usuario/historico')}>Ver todos</Btn>
        </div>
        {loading ? <Loading /> : recentes.length === 0 ? (
          <EmptyState
            icon="📭"
            title="Nenhum chamado ainda"
            subtitle="Abra seu primeiro chamado de emergência quando precisar."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentes.map(c => <ChamadoRow key={c.id} chamado={c} />)}
          </div>
        )}
      </Card>
    </div>
  );
}

function ChamadoRow({ chamado }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '13px 16px', borderRadius: 10,
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      transition: 'background 0.12s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
    >
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
          Chamado #{chamado.id}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3, maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {chamado.sintomas ? chamado.sintomas.slice(0, 60) + '…' : 'Sem descrição'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {chamado.gravidade && <Badge label={chamado.gravidade} />}
        <Badge label={chamado.status} />
      </div>
    </div>
  );
}

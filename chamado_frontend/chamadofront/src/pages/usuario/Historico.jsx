import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listarChamadosUsuario, filtrarChamadosPorData } from '../../services/api';
import { toast } from '../../components/Toast';
import { Card, Badge, Input, Btn, PageHeader, EmptyState } from '../../components/UI';
import Loading from '../../components/Loading';

export default function Historico() {
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({ inicio: '', fim: '' });
  const [expandido, setExpandido] = useState(null);

  const carregar = () => {
    setLoading(true);
    listarChamadosUsuario(user.cpf)
      .then(data => setChamados([...data].reverse()))
      .catch(() => toast.error('Erro ao carregar histórico'))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { carregar(); }, []);

  const handleFiltrar = async () => {
    if (!filtro.inicio || !filtro.fim) { toast.error('Informe início e fim'); return; }
    setLoading(true);
    try {
      const data = await filtrarChamadosPorData(
        user.cpf,
        filtro.inicio + 'T00:00:00',
        filtro.fim + 'T23:59:59'
      );
      setChamados([...data].reverse());
    } catch {
      toast.error('Erro ao filtrar');
    } finally { setLoading(false); }
  };

  const handleLimpar = () => {
    setFiltro({ inicio: '', fim: '' });
    carregar();
  };

  return (
    <div>
      <PageHeader title="📋 Histórico de Chamados" subtitle={`${chamados.length} chamado(s) encontrado(s)`} />

      {/* Filtro por data */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Filtrar por período
        </h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <Input label="Data início" type="date" value={filtro.inicio} onChange={e => setFiltro(p => ({ ...p, inicio: e.target.value }))} />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <Input label="Data fim" type="date" value={filtro.fim} onChange={e => setFiltro(p => ({ ...p, fim: e.target.value }))} />
          </div>
          <Btn onClick={handleFiltrar}>Filtrar</Btn>
          <Btn variant="secondary" onClick={handleLimpar}>Limpar</Btn>
        </div>
      </Card>

      {/* Lista */}
      {loading ? <Loading /> : chamados.length === 0 ? (
        <EmptyState icon="📭" title="Nenhum chamado encontrado" subtitle="Você ainda não realizou nenhum chamado ou não há resultados para o filtro aplicado." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {chamados.map(c => (
            <Card key={c.id} style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setExpandido(expandido === c.id ? null : c.id)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 15 }}>
                    Chamado #{c.id}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                    {c.dataHoraPedido ? new Date(c.dataHoraPedido).toLocaleString('pt-BR') : 'Data não informada'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {c.gravidade && <Badge label={c.gravidade} />}
                  <Badge label={c.status} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: 18 }}>
                    {expandido === c.id ? '▲' : '▼'}
                  </span>
                </div>
              </button>

              {expandido === c.id && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {c.sintomas && (
                      <InfoRow label="Sintomas" value={c.sintomas} />
                    )}
                    {c.endereco && (
                      <InfoRow label="Endereço" value={`${c.endereco.logradouro}, ${c.endereco.numero} — ${c.endereco.bairro}, ${c.endereco.cidade}/${c.endereco.estado}`} />
                    )}
                    {c.dataHoraAtendimento && (
                      <InfoRow label="Início do atendimento" value={new Date(c.dataHoraAtendimento).toLocaleString('pt-BR')} />
                    )}
                    {c.dataHoraConclusao && (
                      <InfoRow label="Conclusão" value={new Date(c.dataHoraConclusao).toLocaleString('pt-BR')} />
                    )}
                    {c.ambulancias?.length > 0 && (
                      <InfoRow label="Ambulância(s)" value={c.ambulancias.map(a => `${a.placa} (${a.tipo})`).join(', ')} />
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-primary)' }}>{value}</p>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listarChamados, listarAmbulanciasDisponiveis, atribuirAmbulancia, concluirChamado, cancelarChamado } from '../../services/api';
import { toast } from '../../components/Toast';
import { Card, Badge, Btn, Select, PageHeader, EmptyState } from '../../components/UI';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';

export default function AdminChamados() {
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [modalAtribuir, setModalAtribuir] = useState(null); // chamado selecionado
  const [ambulanciasDisp, setAmbulancisaDisp] = useState([]);
  const [ambSelecionada, setAmbSelecionada] = useState('');

  const carregar = () => {
    listarChamados()
      .then(data => setChamados([...data].reverse()))
      .catch(() => toast.error('Erro ao carregar chamados'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const abrirModalAtribuir = async (chamado) => {
    setModalAtribuir(chamado);
    setAmbSelecionada('');
    try {
      // Tentar listar ambulâncias disponíveis — cnpj pode estar no chamado ou buscamos geral
      const disponiveis = await listarAmbulanciasDisponiveis(user?.cnpjEmpresa || '').catch(() => []);
      setAmbulancisaDisp(disponiveis);
    } catch { setAmbulancisaDisp([]); }
  };

  const handleAtribuir = async () => {
    if (!ambSelecionada) { toast.error('Selecione uma ambulância'); return; }
    try {
      await atribuirAmbulancia(modalAtribuir.id, ambSelecionada);
      toast.success('Ambulância atribuída!');
      setModalAtribuir(null);
      carregar();
    } catch (e) { toast.error(e.message || 'Erro ao atribuir ambulância'); }
  };

  const handleConcluir = async (id) => {
    if (!confirm('Concluir este chamado?')) return;
    try {
      await concluirChamado(id);
      toast.success('Chamado concluído');
      carregar();
    } catch (e) { toast.error(e.message || 'Erro'); }
  };

  const handleCancelar = async (id) => {
    if (!confirm('Cancelar este chamado?')) return;
    try {
      await cancelarChamado(id);
      toast.success('Chamado cancelado');
      carregar();
    } catch (e) { toast.error(e.message || 'Erro'); }
  };

  const statusOptions = ['TODOS', 'ABERTO', 'EM_ATENDIMENTO', 'CONCLUIDO', 'CANCELADO'].map(s => ({ value: s, label: s.replace(/_/g, ' ') }));
  const filtrados = filtroStatus === 'TODOS' ? chamados : chamados.filter(c => c.status === filtroStatus);

  return (
    <div>
      <PageHeader title="🚑 Chamados" subtitle={`${filtrados.length} chamado(s)`} />

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'flex-end' }}>
        <div style={{ minWidth: 200 }}>
          <Select label="Filtrar por status" options={statusOptions} value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} />
        </div>
        <Btn variant="secondary" onClick={carregar} size="sm">↻ Atualizar</Btn>
      </div>

      {loading ? <Loading /> : filtrados.length === 0 ? (
        <EmptyState icon="📭" title="Nenhum chamado" subtitle="Nenhum chamado encontrado para este filtro." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtrados.map(c => (
            <Card key={c.id} style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 16 }}>Chamado #{c.id}</span>
                    <Badge label={c.status} />
                    {c.gravidade && <Badge label={c.gravidade} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      👤 CPF: {c.cpfUsuario}
                    </span>
                    {c.sintomas && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>🩺 {c.sintomas.slice(0, 80)}{c.sintomas.length > 80 ? '...' : ''}</span>}
                    {c.dataHoraPedido && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>📅 {new Date(c.dataHoraPedido).toLocaleString('pt-BR')}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {c.status === 'ABERTO' && (
                    <Btn size="sm" onClick={() => abrirModalAtribuir(c)}>🚑 Atribuir</Btn>
                  )}
                  {(c.status === 'ABERTO' || c.status === 'EM_ATENDIMENTO') && (
                    <>
                      <Btn size="sm" variant="ghost" onClick={() => handleConcluir(c.id)}>✅ Concluir</Btn>
                      <Btn size="sm" variant="danger" onClick={() => handleCancelar(c.id)}>✕ Cancelar</Btn>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal atribuir ambulância */}
      {modalAtribuir && (
        <Modal title={`Atribuir Ambulância — Chamado #${modalAtribuir.id}`} onClose={() => setModalAtribuir(null)}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
            Selecione uma ambulância disponível para enviar a este chamado.
          </p>
          {ambulanciasDisp.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
              ⚠️ Nenhuma ambulância disponível no momento.
            </div>
          ) : (
            <Select
              label="Ambulância disponível"
              options={[{ value: '', label: 'Selecione...' }, ...ambulanciasDisp.map(a => ({ value: a.id, label: `${a.placa} — ${a.tipo}` }))]}
              value={ambSelecionada}
              onChange={e => setAmbSelecionada(e.target.value)}
            />
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Btn variant="secondary" onClick={() => setModalAtribuir(null)}>Cancelar</Btn>
            <Btn onClick={handleAtribuir} disabled={!ambSelecionada}>Confirmar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

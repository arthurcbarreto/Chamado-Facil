import { useState, useEffect } from 'react';
import {
  listarEquipes, criarEquipe, editarEquipe, deletarEquipe,
  listarAmbulancias, vincularEquipeAmbulancia, desvincularEquipe
} from '../../services/api';
import { toast } from '../../components/Toast';
import { Card, Btn, Input, PageHeader, EmptyState } from '../../components/UI';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';

const emptyForm = { nome: '', especialidade: '', membros: [] };

export default function AdminEquipes() {
  const [equipes, setEquipes] = useState([]);
  const [ambulancias, setAmbulancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [modalVincular, setModalVincular] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [membroInput, setMembroInput] = useState('');
  const [ambSelecionada, setAmbSelecionada] = useState('');
  const [saving, setSaving] = useState(false);

  const carregar = async () => {
    setLoading(true);
    try {
      const [eq, amb] = await Promise.all([listarEquipes(), listarAmbulancias()]);
      setEquipes(eq);
      setAmbulancias(amb);
    } catch { toast.error('Erro ao carregar dados'); }
    finally { setLoading(false); }
  };

  useEffect(() => { carregar(); }, []);

  const abrirCriar = () => { setForm(emptyForm); setMembroInput(''); setModal('criar'); };
  const abrirEditar = (e) => {
    setForm({ nome: e.nome, especialidade: e.especialidade, membros: e.membros || [] });
    setMembroInput('');
    setModal(e);
  };

  const f = (k) => (ev) => setForm(p => ({ ...p, [k]: ev.target.value }));

  const adicionarMembro = () => {
    if (!membroInput.trim()) return;
    setForm(p => ({ ...p, membros: [...p.membros, membroInput.trim()] }));
    setMembroInput('');
  };

  const removerMembro = (i) => setForm(p => ({ ...p, membros: p.membros.filter((_, idx) => idx !== i) }));

  const handleSalvar = async () => {
    if (!form.nome) { toast.error('Nome é obrigatório'); return; }
    setSaving(true);
    try {
      if (modal === 'criar') {
        await criarEquipe(form);
        toast.success('Equipe criada!');
      } else {
        await editarEquipe(modal.id, form);
        toast.success('Equipe atualizada!');
      }
      setModal(null);
      carregar();
    } catch (e) { toast.error(e.message || 'Erro'); }
    finally { setSaving(false); }
  };

  const handleDeletar = async (id) => {
    if (!confirm('Remover esta equipe?')) return;
    try {
      await deletarEquipe(id);
      toast.success('Equipe removida');
      carregar();
    } catch (e) { toast.error(e.message || 'Erro'); }
  };

  const handleVincular = async () => {
    if (!ambSelecionada) { toast.error('Selecione uma ambulância'); return; }
    try {
      await vincularEquipeAmbulancia(modalVincular.id, ambSelecionada);
      toast.success('Equipe vinculada!');
      setModalVincular(null);
      carregar();
    } catch (e) { toast.error(e.message || 'Erro'); }
  };

  const handleDesvincular = async (id) => {
    try {
      await desvincularEquipe(id);
      toast.success('Equipe desvinculada');
      carregar();
    } catch (e) { toast.error(e.message || 'Erro'); }
  };

  return (
    <div>
      <PageHeader
        title="👥 Equipes Médicas"
        subtitle={`${equipes.length} equipe(s) cadastrada(s)`}
        action={<Btn onClick={abrirCriar}>+ Nova Equipe</Btn>}
      />

      {loading ? <Loading /> : equipes.length === 0 ? (
        <EmptyState icon="👨‍⚕️" title="Nenhuma equipe cadastrada" subtitle="Cadastre equipes médicas para vinculá-las às ambulâncias." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {equipes.map(eq => (
            <Card key={eq.id}>
              <div style={{ marginBottom: 14 }}>
                <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--text-primary)' }}>{eq.nome}</h3>
                {eq.especialidade && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{eq.especialidade}</span>}
              </div>

              {eq.membros?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>MEMBROS</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {eq.membros.map((m, i) => (
                      <span key={i} style={{ padding: '3px 10px', borderRadius: 20, background: 'var(--surface-2)', fontSize: 12, color: 'var(--text-primary)', border: '1px solid var(--border)' }}>{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ← CORREÇÃO: usa idAmbulancia e placaAmbulancia em vez de eq.ambulancia */}
              {eq.idAmbulancia ? (
                <div style={{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 8, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>🚑 {eq.placaAmbulancia}</span>
                  <button onClick={() => handleDesvincular(eq.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 12, fontWeight: 600 }}>Desvincular</button>
                </div>
              ) : (
                <div style={{ padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8, marginBottom: 14, fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Sem ambulância vinculada
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                {!eq.idAmbulancia && (
                  <Btn size="sm" onClick={() => { setModalVincular(eq); setAmbSelecionada(''); }} style={{ flex: 1 }}>🔗 Vincular</Btn>
                )}
                <Btn size="sm" variant="secondary" onClick={() => abrirEditar(eq)}>✏️</Btn>
                <Btn size="sm" variant="danger" onClick={() => handleDeletar(eq.id)}>🗑️</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal criar/editar */}
      {modal !== null && (
        <Modal title={modal === 'criar' ? 'Nova Equipe' : 'Editar Equipe'} onClose={() => setModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Nome da equipe *" value={form.nome} onChange={f('nome')} placeholder="Ex: Equipe Alpha" />
            <Input label="Especialidade" value={form.especialidade} onChange={f('especialidade')} placeholder="Ex: Emergência, UTI..." />
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Membros</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  value={membroInput} onChange={e => setMembroInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && adicionarMembro()}
                  placeholder="Nome do membro..."
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14 }}
                />
                <Btn size="sm" onClick={adicionarMembro}>+</Btn>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {form.membros.map((m, i) => (
                  <span key={i} style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--surface-2)', fontSize: 13, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {m}
                    <button onClick={() => removerMembro(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 14, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn variant="secondary" onClick={() => setModal(null)}>Cancelar</Btn>
              <Btn loading={saving} onClick={handleSalvar}>Salvar</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal vincular ambulância */}
      {modalVincular && (
        <Modal title={`Vincular Equipe — ${modalVincular.nome}`} onClose={() => setModalVincular(null)}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>Selecione a ambulância a ser vinculada a esta equipe.</p>
          <select
            value={ambSelecionada} onChange={e => setAmbSelecionada(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-body)' }}
          >
            <option value="">Selecione...</option>
            {ambulancias.map(a => <option key={a.id} value={a.id}>{a.placa} — {a.tipo} ({a.status})</option>)}
          </select>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Btn variant="secondary" onClick={() => setModalVincular(null)}>Cancelar</Btn>
            <Btn onClick={handleVincular} disabled={!ambSelecionada}>Vincular</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { listarAmbulancias, criarAmbulancia, editarAmbulancia, removerAmbulancia, atualizarStatusAmbulancia } from '../../services/api';
import { toast } from '../../components/Toast';
import { Card, Badge, Btn, Input, Select, PageHeader, EmptyState, FormGrid } from '../../components/UI';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';

const tipoOptions = [{ value: 'SIMPLES', label: 'Simples' }, { value: 'UTI', label: 'UTI' }];
const statusOptions = [
  { value: 'DISPONIVEL', label: 'Disponível' },
  { value: 'EM_DESLOCAMENTO', label: 'Em Deslocamento' },
  { value: 'EM_ATENDIMENTO', label: 'Em Atendimento' },
  { value: 'MANUTENCAO', label: 'Manutenção' },
];

const emptyForm = { placa: '', tipo: 'SIMPLES', status: 'DISPONIVEL', cnpjEmpresa: '' };

export default function AdminAmbulancias() {
  const [ambulancias, setAmbulancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'criar' | ambulanciaObj (editar)
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const carregar = () => {
    setLoading(true);
    listarAmbulancias()
      .then(setAmbulancias)
      .catch(() => toast.error('Erro ao carregar frota'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const abrirCriar = () => { setForm(emptyForm); setModal('criar'); };
  const abrirEditar = (a) => {
    setForm({ placa: a.placa, tipo: a.tipo, status: a.status, cnpjEmpresa: a.cnpjEmpresa || '' });
    setModal(a);
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSalvar = async () => {
    if (!form.placa || !form.cnpjEmpresa) { toast.error('Placa e CNPJ da empresa são obrigatórios'); return; }
    setSaving(true);
    try {
      if (modal === 'criar') {
        await criarAmbulancia(form);
        toast.success('Ambulância cadastrada!');
      } else {
        await editarAmbulancia(modal.id, form);
        toast.success('Ambulância atualizada!');
      }
      setModal(null);
      carregar();
    } catch (e) { toast.error(e.message || 'Erro ao salvar'); }
    finally { setSaving(false); }
  };

  const handleRemover = async (id) => {
    if (!confirm('Remover esta ambulância?')) return;
    try {
      await removerAmbulancia(id);
      toast.success('Ambulância removida');
      carregar();
    } catch (e) { toast.error(e.message || 'Erro ao remover'); }
  };

  const handleStatus = async (id, status) => {
    try {
      await atualizarStatusAmbulancia(id, status);
      toast.success('Status atualizado');
      carregar();
    } catch (e) { toast.error(e.message || 'Erro ao atualizar status'); }
  };

  return (
    <div>
      <PageHeader
        title="🚒 Frota de Ambulâncias"
        subtitle={`${ambulancias.length} ambulância(s) cadastrada(s)`}
        action={<Btn onClick={abrirCriar}>+ Nova Ambulância</Btn>}
      />

      {loading ? <Loading /> : ambulancias.length === 0 ? (
        <EmptyState icon="🚑" title="Nenhuma ambulância cadastrada" subtitle="Cadastre sua primeira ambulância para começar a gerenciar a frota." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {ambulancias.map(a => (
            <Card key={a.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)' }}>{a.placa}</h3>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{a.tipo}</span>
                </div>
                <Badge label={a.status} />
              </div>

              {a.equipeMedica && (
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8 }}>
                  👥 Equipe: {a.equipeMedica.nome}
                </div>
              )}

              {/* Trocar status */}
              <div style={{ marginBottom: 16 }}>
                <select
                  value={a.status}
                  onChange={e => handleStatus(a.id, e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-body)' }}
                >
                  {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Btn size="sm" variant="secondary" onClick={() => abrirEditar(a)} style={{ flex: 1 }}>✏️ Editar</Btn>
                <Btn size="sm" variant="danger" onClick={() => handleRemover(a.id)}>🗑️</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal !== null && (
        <Modal title={modal === 'criar' ? 'Nova Ambulância' : 'Editar Ambulância'} onClose={() => setModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormGrid>
              <Input label="Placa *" placeholder="ABC-1234" value={form.placa} onChange={f('placa')} />
              <Input label="CNPJ da Empresa *" placeholder="Somente números (14 dígitos)" inputMode="numeric" maxLength={14} value={form.cnpjEmpresa} onChange={e => setForm(p => ({ ...p, cnpjEmpresa: e.target.value.replace(/\D/g, '') }))} />
              <Select label="Tipo" options={tipoOptions} value={form.tipo} onChange={f('tipo')} />
              <Select label="Status" options={statusOptions} value={form.status} onChange={f('status')} />
            </FormGrid>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Btn variant="secondary" onClick={() => setModal(null)}>Cancelar</Btn>
              <Btn loading={saving} onClick={handleSalvar}>Salvar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

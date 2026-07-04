import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listarPlanos, criarPlano, vincularUsuarioPlano } from '../../services/api';
import { toast } from '../../components/Toast';
import { Card, Btn, Input, PageHeader, EmptyState } from '../../components/UI';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';

export default function AdminPlanos() {
  const { user } = useAuth();
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalVincular, setModalVincular] = useState(null); // plano selecionado
  const [form, setForm] = useState({ nome: '', descricao: '', cnpjEmpresa: '' });
  const [cpfUsuario, setCpfUsuario] = useState('');
  const [saving, setSaving] = useState(false);

  const carregar = () => {
    setLoading(true);
    listarPlanos().then(setPlanos).catch(() => toast.error('Erro ao carregar planos')).finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleCriar = async () => {
    if (!form.nome || !form.cnpjEmpresa) { toast.error('Nome e CNPJ são obrigatórios'); return; }
    setSaving(true);
    try {
      await criarPlano(form);
      toast.success('Plano criado!');
      setModalCriar(false);
      setForm({ nome: '', descricao: '', cnpjEmpresa: '' });
      carregar();
    } catch (e) { toast.error(e.message || 'Erro ao criar plano'); }
    finally { setSaving(false); }
  };

  const handleVincular = async () => {
    if (!cpfUsuario) { toast.error('Informe o CPF do usuário'); return; }
    setSaving(true);
    try {
      await vincularUsuarioPlano(user.id, modalVincular.id, cpfUsuario);
      toast.success('Usuário vinculado ao plano!');
      setModalVincular(null);
      setCpfUsuario('');
    } catch (e) { toast.error(e.message || 'Erro ao vincular usuário'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader
        title="📋 Planos"
        subtitle={`${planos.length} plano(s) cadastrado(s)`}
        action={<Btn onClick={() => setModalCriar(true)}>+ Novo Plano</Btn>}
      />

      {loading ? <Loading /> : planos.length === 0 ? (
        <EmptyState icon="📝" title="Nenhum plano cadastrado" subtitle="Crie planos e vincule usuários a eles." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {planos.map(p => (
            <Card key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)' }}>{p.nome}</h3>
                {p.descricao && <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.descricao}</p>}
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <Btn size="sm" variant="ghost" onClick={() => { setModalVincular(p); setCpfUsuario(''); }} style={{ width: '100%' }}>
                  👤 Vincular Usuário
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal criar plano */}
      {modalCriar && (
        <Modal title="Novo Plano" onClose={() => setModalCriar(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Nome do plano *" value={form.nome} onChange={f('nome')} placeholder="Ex: Plano Básico" />
            <Input label="CNPJ da Empresa *" placeholder="Somente números (14 dígitos)" inputMode="numeric" maxLength={14} value={form.cnpjEmpresa} onChange={e => setForm(p => ({ ...p, cnpjEmpresa: e.target.value.replace(/\D/g, '') }))} />
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Descrição</label>
              <textarea
                value={form.descricao} onChange={f('descricao')}
                placeholder="Descreva o plano..."
                rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-body)', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn variant="secondary" onClick={() => setModalCriar(false)}>Cancelar</Btn>
              <Btn loading={saving} onClick={handleCriar}>Criar Plano</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal vincular usuário */}
      {modalVincular && (
        <Modal title={`Vincular Usuário — ${modalVincular.nome}`} onClose={() => setModalVincular(null)}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
            Informe o CPF do usuário que deseja vincular a este plano.
          </p>
          <Input label="CPF do usuário *" placeholder="Somente números (11 dígitos)" inputMode="numeric" maxLength={11} value={cpfUsuario} onChange={e => setCpfUsuario(e.target.value.replace(/\D/g, ''))} />
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Btn variant="secondary" onClick={() => setModalVincular(null)}>Cancelar</Btn>
            <Btn loading={saving} onClick={handleVincular}>Vincular</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

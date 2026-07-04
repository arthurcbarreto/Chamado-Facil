import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { editarUsuario } from '../../services/api';
import { toast } from '../../components/Toast';
import { Card, Input, Btn, PageHeader, FormGrid, Badge } from '../../components/UI';

export default function Perfil() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    senha: '',
    dataNascimento: user?.dataNascimento || '',
  });

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSalvar = async () => {
    if (!form.nome || !form.email) { toast.error('Nome e e-mail são obrigatórios'); return; }
    setLoading(true);
    try {
      const payload = { ...form, idPlano: user?.idPlano };
      if (!payload.senha) delete payload.senha;
      const updated = await editarUsuario(user.cpf, payload);
      login({ ...user, ...updated });
      toast.success('Perfil atualizado!');
      setEditing(false);
    } catch (e) {
      toast.error(e.message || 'Erro ao atualizar perfil');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader
        title="👤 Meu Perfil"
        subtitle="Gerencie suas informações pessoais"
        action={!editing && <Btn variant="ghost" onClick={() => setEditing(true)}>✏️ Editar</Btn>}
      />

      <Card>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#fff', fontWeight: 700,
          }}>
            {user?.nome?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)' }}>{user?.nome}</h2>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>{user?.email}</p>
            {user?.nomePlano && (
              <Badge label={user.nomePlano} />
          )}
          </div>
        </div>

        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormGrid>
              <div style={{ gridColumn: '1 / -1' }}>
                <Input label="Nome completo" value={form.nome} onChange={f('nome')} />
              </div>
              <Input label="E-mail" type="email" value={form.email} onChange={f('email')} />
              <Input label="Data de nascimento" type="date" value={form.dataNascimento} onChange={f('dataNascimento')} />
              <div style={{ gridColumn: '1 / -1' }}>
                <Input label="Nova senha (deixe em branco para manter)" type="password" placeholder="••••••••" value={form.senha} onChange={f('senha')} />
              </div>
            </FormGrid>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Btn variant="secondary" onClick={() => setEditing(false)}>Cancelar</Btn>
              <Btn loading={loading} onClick={handleSalvar}>Salvar alterações</Btn>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InfoRow label="CPF" value={user?.cpf} />
            <InfoRow label="Nome" value={user?.nome} />
            <InfoRow label="E-mail" value={user?.email} />
            <InfoRow label="Nascimento" value={user?.dataNascimento ? formatDataBR(user.dataNascimento) : '—'} />
            <InfoRow label="Plano" value={user?.nomePlano || 'Sem plano'} />
          </div>
        )}
      </Card>
    </div>
  );
}

function formatDataBR(data) {
  // Evita o bug de fuso horário: extrai apenas a parte YYYY-MM-DD
  // e monta a data manualmente, sem passar por new Date() (que assume UTC
  // e desloca um dia para trás em fusos negativos, como o do Brasil).
  const [ano, mes, dia] = String(data).split('T')[0].split('-');
  if (!ano || !mes || !dia) return '—';
  return `${dia}/${mes}/${ano}`;
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--text-primary)', textAlign: 'right' }}>{value || '—'}</span>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { criarUsuario, listarPlanos } from '../services/api';
import { navigate } from '../context/Router';
import { toast } from '../components/Toast';
import { Btn, Input, Select, FormGrid } from '../components/UI';

export default function CadastroPage() {
  const [form, setForm] = useState({ cpf: '', nome: '', dataNascimento: '', email: '', senha: '', planoId: '' });
  const [planos, setPlanos] = useState([]);
  const [planosLoading, setPlanosLoading] = useState(true);
  const [planosErro, setPlanosErro] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPlanosLoading(true);
    setPlanosErro(false);
    listarPlanos()
      .then((data) => { setPlanos(Array.isArray(data) ? data : []); })
      .catch(() => { setPlanosErro(true); setPlanos([]); })
      .finally(() => setPlanosLoading(false));
  }, []);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    const { cpf, nome, dataNascimento, email, senha } = form;
    if (!cpf || !nome || !dataNascimento || !email || !senha) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    if (!form.planoId) {
      toast.error('Selecione um plano para continuar');
      return;
    }
    setLoading(true);
    try {
      const { planoId, ...rest } = form;
      await criarUsuario({ ...rest, idPlano: planoId || null });
      toast.success('Conta criada com sucesso!');
      navigate('/');
    } catch (e) {
      toast.error(e.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const planoSelecionado = planos.find(p => String(p.id) === String(form.planoId));

  const planoOptions = [
    { value: '', label: planosLoading ? 'Carregando planos…' : 'Selecione um plano *' },
    ...planos.map(p => ({ value: p.id, label: p.nome })),
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Voltar */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none',
            color: 'var(--text-secondary)', cursor: 'pointer',
            fontSize: 14, marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-body)', fontWeight: 500,
            padding: 0, transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          ← Voltar ao login
        </button>

        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: 14,
            background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
            fontSize: 24, marginBottom: 14,
          }}>👤</div>
          <h1 style={{
            margin: 0, fontFamily: 'var(--font-display)',
            fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.02em',
          }}>Criar Conta</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: 14 }}>
            Cadastre-se para usar o ChamadoFácil
          </p>
        </div>

        {/* Card do formulário */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 20,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          padding: '32px 28px',
          animation: 'fadeUp 0.25s ease both',
        }}>
          <FormGrid>
            <div>
              <Input label="CPF *" placeholder="Somente números (11 dígitos)" inputMode="numeric" maxLength={11} value={form.cpf} onChange={e => setForm(p => ({ ...p, cpf: e.target.value.replace(/\D/g, '') }))} />
            </div>
            <div>
              <Input label="Nome completo *" placeholder="Seu nome" value={form.nome} onChange={f('nome')} />
            </div>
            <div>
              <Input label="Data de nascimento *" type="date" value={form.dataNascimento} onChange={f('dataNascimento')} />
            </div>
            <div>
              <Input label="E-mail *" type="email" placeholder="seu@email.com" value={form.email} onChange={f('email')} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Senha *" type="password" placeholder="••••••••" value={form.senha} onChange={f('senha')} />
            </div>

            {/* Plano */}
            <div style={{ gridColumn: '1 / -1' }}>
              <Select
                label="Plano"
                options={planoOptions}
                value={form.planoId}
                onChange={f('planoId')}
                disabled={planosLoading}
              />

              {planosErro && (
                <p style={{
                  margin: '8px 0 0', fontSize: 12,
                  color: '#b45309',
                  background: '#fefce8', border: '1px solid #fde68a',
                  borderRadius: 8, padding: '8px 12px',
                  display: 'flex', alignItems: 'flex-start', gap: 6,
                  lineHeight: 1.5,
                }}>
                  ⚠️ Não foi possível carregar os planos. Você pode se cadastrar sem plano e vincular depois.
                </p>
              )}

              {planoSelecionado && (
                <div style={{
                  marginTop: 10, padding: '12px 16px',
                  borderRadius: 10,
                  background: 'var(--accent-subtle)',
                  border: '1px solid var(--accent-border)',
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                    📋 {planoSelecionado.nome}
                  </span>
                  {planoSelecionado.descricao && (
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {planoSelecionado.descricao}
                    </span>
                  )}
                </div>
              )}
            </div>
          </FormGrid>

          <Btn loading={loading} onClick={handleSubmit} size="lg" style={{ width: '100%', marginTop: 24 }}>
            Criar conta
          </Btn>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Já tem conta?{' '}
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)', fontSize: 13 }}
          >
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUsuario, loginAdmin, buscarUsuario, listarAdmins, recuperarSenha } from '../services/api';
import { navigate } from '../context/Router';
import { toast } from '../components/Toast';
import { Btn, Input } from '../components/UI';

export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState('landing');
  const [form, setForm] = useState({ email: '', senha: '', cpf: '' });
  const [recForm, setRecForm] = useState({ cpf: '', email: '', novaSenha: '', confirmarSenha: '' });
  const [loading, setLoading] = useState(false);

  const handleUsuario = async () => {
    if (!form.email || !form.senha) { toast.error('Preencha e-mail e senha'); return; }
    setLoading(true);
    try {
      const res = await loginUsuario(form.email, form.senha);
      if (!res.ok) { toast.error('Credenciais inválidas'); return; }
      if (!form.cpf) { toast.error('Informe seu CPF para continuar'); return; }
      const usuario = await buscarUsuario(form.cpf);
      login({ role: 'usuario', ...usuario });
      navigate('/usuario/dashboard');
    } catch (e) {
      toast.error(e.message || 'Erro ao fazer login');
    } finally { setLoading(false); }
  };

  const handleAdmin = async () => {
    if (!form.email || !form.senha) { toast.error('Preencha e-mail e senha'); return; }
    setLoading(true);
    try {
      const res = await loginAdmin(form.email, form.senha);
      if (!res.ok) { toast.error('Credenciais inválidas'); return; }
      const admins = await listarAdmins();
      const admin = admins.find(a => a.email === form.email);
      if (!admin) { toast.error('Admin não encontrado'); return; }
      login({ role: 'admin', ...admin });
      navigate('/admin/dashboard');
    } catch (e) {
      toast.error(e.message || 'Erro ao fazer login');
    } finally { setLoading(false); }
  };

  const handleRecuperarSenha = async () => {
    if (!recForm.cpf || !recForm.email || !recForm.novaSenha || !recForm.confirmarSenha) {
      toast.error('Preencha todos os campos'); return;
    }
    if (recForm.novaSenha !== recForm.confirmarSenha) {
      toast.error('As senhas não coincidem'); return;
    }
    setLoading(true);
    try {
      await recuperarSenha(recForm.cpf, recForm.email, recForm.novaSenha);
      toast.success('Senha alterada com sucesso! Faça login.');
      setMode('usuario');
      setRecForm({ cpf: '', email: '', novaSenha: '', confirmarSenha: '' });
    } catch (e) {
      toast.error(e.message || 'Dados não conferem. Verifique CPF e e-mail.');
    } finally { setLoading(false); }
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const rf = (k) => (e) => setRecForm(p => ({ ...p, [k]: e.target.value }));

  if (mode === 'landing') return <LandingView setMode={setMode} />;

  // ── Tela de recuperar senha ──────────────────────────────
  if (mode === 'recuperar') return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <button
          onClick={() => setMode('usuario')}
          style={{
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 14, marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-body)', fontWeight: 500, padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >← Voltar ao login</button>

        <div style={{
          background: 'var(--surface)', borderRadius: 20,
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)',
          padding: '36px 32px', animation: 'fadeUp 0.25s ease both',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 60, height: 60, borderRadius: 16,
              background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
              marginBottom: 16, fontSize: 26,
            }}>🔑</div>
            <h1 style={{
              margin: 0, fontFamily: 'var(--font-display)',
              fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.02em',
            }}>Recuperar Senha</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: 14 }}>
              Informe seu CPF e e-mail cadastrados
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="CPF" placeholder="Somente números (11 dígitos)" inputMode="numeric" maxLength={11} value={recForm.cpf} onChange={e => setRecForm(p => ({ ...p, cpf: e.target.value.replace(/\D/g, '') }))} />
            <Input label="E-mail cadastrado" type="email" placeholder="seu@email.com" value={recForm.email} onChange={rf('email')} />
            <Input label="Nova senha" type="password" placeholder="••••••••" value={recForm.novaSenha} onChange={rf('novaSenha')} />
            <Input label="Confirmar nova senha" type="password" placeholder="••••••••" value={recForm.confirmarSenha} onChange={rf('confirmarSenha')} />
            <Btn size="lg" loading={loading} onClick={handleRecuperarSenha} style={{ marginTop: 4, width: '100%' }}>
              Alterar senha
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Tela de login (usuário ou admin) ─────────────────────
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <button
          onClick={() => setMode('landing')}
          style={{
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 14, marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-body)', fontWeight: 500, padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >← Voltar</button>

        <div style={{
          background: 'var(--surface)', borderRadius: 20,
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)',
          padding: '36px 32px', animation: 'fadeUp 0.25s ease both',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 60, height: 60, borderRadius: 16,
              background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
              marginBottom: 16, fontSize: 26,
            }}>
              {mode === 'usuario' ? '🚑' : '🛡️'}
            </div>
            <h1 style={{
              margin: 0, fontFamily: 'var(--font-display)',
              fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.02em',
            }}>
              {mode === 'usuario' ? 'Área do Usuário' : 'Área do Administrador'}
            </h1>
            <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: 14 }}>
              Faça login para continuar
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="E-mail" type="email" placeholder="seu@email.com" value={form.email} onChange={f('email')} />
            <Input label="Senha" type="password" placeholder="••••••••" value={form.senha} onChange={f('senha')} />
            {mode === 'usuario' && (
            <Input label="CPF" placeholder="Somente números (11 dígitos)" inputMode="numeric" maxLength={11} value={form.cpf} onChange={e => setForm(p => ({ ...p, cpf: e.target.value.replace(/\D/g, '') }))} />
            )}
            <Btn
              size="lg" loading={loading}
              onClick={mode === 'usuario' ? handleUsuario : handleAdmin}
              style={{ marginTop: 4, width: '100%' }}
            >
              Entrar
            </Btn>
          </div>

          {mode === 'usuario' && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button
                onClick={() => setMode('recuperar')}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)',
                  textDecoration: 'underline',
                }}
              >
                Esqueceu a senha?
              </button>
              <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-secondary)' }}>
                Não tem conta?{' '}
                <button
                  onClick={() => navigate('/cadastro')}
                  style={{
                    background: 'none', border: 'none', color: 'var(--accent)',
                    cursor: 'pointer', fontWeight: 600,
                    fontFamily: 'var(--font-body)', fontSize: 14,
                  }}
                >
                  Cadastre-se
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LandingView({ setMode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 64px', textAlign: 'center',
        background: 'linear-gradient(160deg, #fff 0%, var(--bg) 60%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ fontSize: 64, marginBottom: 20, lineHeight: 1 }}>🚑</div>

        <h1 style={{
          margin: '0 0 14px', fontFamily: 'var(--font-display)',
          fontSize: 'clamp(34px, 5.5vw, 52px)',
          color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.03em',
        }}>
          Chamado<span style={{ color: 'var(--accent)' }}>Fácil</span>
        </h1>

        <p style={{
          margin: '0 0 44px', fontSize: 17,
          color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.65,
        }}>
          Atendimento emergencial mais rápido, seguro e eficiente para empresas privadas de saúde.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setMode('usuario')}
            style={{
              padding: '14px 36px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'var(--accent)', color: '#fff',
              fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-body)',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(220,38,38,0.28)',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(220,38,38,0.32)'; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 16px rgba(220,38,38,0.28)'; }}
          >
            Sou Usuário
          </button>
          <button
            onClick={() => setMode('admin')}
            style={{
              padding: '14px 36px', borderRadius: 12,
              border: '1.5px solid var(--border)', cursor: 'pointer',
              background: 'var(--surface)', color: 'var(--text-primary)',
              fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-body)',
              transition: 'all 0.2s ease', boxShadow: 'var(--shadow-sm)',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            Sou Administrador
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: 1, borderTop: '1px solid var(--border)',
        background: 'var(--border)', overflow: 'hidden',
      }}>
        {[
          { icon: '⚡', title: 'Resposta Rápida',     desc: 'Chamados processados em segundos' },
          { icon: '📍', title: 'Localização Precisa', desc: 'Endereço registrado com precisão' },
          { icon: '🛡️', title: 'Seguro e Privado',    desc: 'Dados protegidos pela LGPD' },
          { icon: '🚒', title: 'Frota Gerenciada',    desc: 'Ambulâncias sempre prontas' },
        ].map(item => (
          <div key={item.title} style={{
            textAlign: 'center', padding: '32px 24px',
            background: 'var(--surface)', transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
            <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 15 }}>{item.title}</h3>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
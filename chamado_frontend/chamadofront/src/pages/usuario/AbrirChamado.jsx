import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { abrirChamado } from '../../services/api';
import { navigate } from '../../context/Router';
import { toast } from '../../components/Toast';
import { Btn, Input, Select, Card, Badge, PageHeader } from '../../components/UI';

const gravidadeOptions = [
  { value: 'BAIXA', label: '🟢 Baixa — Situação estável' },
  { value: 'MEDIA', label: '🟡 Média — Requer atenção' },
  { value: 'ALTA', label: '🟠 Alta — Urgente' },
  { value: 'CRITICA', label: '🔴 Crítica — Emergência máxima' },
];

export default function AbrirChamado() {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: sintomas | 2: endereço | 3: confirmação
  const [loading, setLoading] = useState(false);
  const [chamadoAberto, setChamadoAberto] = useState(null);

  const [dados, setDados] = useState({
    sintomas: '', gravidade: 'MEDIA',
    logradouro: '', numero: '', bairro: '', cidade: '', estado: '', cep: '',
  });

  const f = (k) => (e) => setDados(p => ({ ...p, [k]: e.target.value }));

  const handleAbrir = async () => {
    const { sintomas, logradouro, numero, bairro, cidade, estado, cep } = dados;
    if (!sintomas) { toast.error('Descreva os sintomas'); return; }
    if (!logradouro || !numero || !bairro || !cidade || !estado || !cep) { toast.error('Preencha o endereço completo incluindo o CEP'); return; }

    setLoading(true);
    try {
      const payload = {
        cpfUsuario: user.cpf,
        sintomas: dados.sintomas,
        gravidade: dados.gravidade,
        endereco: { logradouro, numero, bairro, cidade, estado, cep },
      };
      const chamado = await abrirChamado(payload);
      setChamadoAberto(chamado);
      setStep(4);
      toast.success('Chamado aberto! Auxílio a caminho.');
    } catch (e) {
      toast.error(e.message || 'Erro ao abrir chamado');
    } finally { setLoading(false); }
  };

  if (step === 4 && chamadoAberto) {
    return <Confirmacao chamado={chamadoAberto} />;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <PageHeader title="🚨 Abrir Chamado de Emergência" subtitle="Preencha as informações com cuidado" />

      {/* Progress */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {['Sintomas', 'Localização', 'Confirmação'].map((label, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }} onClick={() => i + 1 < step && setStep(i + 1)}>
            <div style={{ height: 4, borderRadius: 4, background: step > i + 1 ? 'var(--accent)' : step === i + 1 ? 'var(--accent)' : 'var(--border)', opacity: step > i + 1 ? 0.6 : 1 }} />
            <span style={{ fontSize: 12, color: step === i + 1 ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: step === i + 1 ? 600 : 400 }}>{label}</span>
          </div>
        ))}
      </div>

      <Card>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 20 }}>O que está acontecendo?</h2>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Descrição dos sintomas *</label>
              <textarea
                value={dados.sintomas} onChange={f('sintomas')}
                placeholder="Descreva os sintomas, o que aconteceu, há quanto tempo..."
                rows={5}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)',
                  background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: 15,
                  fontFamily: 'var(--font-body)', resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <Select label="Nível de gravidade" options={gravidadeOptions} value={dados.gravidade} onChange={f('gravidade')} />
            <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 16, borderLeft: '4px solid var(--accent)' }}>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
                ⚠️ Use este sistema apenas para emergências reais. Trotes prejudicam quem realmente precisa de socorro.
              </p>
            </div>
            <Btn onClick={() => { if (!dados.sintomas) { toast.error('Descreva os sintomas'); return; } setStep(2); }} size="lg">
              Continuar →
            </Btn>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 20 }}>Onde está ocorrendo?</h2>
            <Input label="Logradouro *" placeholder="Rua, Avenida, Travessa..." value={dados.logradouro} onChange={f('logradouro')} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="Número *" placeholder="123" value={dados.numero} onChange={f('numero')} />
              <Input label="Bairro *" placeholder="Centro" value={dados.bairro} onChange={f('bairro')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <Input label="Cidade *" placeholder="Salvador" value={dados.cidade} onChange={f('cidade')} />
              <Input label="Estado *" placeholder="BA" value={dados.estado} onChange={f('estado')} maxLength={2} />
            </div>
            <Input label="CEP *" placeholder="Somente números (8 dígitos)" inputMode="numeric" maxLength={8} value={dados.cep} onChange={e => setDados(p => ({ ...p, cep: e.target.value.replace(/\D/g, '') }))} />
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn variant="secondary" onClick={() => setStep(1)}>← Voltar</Btn>
              <Btn onClick={() => {
                const { logradouro, numero, bairro, cidade, estado, cep } = dados;
                if (!logradouro || !numero || !bairro || !cidade || !estado || !cep) { toast.error('Preencha o endereço completo incluindo o CEP'); return; }
                setStep(3);
              }} style={{ flex: 1 }}>Revisar →</Btn>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 20 }}>Confirme as informações</h2>
            <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Row label="Sintomas" value={dados.sintomas} />
              <Row label="Gravidade" value={<Badge label={dados.gravidade} />} />
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <Row label="Endereço" value={`${dados.logradouro}, ${dados.numero}`} />
              <Row label="Bairro" value={dados.bairro} />
              <Row label="CEP" value={dados.cep} />
              <Row label="Cidade/Estado" value={`${dados.cidade} - ${dados.estado}`} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn variant="secondary" onClick={() => setStep(2)}>← Voltar</Btn>
              <Btn variant="danger" loading={loading} onClick={handleAbrir} style={{ flex: 1 }}>
                🚨 Confirmar e Enviar Chamado
              </Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, minWidth: 100 }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--text-primary)', textAlign: 'right', flex: 1 }}>{value}</span>
    </div>
  );
}

function Confirmacao({ chamado }) {
  return (
    <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
      <div style={{ fontSize: 80, marginBottom: 24 }}>✅</div>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 28, marginBottom: 12 }}>
        Chamado Enviado!
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32 }}>
        Seu chamado #{chamado.id} foi registrado. Uma ambulância será enviada assim que possível.
      </p>
      <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: 24, marginBottom: 32, textAlign: 'left' }}>
        <Row label="ID do Chamado" value={`#${chamado.id}`} />
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />
        <Row label="Status" value={<Badge label={chamado.status} />} />
        {chamado.gravidade && <><hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} /><Row label="Gravidade" value={<Badge label={chamado.gravidade} />} /></>}
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Btn onClick={() => navigate('/usuario/historico')} variant="ghost">Ver Histórico</Btn>
        <Btn onClick={() => navigate('/usuario/dashboard')}>Voltar ao Início</Btn>
      </div>
    </div>
  );
}

const BASE_URL = 'http://localhost:8080';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) {
    const msg = await response.text().catch(() => 'Erro na requisição');
    throw new Error(msg || `HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

// ─── AUTENTICAÇÃO ────────────────────────────────────────────────────────────
export const loginUsuario = (email, senha) =>
  fetch(`${BASE_URL}/usuarios/login?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`, { method: 'POST' })
    .then(r => ({ ok: r.ok, status: r.status, text: r.text() }));

export const loginAdmin = (email, senha) =>
  fetch(`${BASE_URL}/administradores/login?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`, { method: 'POST' })
    .then(r => ({ ok: r.ok, status: r.status, text: r.text() }));

// ─── USUÁRIOS ────────────────────────────────────────────────────────────────
export const criarUsuario = (data) => request('/usuarios', { method: 'POST', body: JSON.stringify(data) });
export const buscarUsuario = (cpf) => request(`/usuarios/${cpf}`);
export const editarUsuario = (cpf, data) => request(`/usuarios/${cpf}`, { method: 'PUT', body: JSON.stringify(data) });
export const recuperarSenha = (cpf, email, novaSenha) =>
  request(`/usuarios/recuperar-senha?cpf=${encodeURIComponent(cpf)}&email=${encodeURIComponent(email)}&novaSenha=${encodeURIComponent(novaSenha)}`, { method: 'PATCH' });
export const listarChamadosUsuario = (cpf) => request(`/usuarios/${cpf}/chamados`);
export const filtrarChamadosPorData = (cpf, inicio, fim) =>
  request(`/usuarios/${cpf}/chamados/filtrar?inicio=${inicio}&fim=${fim}`);

// ─── CHAMADOS ────────────────────────────────────────────────────────────────
export const listarChamados = () => request('/chamados');
export const buscarChamado = (id) => request(`/chamados/${id}`);
export const abrirChamado = (data) => request('/chamados', { method: 'POST', body: JSON.stringify(data) });
export const concluirChamado = (id) => request(`/chamados/${id}/concluir`, { method: 'PATCH' });
export const cancelarChamado = (id) => request(`/chamados/${id}/cancelar`, { method: 'PATCH' });
export const atribuirAmbulancia = (idChamado, idAmbulancia) =>
  request(`/chamados/${idChamado}/ambulancia/${idAmbulancia}`, { method: 'PATCH' });

// ─── AMBULÂNCIAS ─────────────────────────────────────────────────────────────
export const listarAmbulancias = () => request('/ambulancias');
export const listarAmbulanciasEmpresa = (cnpj) => 
  request(`/ambulancias/empresa?cnpj=${encodeURIComponent(cnpj)}`);

export const listarAmbulanciasDisponiveis = (cnpj) => 
  request(`/ambulancias/empresa/disponiveis?cnpj=${encodeURIComponent(cnpj)}`);
export const criarAmbulancia = (data) => request('/ambulancias', { method: 'POST', body: JSON.stringify(data) });
export const editarAmbulancia = (id, data) => request(`/ambulancias/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const removerAmbulancia = (id) => request(`/ambulancias/${id}`, { method: 'DELETE' });
export const atualizarStatusAmbulancia = (id, status) =>
  request(`/ambulancias/${id}/status?status=${status}`, { method: 'PATCH' });

// ─── EQUIPES MÉDICAS ─────────────────────────────────────────────────────────
export const listarEquipes = () => request('/equipes');
export const listarEquipesDisponiveis = () => request('/equipes/disponiveis');
export const criarEquipe = (data) => request('/equipes', { method: 'POST', body: JSON.stringify(data) });
export const editarEquipe = (id, data) => request(`/equipes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletarEquipe = (id) => request(`/equipes/${id}`, { method: 'DELETE' });
export const vincularEquipeAmbulancia = (idEquipe, idAmbulancia) =>
  request(`/equipes/${idEquipe}/vincular/${idAmbulancia}`, { method: 'PATCH' });
export const desvincularEquipe = (idEquipe) =>
  request(`/equipes/${idEquipe}/desvincular`, { method: 'PATCH' });

// ─── ADMINISTRADORES ─────────────────────────────────────────────────────────
export const listarAdmins = () => request('/administradores');
export const criarAdmin = (data) => request('/administradores', { method: 'POST', body: JSON.stringify(data) });
export const buscarAdmin = (id) => request(`/administradores/${id}`);

// ─── PLANOS ──────────────────────────────────────────────────────────────────
export const listarPlanos = () => request('/planos');
export const criarPlano = (data) => request('/planos', { method: 'POST', body: JSON.stringify(data) });
export const vincularUsuarioPlano = (idAdmin, idPlano, cpf) =>
  request(`/administradores/${idAdmin}/planos/${idPlano}/usuarios/${cpf}`, { method: 'PATCH' });

// ─── EMPRESAS ────────────────────────────────────────────────────────────────
export const listarEmpresas = () => request('/empresas');
export const buscarEmpresa = (cnpj) => request(`/empresas/${cnpj}`);
export const criarEmpresa = (data) => request('/empresas', { method: 'POST', body: JSON.stringify(data) });

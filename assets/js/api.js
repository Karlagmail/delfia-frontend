// assets/js/api.js — Cliente da API Delfiaapp

const API_URL = window.DELFIAAPP_API || 'https://web-production-e0bfa.up.railway.app';

const Api = {
  // ============================================================
  // BASE
  // ============================================================
  token() { return localStorage.getItem('da_token'); },

  usuario() {
    try { return JSON.parse(localStorage.getItem('da_usuario')); }
    catch { return null; }
  },

  async req(method, path, body = null) {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token()}`,
      },
    };
    if (body) opts.body = JSON.stringify(body);

    try {
      const res = await fetch(`${API_URL}${path}`, opts);

      // Token expirado ou inválido
      if (res.status === 401) {
        localStorage.removeItem('da_token');
        localStorage.removeItem('da_usuario');
        window.location.href = 'index.html';
        return null;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || data.mensagem || `Erro ${res.status}`);
      return data;
    } catch (err) {
      if (err.message.includes('fetch')) throw new Error('Sem conexão com o servidor');
      throw err;
    }
  },

  get:    (path)        => Api.req('GET',    path),
  post:   (path, body)  => Api.req('POST',   path, body),
  put:    (path, body)  => Api.req('PUT',    path, body),
  delete: (path)        => Api.req('DELETE', path),

  // ============================================================
  // AUTH
  // ============================================================
  auth: {
    me:     ()            => Api.get('/api/auth/me'),
    senha:  (body)        => Api.put('/api/auth/senha', body),
  },

  // ============================================================
  // PRODUTOS
  // ============================================================
  produtos: {
    listar:    (ativo)    => Api.get(`/api/produtos${ativo !== undefined ? `?ativo=${ativo}` : ''}`),
    buscar:    (id)       => Api.get(`/api/produtos/${id}`),
    criar:     (body)     => Api.post('/api/produtos', body),
    atualizar: (id, body) => Api.put(`/api/produtos/${id}`, body),
    excluir:   (id)       => Api.delete(`/api/produtos/${id}`),
    categorias:()         => Api.get('/api/categorias'),
  },

  // ============================================================
  // VENDAS
  // ============================================================
  vendas: {
    listar:    (status)   => Api.get(`/api/vendas${status ? `?status=${status}` : ''}`),
    buscar:    (id)       => Api.get(`/api/vendas/${id}`),
    criar:     (body)     => Api.post('/api/vendas', body),
    atualizar: (id, body) => Api.put(`/api/vendas/${id}`, body),
    excluir:   (id)       => Api.delete(`/api/vendas/${id}`),
    stats:     ()         => Api.get('/api/vendas/stats'),
  },

  // ============================================================
  // CLIENTES
  // ============================================================
  clientes: {
    listar:    (q)        => Api.get(`/api/clientes${q ? `?q=${encodeURIComponent(q)}` : ''}`),
    buscar:    (id)       => Api.get(`/api/clientes/${id}`),
    criar:     (body)     => Api.post('/api/clientes', body),
    atualizar: (id, body) => Api.put(`/api/clientes/${id}`, body),
    excluir:   (id)       => Api.delete(`/api/clientes/${id}`),
  },

  // ============================================================
  // INSUMOS
  // ============================================================
  insumos: {
    listar:    ()         => Api.get('/api/insumos'),
    criar:     (body)     => Api.post('/api/insumos', body),
    atualizar: (id, body) => Api.put(`/api/insumos/${id}`, body),
    excluir:   (id)       => Api.delete(`/api/insumos/${id}`),
  },

  // ============================================================
  // EMPRESA
  // ============================================================
  empresa: {
    minha:          ()       => Api.get('/api/empresas/minha'),
    lojas:          ()       => Api.get('/api/empresas/lojas'),
    criarLoja:      (body)   => Api.post('/api/empresas/lojas', body),
    usuarios:       ()       => Api.get('/api/empresas/usuarios'),
    criarUsuario:   (body)   => Api.post('/api/empresas/usuarios', body),
    atualizarUser:  (id, b)  => Api.put(`/api/empresas/usuarios/${id}`, b),
    excluirUser:    (id)     => Api.delete(`/api/empresas/usuarios/${id}`),
    dominios:       ()       => Api.get('/api/empresas/dominios'),
    adicionarDom:   (body)   => Api.post('/api/empresas/dominios', body),
    verificarDom:   (id)     => Api.post(`/api/empresas/dominios/${id}/verificar`),
    emails:         ()       => Api.get('/api/empresas/emails'),
    criarEmail:     (body)   => Api.post('/api/empresas/emails', body),
    checkout:       (body)   => Api.post('/api/empresas/checkout', body),
    portal:         ()       => Api.post('/api/empresas/portal'),
  },

  // ============================================================
  // CONFIGURAÇÕES
  // ============================================================
  config: {
    listar:   ()      => Api.get('/api/config'),
    salvar:   (body)  => Api.put('/api/config', body),
    grupos:   ()      => Api.get('/api/grupos'),
    addGrupo: (body)  => Api.post('/api/grupos', body),
    delGrupo: (id)    => Api.delete(`/api/grupos/${id}`),
  },
};

// Verificar autenticação ao carregar
function verificarAuth() {
  const token = Api.token();
  if (!token) {
    window.location.href = 'index.html';
    return null;
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem('da_token');
      window.location.href = 'index.html';
      return null;
    }
    return payload;
  } catch {
    window.location.href = 'index.html';
    return null;
  }
}

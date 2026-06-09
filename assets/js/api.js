// assets/js/api.js — Cliente da API Delfiaapp
const API_URL = window.DELFIAAPP_API || 'https://web-production-e0bfa.up.railway.app';

const Api = {
  token() { return localStorage.getItem('da_token'); },
  usuario() { try { return JSON.parse(localStorage.getItem('da_usuario')||localStorage.getItem('da_user')); } catch { return null; } },

  async req(method, path, body = null) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token()}` },
    };
    if (body) opts.body = JSON.stringify(body);
    try {
      const res = await fetch(`${API_URL}${path}`, opts);
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
      if (err.message && err.message.includes('fetch')) throw new Error('Sem conexão com o servidor');
      throw err;
    }
  },

  get:    (path)       => Api.req('GET',    path),
  post:   (path, body) => Api.req('POST',   path, body),
  put:    (path, body) => Api.req('PUT',    path, body),
  delete: (path)       => Api.req('DELETE', path),

  auth:    { me: () => Api.get('/api/auth/me'), senha: (b) => Api.put('/api/auth/senha', b) },
  produtos: {
    listar:    (ativo) => Api.get(`/api/produtos${ativo !== undefined ? `?ativo=${ativo}` : ''}`),
    buscar:    (id)    => Api.get(`/api/produtos/${id}`),
    criar:     (body)  => Api.post('/api/produtos', body),
    atualizar: (id, b) => Api.put(`/api/produtos/${id}`, b),
    excluir:   (id)    => Api.delete(`/api/produtos/${id}`),
    categorias:()      => Api.get('/api/categorias'),
  },
  vendas: {
    listar:    (status) => Api.get(`/api/vendas${status ? `?status=${status}` : ''}`),
    buscar:    (id)     => Api.get(`/api/vendas/${id}`),
    criar:     (body)   => Api.post('/api/vendas', body),
    atualizar: (id, b)  => Api.put(`/api/vendas/${id}`, b),
    excluir:   (id)     => Api.delete(`/api/vendas/${id}`),
    stats:     ()       => Api.get('/api/vendas/stats'),
  },
  clientes: {
    listar:    (q)     => Api.get(`/api/clientes${q ? `?q=${encodeURIComponent(q)}` : ''}`),
    buscar:    (id)    => Api.get(`/api/clientes/${id}`),
    criar:     (body)  => Api.post('/api/clientes', body),
    atualizar: (id, b) => Api.put(`/api/clientes/${id}`, b),
    excluir:   (id)    => Api.delete(`/api/clientes/${id}`),
  },
  insumos: {
    listar:    ()      => Api.get('/api/insumos'),
    criar:     (body)  => Api.post('/api/insumos', body),
    atualizar: (id, b) => Api.put(`/api/insumos/${id}`, b),
    excluir:   (id)    => Api.delete(`/api/insumos/${id}`),
  },
  config: {
    listar:   ()      => Api.get('/api/config'),
    salvar:   (body)  => Api.put('/api/config', body),
    grupos:   ()      => Api.get('/api/grupos'),
    addGrupo: (body)  => Api.post('/api/grupos', body),
    delGrupo: (id)    => Api.delete(`/api/grupos/${id}`),
  },
};

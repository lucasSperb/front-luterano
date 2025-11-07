import { useState, useEffect } from "react";
import "./ListaUsuario.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  id_tipo_usuario: number;
}

interface TipoUsuario {
  id: number;
  nome: string;
}

export default function ListaUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [tipos, setTipos] = useState<TipoUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [ordemNomeAsc, setOrdemNomeAsc] = useState<boolean | null>(null);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado para ver a lista de usuários.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (response.status === 401) throw new Error("Token inválido ou expirado. Faça login novamente.");
        throw new Error(data?.message || `Erro ${response.status} ao buscar usuários`);
      }
      const data = await response.json();
      setUsuarios(Array.isArray(data) ? data : data.usuarios || []);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };

  const fetchTipos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tipousuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar tipos de usuário");
      const data = await response.json();
      setTipos(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchUsuarios();
    fetchTipos();
  }, []);

  const abrirModal = (usuario: Usuario) => {
    setUsuarioEditar(usuario);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setUsuarioEditar(null);
    setModalAberto(false);
  };

  const handleSalvar = async () => {
    if (!usuarioEditar) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${usuarioEditar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(usuarioEditar),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || `Erro ${response.status} ao atualizar usuário`);
      }
      fetchUsuarios();
      fecharModal();
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar usuário");
    }
  };

  const ordenarPorNome = () => {
    if (usuarios.length === 0) return;
    const novaOrdem = ordemNomeAsc === null ? true : !ordemNomeAsc;
    setOrdemNomeAsc(novaOrdem);

    const ordenado = [...usuarios].sort((a, b) => {
      if (a.nome.toLowerCase() < b.nome.toLowerCase()) return novaOrdem ? -1 : 1;
      if (a.nome.toLowerCase() > b.nome.toLowerCase()) return novaOrdem ? 1 : -1;
      return 0;
    });

    setUsuarios(ordenado);
  };


  const usuariosFiltrados = usuarios.filter(u => {
    const buscaMatch =
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase());
    const tipoMatch = filtroTipo ? u.tipo === filtroTipo : true;
    return buscaMatch && tipoMatch;
  });

  return (
    <div className="lista-usuario-wrapper">

      <div className="filtros-container">
        <input
          className="busca"
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select
          className="filtro-tipo" 
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          {tipos.map((t) => (
            <option key={t.id} value={t.nome}>{t.nome}</option>
          ))}
        </select>
      </div>

      {loading && <p>Carregando usuários...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && usuariosFiltrados.length === 0 && <p>Nenhum usuário encontrado.</p>}

      {!loading && !error && usuariosFiltrados.length > 0 && (
        <table className="lista-usuario-table">
          <thead>
            <tr>
              <th className="sortable" onClick={ordenarPorNome}>
                Nome {ordemNomeAsc === null ? "" : ordemNomeAsc ? "▲" : "▼"}
              </th>
              <th>E-mail</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map(u => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>{u.tipo}</td>
                <td style={{ textAlign: "center" }}>
                  <button className="btn-editar-pequeno" onClick={() => abrirModal(u)}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalAberto && usuarioEditar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Usuário</h3>
            <div className="input-group">
              <label>Nome</label>
              <input
                type="text"
                value={usuarioEditar.nome}
                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, nome: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>E-mail</label>
              <input
                type="email"
                value={usuarioEditar.email}
                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, email: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Tipo</label>
              <select
                value={usuarioEditar.id_tipo_usuario || ""}
                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, id_tipo_usuario: Number(e.target.value) })}
              >
                {tipos.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSalvar}>Salvar</button>
              <button className="btn-secondary" onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

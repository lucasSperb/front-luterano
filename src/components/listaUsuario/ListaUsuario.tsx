import { useState, useEffect } from "react";
import "./ListaUsuario.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string; 
}

export default function ListaUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (response.status === 401) {
          throw new Error("Token inválido ou expirado. Faça login novamente.");
        }

        throw new Error(errorData?.message || `Erro ${response.status} ao buscar usuários`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setUsuarios(data);
      } else if (data.usuarios && Array.isArray(data.usuarios)) {
        setUsuarios(data.usuarios);
      } else {
        throw new Error("Formato de resposta inválido da API");
      }

    } catch (err: any) {
      console.error("Erro ao buscar usuários:", err);
      setError(err.message || "Erro desconhecido ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="lista-usuario-wrapper">
      <h2>Lista de Usuários</h2>

      {loading && <p>Carregando usuários...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && usuarios.length === 0 && <p>Nenhum usuário encontrado.</p>}

      {!loading && !error && usuarios.length > 0 && (
        <table className="lista-usuario-table">
          <thead>
            <tr>
              <th>Nome</th><th>E-mail</th><th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}><td>{u.nome}</td><td>{u.email}</td><td>{u.tipo}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "./CadastraUsuario.css";

interface TipoUsuario {
  id: number;
  nome: string;
}

export default function CadastraUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("");
  const [tipos, setTipos] = useState<TipoUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchTipos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Você precisa estar logado para carregar os tipos de usuário.");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tipousuarios`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar tipos de usuário");

        const data = await response.json();
        setTipos(data);
        if (data.length > 0) setTipo(data[0].id.toString());
      } catch (err: any) {
        console.error("Erro ao carregar tipos:", err);
        setError("Falha ao carregar tipos de usuário.");
      }
    };

    fetchTipos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado para cadastrar usuários.");
      return;
    }

    const novoUsuario = {
      nome,
      email,
      senha,
      id_tipo_usuario: Number(tipo),
    };

    console.log("📤 Enviando para API:", novoUsuario);

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoUsuario),
      });

      const data = await response.json().catch(() => null);
      console.log("Resposta da API:", response.status, data);

      if (!response.ok) {
        if (response.status === 409) throw new Error("Usuário já cadastrado.");
        if (response.status === 401) throw new Error("Token inválido ou expirado. Faça login novamente.");
        if (response.status === 400) throw new Error(data?.message || "Dados inválidos. Verifique os campos.");
        throw new Error(data?.message || `Erro ${response.status} ao cadastrar usuário`);
      }

      console.log("Usuário cadastrado:", data);
      setSuccess("Usuário cadastrado com sucesso!");

      setNome("");
      setEmail("");
      setSenha("");
      if (tipos.length > 0) setTipo(tipos[0].id.toString());
    } catch (err: any) {
      console.error("Falha no cadastro:", err);
      setError(err.message || "Erro desconhecido ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastra-usuario-wrapper">
      <h2>Cadastrar Usuário</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="nome">Nome</label>
          <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>

        <div className="input-group">
          <label htmlFor="tipo">Tipo de Usuário</label>
          <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="">Selecione...</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

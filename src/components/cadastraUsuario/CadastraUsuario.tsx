import React, { useState } from "react";
import "./CadastraUsuario.css";

export default function CadastraUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("aluno"); // alterado de tipoUsuario para tipo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado para cadastrar usuários.");
      return;
    }

    const novoUsuario = { nome, email, senha, tipo }; // alterado aqui

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(novoUsuario)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (response.status === 409) {
          throw new Error(errorData?.message || "Usuário já cadastrado.");
        }
        if (response.status === 401) {
          throw new Error("Token inválido ou expirado. Faça login novamente.");
        }

        throw new Error(errorData?.message || `Erro ${response.status} ao cadastrar usuário`);
      }

      const data = await response.json();
      console.log("Usuário cadastrado:", data);
      setSuccess("Usuário cadastrado com sucesso!");

      // Resetar formulário
      setNome("");
      setEmail("");
      setSenha("");
      setTipo("aluno");

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
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="tipo">Tipo de Usuário</label>
          <select
            id="tipo"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
          >
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

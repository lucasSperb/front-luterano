import React, { useState } from "react";
import "./CadastraUsuario.css";

export default function CadastraUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("aluno");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoUsuario = { nome, email, senha, tipoUsuario };

    try {
      setLoading(true);

      // DEBUG: verificar URL e objeto
      console.log("Enviando usuário:", novoUsuario);
      console.log("URL:", `${import.meta.env.VITE_API_URL}/usuarios`);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario)
      });

      console.log("Resposta HTTP:", response.status, response.statusText);

      if (!response.ok) {
        // Tentar pegar mensagem do backend
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Erro ao cadastrar usuário");
      }

      const data = await response.json();
      console.log("Usuário cadastrado:", data);
      alert("Usuário cadastrado com sucesso!");

      // Resetar formulário somente após sucesso
      setNome("");
      setEmail("");
      setSenha("");
      setTipoUsuario("aluno");

    } catch (error: any) {
      console.error("Falha no cadastro:", error);
      alert(`Falha ao cadastrar usuário: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastra-usuario-wrapper">
      <h2>Cadastrar Usuário</h2>
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
          <label htmlFor="tipoUsuario">Tipo de Usuário</label>
          <select
            id="tipoUsuario"
            value={tipoUsuario}
            onChange={e => setTipoUsuario(e.target.value)}
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

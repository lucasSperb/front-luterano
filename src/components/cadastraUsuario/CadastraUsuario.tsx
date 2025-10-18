import React, { useState } from "react";
import "./CadastraUsuario.css";

export default function CadastraUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("aluno");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novoUsuario = {
      nome,
      email,
      senha,
      tipoUsuario,
    };

    console.log("Usuário cadastrado:", novoUsuario);
    alert("Usuário cadastrado com sucesso!");

    // Resetar formulário
    setNome("");
    setEmail("");
    setSenha("");
    setTipoUsuario("aluno");
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
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="tipoUsuario">Tipo de Usuário</label>
          <select
            id="tipoUsuario"
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
          >
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

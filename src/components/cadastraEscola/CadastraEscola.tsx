import React, { useState } from "react";
import "./CadastraEscola.css";

export default function CadastraEscola() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado para cadastrar escolas.");
      return;
    }

    const novaEscola = { nome, cnpj, endereco };
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/escolas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(novaEscola),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) throw new Error("Token inválido ou expirado.");
        if (response.status === 400) throw new Error(data?.erro || "Dados inválidos.");
        throw new Error(data?.erro || `Erro ${response.status} ao cadastrar escola.`);
      }

      setSuccess("Escola cadastrada com sucesso!");
      setNome("");
      setCnpj("");
      setEndereco("");
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao cadastrar escola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastra-escola-wrapper">
      <div className="card-escola">
        <h2>Cadastrar Escola</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

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
            <label htmlFor="cnpj">CNPJ</label>
            <input
              type="text"
              id="cnpj"
              value={cnpj}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "");
                v = v.replace(/^(\d{2})(\d)/, "$1.$2");
                v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
                v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
                v = v.replace(/(\d{4})(\d)/, "$1-$2");
                if (v.length > 18) v = v.substring(0, 18);
                setCnpj(v);
              }}
              required
            />

          </div>

          <div className="input-group">
            <label htmlFor="endereco">Endereço</label>
            <input
              type="text"
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar Escola"}
          </button>
        </form>
      </div>
    </div>
  );
}

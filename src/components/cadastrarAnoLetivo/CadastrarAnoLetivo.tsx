import { useEffect, useState } from "react";
import "./CadastrarAnoLetivo.css";

export default function CadastrarAnoLetivo({
  onCadastrado,
}: {
  onCadastrado: () => void;
}) {
  const [ano, setAno] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [escolas, setEscolas] = useState<any[]>([]);
  const [escolaSelecionada, setEscolaSelecionada] = useState<any | null>(null);
  const [selectAberto, setSelectAberto] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/escolas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setEscolas)
      .catch(() => setError("Erro ao carregar escolas."));
  }, []);

  const cadastrarAno = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!escolaSelecionada) {
      setError("Selecione uma escola.");
      return;
    }

    if (new Date(dataFim) < new Date(dataInicio)) {
      setError("A data final não pode ser menor que a data inicial.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ano`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ano: Number(ano),
          dataInicio: new Date(dataInicio).toISOString(),
          dataFim: new Date(dataFim).toISOString(),
          escolaId: escolaSelecionada.id,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.erro || "Erro ao cadastrar ano letivo.");
      }

      setSuccess("Ano letivo cadastrado com sucesso!");
      setAno("");
      setDataInicio("");
      setDataFim("");
      setEscolaSelecionada(null);
      setSelectAberto(false);
      onCadastrado();
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ano-wrapper">
      <div className="card-cadastro">
        <h3>Cadastrar Ano Letivo</h3>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={cadastrarAno}>
          <div className="input-group">
            <label>Ano</label>
            <input
              type="number"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              placeholder="Ex: 2027"
              required
            />
          </div>

          <div className="input-group">
            <label>Data de Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Data de Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Escola</label>

            <div
              className="select-custom"
              onClick={() => setSelectAberto(!selectAberto)}
            >
              {escolaSelecionada ? escolaSelecionada.nome : "Selecione uma escola"}
              <span className="arrow">{selectAberto ? "▲" : "▼"}</span>
            </div>

            {selectAberto && (
              <div className="select-options">
                {escolas.map((e) => (
                  <div
                    key={e.id}
                    className="select-option"
                    onClick={() => {
                      setEscolaSelecionada(e);
                      setSelectAberto(false);
                    }}
                  >
                    {e.nome}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="btn-primary" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

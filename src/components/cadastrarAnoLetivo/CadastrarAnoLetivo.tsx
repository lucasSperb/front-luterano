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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/escolas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setEscolas)
      .catch(() => alert("Erro ao carregar escolas"));
  }, []);

  const cadastrarAno = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!escolaSelecionada) {
      alert("Selecione uma escola.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ano`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ano,
        dataInicio,
        dataFim,
        escolaId: escolaSelecionada.id,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data?.erro || "Erro ao cadastrar ano letivo.");
      return;
    }

    setAno("");
    setDataInicio("");
    setDataFim("");
    setEscolaSelecionada(null);
    onCadastrado();
  };

  return (
    <div className="ano-wrapper">
      <div className="card-cadastro">
        <h3>Cadastrar Ano Letivo</h3>

        <form onSubmit={cadastrarAno}>
          <div className="input-group">
            <label>Ano</label>
            <input
              type="text"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
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

          <button className="btn-primary">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

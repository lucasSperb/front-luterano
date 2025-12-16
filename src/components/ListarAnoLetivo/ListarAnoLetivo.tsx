import { useEffect, useState } from "react";
import "./ListarAnoLetivo.css";

export default function ListaAnoLetivo() {
  const [anos, setAnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // anoEditar  modalAberto
  const [ setAnoEditar] = useState<any | null>(null);
  //const [setModalAberto] = useState(false);

  const [fAno, setFAno] = useState("");
  const [ordemAsc, setOrdemAsc] = useState<boolean | null>(null);

  const fetchAnos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ano`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || "Erro ao buscar anos.");

      setAnos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnos();
  }, []);

  const ordenarPorAno = () => {
    const nova = ordemAsc === null ? true : !ordemAsc;
    setOrdemAsc(nova);

    const ordenado = [...anos].sort((a, b) =>
      nova ? a.ano - b.ano : b.ano - a.ano
    );

    setAnos(ordenado);
  };

  const filtrados = anos.filter((a) =>
    a.ano.toString().includes(fAno)
  );

  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString("pt-BR");

  return (
    <div className="lista-anos-wrapper">
      <div className="filtros-anos">
        <input
          className="BuscaAno"
          placeholder="Buscar ano..."
          value={fAno}
          onChange={(e) => setFAno(e.target.value)}
        />
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <table className="lista-anos-table">
          <thead>
            <tr>
              <th onClick={ordenarPorAno}>
                Ano {ordemAsc === null ? "" : ordemAsc ? "▲" : "▼"}
              </th>
              <th>Status</th>
              <th>Data Início</th>
              <th>Data Fim</th>
              <th className="acoes">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((a) => (
              <tr key={a.id}>
                <td>{a.ano}</td>
                <td>
                  {a.ativo ? (
                    <span style={{ color: "green", fontWeight: 600 }}>
                      Ativo
                    </span>
                  ) : (
                    <span style={{ color: "red", fontWeight: 600 }}>
                      Inativo
                    </span>
                  )}
                </td>
                <td>{formatarData(a.dataInicio)}</td>
                <td>{formatarData(a.dataFim)}</td>
                <td className="acoes">
                  <button
                    
                    className="btn-editar ListarAnoLetivo"
                    onClick={() => {
                      setAnoEditar(a);
                      //setModalAberto(true);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-deletar ListarAnoLetivo"
                    onClick={() => alert("Implementar delete")}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

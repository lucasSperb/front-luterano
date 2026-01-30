import { useEffect, useState } from "react";
import "./ListarAnoLetivo.css";

export default function ListaAnoLetivo() {
  const [anos, setAnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [anoEditar, setAnoEditar] = useState<any | null>(null);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);

  const [modalDeleteAberto, setModalDeleteAberto] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);

  const [fAno, setFAno] = useState("");
  const [ordemAsc, setOrdemAsc] = useState<boolean | null>(null);

  const limparMensagens = () => {
    setError(null);
    setSuccess(null);
  };

  const fetchAnos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    limparMensagens();

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

  const salvarEdicao = async () => {
    if (!anoEditar) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    limparMensagens();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ano/${anoEditar.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(anoEditar),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || "Erro ao atualizar ano.");

      setSuccess("Ano letivo atualizado com sucesso.");
      setModalEditarAberto(false);
      setAnoEditar(null);
      fetchAnos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const confirmarDelete = async () => {
    if (!idParaExcluir) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    limparMensagens();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ano/${idParaExcluir}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || "Erro ao excluir ano.");

      setSuccess("Ano letivo excluído com sucesso.");
      setModalDeleteAberto(false);
      setIdParaExcluir(null);
      fetchAnos();
    } catch (err: any) {
      setError(err.message);
    }
  };

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

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {loading && <p>Carregando...</p>}

      {!loading && (
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
                  <span
                    style={{
                      color: a.ativo ? "green" : "red",
                      fontWeight: 600,
                    }}
                  >
                    {a.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td>{formatarData(a.dataInicio)}</td>
                <td>{formatarData(a.dataFim)}</td>
                <td className="acoes">
                  <button
                    className="btn-editar-pequeno"
                    onClick={() => {
                      setAnoEditar(a);
                      setModalEditarAberto(true);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-deletar-pequeno"
                    onClick={() => {
                      setIdParaExcluir(a.id);
                      setModalDeleteAberto(true);
                    }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL EDITAR */}
      {modalEditarAberto && anoEditar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Ano Letivo</h3>

            <div className="input-group">
              <label>Ano</label>
              <input
                type="number"
                value={anoEditar.ano}
                onChange={(e) =>
                  setAnoEditar({ ...anoEditar, ano: Number(e.target.value) })
                }
              />
            </div>

            <div className="input-group">
              <label>Data Início</label>
              <input
                type="date"
                value={anoEditar.dataInicio.slice(0, 10)}
                onChange={(e) =>
                  setAnoEditar({ ...anoEditar, dataInicio: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label>Data Fim</label>
              <input
                type="date"
                value={anoEditar.dataFim.slice(0, 10)}
                onChange={(e) =>
                  setAnoEditar({ ...anoEditar, dataFim: e.target.value })
                }
              />
            </div>

            <div className="modal-buttons">
              <button className="btn-primary" onClick={salvarEdicao}>
                Salvar
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setModalEditarAberto(false);
                  setAnoEditar(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {modalDeleteAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar exclusão</h3>
            <p>Deseja realmente excluir este ano letivo?</p>

            <div className="modal-buttons">
              <button className="btn-danger" onClick={confirmarDelete}>
                Excluir
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setModalDeleteAberto(false);
                  setIdParaExcluir(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import "./ListaEscolas.css";

export default function ListaEscolas() {
  const [escolas, setEscolas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [fCnpj, setFCnpj] = useState("");
  const [fEndereco, setFEndereco] = useState("");

  const [escolaEditar, setEscolaEditar] = useState<any | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const [ordemNomeAsc, setOrdemNomeAsc] = useState<boolean | null>(null);

  const mascaraCnpj = (v: string) => {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
    return v.slice(0, 18);
  };

  const handleFiltroCnpj = (e: any) => {
    setFCnpj(mascaraCnpj(e.target.value));
  };

  const fetchEscolas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/escolas`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || "Erro ao buscar escolas.");

      setEscolas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscolas();
  }, []);

  const ordenarPorNome = () => {
    const novaOrdem = ordemNomeAsc === null ? true : !ordemNomeAsc;
    setOrdemNomeAsc(novaOrdem);

    const ordenado = [...escolas].sort((a, b) => {
      if (a.nome.toLowerCase() < b.nome.toLowerCase()) return novaOrdem ? -1 : 1;
      if (a.nome.toLowerCase() > b.nome.toLowerCase()) return novaOrdem ? 1 : -1;
      return 0;
    });

    setEscolas(ordenado);
  };

  const salvarEdicao = async () => {
    if (!escolaEditar) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/escolas/${escolaEditar.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(escolaEditar)
      }
    );

    const data = await res.json();
    if (!res.ok) return alert(data?.erro || "Erro ao atualizar escola.");

    setModalAberto(false);
    setEscolaEditar(null);
    fetchEscolas();
  };

  const filtradas = escolas.filter((e) => {
    const cnpjLimpo = e.cnpj.replace(/\D/g, "");
    const filtroCnpjLimpo = fCnpj.replace(/\D/g, "");
    return (
      cnpjLimpo.includes(filtroCnpjLimpo) &&
      e.endereco.toLowerCase().includes(fEndereco.toLowerCase())
    );
  });

  return (
    <div className="lista-escolas-wrapper">
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Carregando...</p>}

      {!loading && !error && (
        <>
          <div className="filtros-escolas">
            <input
              className="BuscaEscola"
              placeholder="Filtrar por CNPJ"
              value={fCnpj}
              onChange={handleFiltroCnpj}
              maxLength={18}
            />
            <input
              className="BuscaEscola"
              placeholder="Filtrar por endereço"
              value={fEndereco}
              onChange={(e) => setFEndereco(e.target.value)}
            />
          </div>

          <table className="lista-escolas-table">
            <thead>
              <tr>
                <th className="sortable" onClick={ordenarPorNome}>
                  Nome {ordemNomeAsc === null ? "" : ordemNomeAsc ? "▲" : "▼"}
                </th>
                <th>CNPJ</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((e) => (
                <tr key={e.id}>
                  <td>{e.nome}</td>
                  <td>{e.cnpj}</td>
                  <td>{e.endereco}</td>
              <td style={{ textAlign: "center" }}>
                    <button
                      className="btn-editar-pequeno"
                      onClick={() => {
                        setEscolaEditar(e);
                        setModalAberto(true);
                      }}
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {modalAberto && escolaEditar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Escola</h3>

            <div className="input-group">
              <label>Nome</label>
              <input
                value={escolaEditar.nome}
                onChange={(e) =>
                  setEscolaEditar({ ...escolaEditar, nome: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label>CNPJ</label>
              <input
                value={escolaEditar.cnpj}
                onChange={(e) =>
                  setEscolaEditar({
                    ...escolaEditar,
                    cnpj: mascaraCnpj(e.target.value)
                  })
                }
                maxLength={18}
              />
            </div>

            <div className="input-group">
              <label>Endereço</label>
              <input
                value={escolaEditar.endereco}
                onChange={(e) =>
                  setEscolaEditar({
                    ...escolaEditar,
                    endereco: e.target.value
                  })
                }
              />
            </div>

            <div className="modal-buttons">
              <button className="btn-primary" onClick={salvarEdicao}>
                Salvar
              </button>
              <button
                className="btn-secondary"
                onClick={() => setModalAberto(false)}
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

import { useEffect, useState } from "react";
import "./ListaEscolas.css";

export default function ListaEscolas() {
  const [escolas, setEscolas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [fCnpj, setFCnpj] = useState("");
  const [fEndereco, setFEndereco] = useState("");

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado.");
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/escolas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.erro || "Erro ao buscar escolas.");
        setEscolas(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtradas = escolas.filter((e) => {
    const cnpjLimpo = e.cnpj.replace(/\D/g, "");
    const filtrCnpjLimpo = fCnpj.replace(/\D/g, "");
    return (
      e.nome.toLowerCase().includes("") &&
      cnpjLimpo.includes(filtrCnpjLimpo) &&
      e.endereco.toLowerCase().includes(fEndereco.toLowerCase())
    );
  });

    const [ordemNomeAsc, setOrdemNomeAsc] = useState<boolean | null>(null);

    const ordenarPorNome = () => {
    if (escolas.length === 0) return;

    const novaOrdem = ordemNomeAsc === null ? true : !ordemNomeAsc;
    setOrdemNomeAsc(novaOrdem);

    const ordenado = [...escolas].sort((a, b) => {
        if (a.nome.toLowerCase() < b.nome.toLowerCase()) return novaOrdem ? -1 : 1;
        if (a.nome.toLowerCase() > b.nome.toLowerCase()) return novaOrdem ? 1 : -1;
        return 0;
    });

    setEscolas(ordenado);
    };

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
                <th className="sortable" onClick={ordenarPorNome}>Nome {ordemNomeAsc === null ? "" : ordemNomeAsc ? "▲" : "▼"}</th>
                <th>CNPJ</th>
                <th>Endereço</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((e) => (
                <tr key={e.id}>
                  <td>{e.nome}</td>
                  <td>{e.cnpj}</td>
                  <td>{e.endereco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

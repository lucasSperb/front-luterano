import { useEffect, useState } from "react";
import "./ResumoDashboard.css";

export default function ResumoDashboard() {
  const [totalEscolas, setTotalEscolas] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/escolas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.erro || "Erro ao buscar escolas.");
        setTotalEscolas(Array.isArray(data) ? data.length : 0);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="resumo-dashboard">
      <div className="resumo-card">
        <h3 className="h3-resumo">Escolas cadastradas</h3>

        {error && <p className="error-message">{error}</p>}

        {!error && totalEscolas !== null && (
          <span className="resumo-numero">{totalEscolas}</span>
        )}
      </div>
    </div>
  );
}

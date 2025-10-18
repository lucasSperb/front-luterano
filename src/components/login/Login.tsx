import React, { useState } from 'react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const API_BASE =
        (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
        ((globalThis as any).process?.env?.REACT_APP_API_URL) ||
        'https://backend-escola-hhgn.onrender.com';

      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Falha no login');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      alert('Login realizado com sucesso!');
      window.location.href = '/dashboard';
    } catch (err: any) {
      // Melhora a mensagem de erro
      const mensagemErro =
        err?.message?.includes('Failed to fetch')
          ? 'Não foi possível conectar ao servidor. Verifique sua conexão ou se a API está rodando.'
          : err.message || 'Erro ao tentar logar.';

      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src="src/images/logoPaz.avif" alt="Logo da Escola" />

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Bloco visual de erro */}
        {erro && (
          <div className="error-box">
            <span className="error-icon">⚠️</span>
            <p className="error-text">{erro}</p>
          </div>
        )}

        <div className="login-footer">
          <p>© 2025 Escola Luterana</p>
        </div>
      </div>
    </div>
  );
}

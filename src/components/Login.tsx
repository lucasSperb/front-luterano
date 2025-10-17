import './Login.css';

export default function Login() {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src="src\images\logoPaz.avif" alt=""/>

        <form>
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="seu@email.com" />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" placeholder="••••••••" />
          </div>

          <button type="button">Entrar</button>
        </form>

        <div className="login-footer">
          <p>© 2025 Escola Luterana</p>
        </div>
      </div>
    </div>
  );
}

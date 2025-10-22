import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import logo from '../../images/logoPaz.avif';

interface SidebarProps {
  activeMenu?: string;
  activeSubmenu?: string;
  onSelectMenu: (menu: string) => void;
  onSelectSubmenu: (submenu: string) => void;
}

export default function Sidebar({
  activeMenu,
  activeSubmenu,
  onSelectMenu,
  onSelectSubmenu,
}: SidebarProps) {
  const [showUsuarioSubmenu, setShowUsuarioSubmenu] = React.useState(false);
  const [showConfiguracoesSubmenu, setShowConfiguracoesSubmenu] = React.useState(false);

  const navigate = useNavigate();

  const handleUsuarioClick = () => {
    onSelectMenu('usuario');
    setShowUsuarioSubmenu((prev) => !prev);
    setShowConfiguracoesSubmenu(false);
  };

  const handleConfiguracoesClick = () => {
    onSelectMenu('configuracoes');
    setShowConfiguracoesSubmenu((prev) => !prev);
    setShowUsuarioSubmenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleLogoClick = () => {
    setShowUsuarioSubmenu(false);
    setShowConfiguracoesSubmenu(false);

    onSelectMenu('');
    onSelectSubmenu('');

    navigate('/dashboard');
  };

  return (
    <aside className="sidebar">
      <div
        className="logo-section"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
        title="Voltar ao Dashboard"
      >
        <img src={logo} className="logo" alt="Logo da Escola" />
      </div>

      <nav className="menu">
        <a
          href="#"
          className={activeMenu === 'usuario' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleUsuarioClick();
          }}
        >
          👤 Usuário
        </a>

        <div className={`submenu ${showUsuarioSubmenu ? 'submenu-visible' : ''}`}>
          <a
            href="#"
            className={activeSubmenu === 'cadastrar' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              onSelectSubmenu('cadastrar');
            }}
          >
            Cadastrar Usuário
          </a>
          <a
            href="#"
            className={activeSubmenu === 'listar' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              onSelectSubmenu('listar');
            }}
          >
            Listar Usuários
          </a>
        </div>

        <a
          href="#"
          className={activeMenu === 'configuracoes' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleConfiguracoesClick();
          }}
        >
          ⚙️ Configurações
        </a>

        <div className={`submenu ${showConfiguracoesSubmenu ? 'submenu-visible' : ''}`}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            🚪 Sair
          </a>
        </div>
      </nav>
    </aside>
  );
}

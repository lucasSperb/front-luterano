import { useState } from 'react';
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
  const navigate = useNavigate();

  // Estado único: apenas um menu aberto por vez
  const [menuAberto, setMenuAberto] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    if (menuAberto === menu) {
      setMenuAberto(null); // Fecha se clicar no mesmo menu
      onSelectMenu('');
    } else {
      setMenuAberto(menu);
      onSelectMenu(menu);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleLogoClick = () => {
    onSelectMenu('');
    onSelectSubmenu('');
    setMenuAberto(null);
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

        {/* MENU USUÁRIO */}
        <a
          href="#"
          className={activeMenu === 'usuario' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            toggleMenu('usuario');
          }}
        >
          👤 Usuário
        </a>
        <div className={`submenu ${menuAberto === 'usuario' ? 'submenu-visible' : ''}`}>
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

        {/* MENU CONFIGURAÇÕES */}
        <a
          href="#"
          className={activeMenu === 'configuracoes' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            toggleMenu('configuracoes');
          }}
        >
          ⚙️ Configurações
        </a>
        <div className={`submenu ${menuAberto === 'configuracoes' ? 'submenu-visible' : ''}`}>
          <a
            href="#"
            className={activeSubmenu === 'cadastrar_escola' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              onSelectSubmenu('cadastrar_escola');
            }}
          >
            🏫 Cadastrar Escola
          </a>

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

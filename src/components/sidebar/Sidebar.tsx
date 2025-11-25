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
  const [menuAberto, setMenuAberto] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    if (menuAberto === menu) {
      setMenuAberto(null);
      onSelectMenu('');
      onSelectSubmenu('');
    } else {
      setMenuAberto(menu);
      onSelectMenu(menu);
      onSelectSubmenu('');
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

        <a
          href="#"
          className={activeMenu === 'usuario' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); toggleMenu('usuario'); }}
        >
          👤 Usuário
        </a>
        <div className={`submenu ${menuAberto === 'usuario' ? 'submenu-visible' : ''}`}>
          <a
            href="#"
            className={activeSubmenu === 'cadastrar' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onSelectMenu('usuario'); onSelectSubmenu('cadastrar'); }}
          >
            Cadastrar Usuário
          </a>

          <a
            href="#"
            className={activeSubmenu === 'listar' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onSelectMenu('usuario'); onSelectSubmenu('listar'); }}
          >
            Listar Usuários
          </a>
        </div>

        <a
          href="#"
          className={activeMenu === 'escolas' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); toggleMenu('escolas'); }}
        >
          🏫 Escolas
        </a>
        <div className={`submenu ${menuAberto === 'escolas' ? 'submenu-visible' : ''}`}>
          <a
            href="#"
            className={activeSubmenu === 'cadastrar_escola' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onSelectMenu('escolas'); onSelectSubmenu('cadastrar_escola'); }}
          >
            Cadastrar Escola
          </a>

          <a
            href="#"
            className={activeSubmenu === 'listar_escolas' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onSelectMenu('escolas'); onSelectSubmenu('listar_escolas'); }}
          >
            Listar Escolas
          </a>
        </div>

        <a
          href="#"
          className={activeMenu === 'configuracoes' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); toggleMenu('configuracoes'); }}
        >
          ⚙️ Configurações
        </a>
        <div className={`submenu ${menuAberto === 'configuracoes' ? 'submenu-visible' : ''}`}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
          >
            🚪 Sair
          </a>
        </div>
      </nav>
    </aside>
  );
}

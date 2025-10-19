import React from 'react';
import './Sidebar.css';
import logo from '../../images/logoPaz.avif';

interface SidebarProps {
  activeMenu?: string;
  activeSubmenu?: string;
  onSelectMenu: (menu: string) => void;
  onSelectSubmenu: (submenu: string) => void;
}

export default function Sidebar({ activeMenu, activeSubmenu, onSelectMenu, onSelectSubmenu }: SidebarProps) {
  const [showUsuarioSubmenu, setShowUsuarioSubmenu] = React.useState(false);

  const handleUsuarioClick = () => {
    onSelectMenu("usuario");
    setShowUsuarioSubmenu(prev => !prev); 
  };

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <img src={logo} className="logo" alt="Logo da Escola" />
      </div>

      <nav className="menu">
        <a
          href="#"
          className={activeMenu === 'usuario' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); handleUsuarioClick(); }}
        >
          👤 Usuário
        </a>

       <div className={`submenu ${showUsuarioSubmenu ? 'submenu-visible' : ''}`}>
          <a
            href="#"
            className={activeSubmenu === 'cadastrar' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onSelectSubmenu('cadastrar'); }}
          >
            Cadastrar Usuário
          </a>
          <a
            href="#"
            className={activeSubmenu === 'listar' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); onSelectSubmenu('listar'); }}
          >
            Listar Usuários
          </a>
        </div>

      </nav>
    </aside>
  );
}

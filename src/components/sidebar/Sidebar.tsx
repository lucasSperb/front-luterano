import React from 'react';
import './Sidebar.css';
import logo from '../../images/logoPaz.avif';

interface SidebarProps {
  active?: string;
}

export default function Sidebar({ active }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="logo-section">
        <img src={logo} className="logo" alt="Logo da Escola" />
      </div>

      <nav className="menu">
        <a
          href="../cadastraUsuario/CadastraUsuario"
          className={active === 'usuario' ? 'active' : ''}
        >
          👤 Usuário
        </a>
      </nav>
    </aside>
  );
}

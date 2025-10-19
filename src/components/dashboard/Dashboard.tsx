import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import CadastraUsuario from "../cadastraUsuario/CadastraUsuario";
import ListaUsuario from "../listaUsuario/ListaUsuario";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState<string>(""); 
  const [activeSubmenu, setActiveSubmenu] = useState<string>("");

  const renderContent = () => {
    if (activeMenu === "usuario") {
      switch (activeSubmenu) {
        case "cadastrar":
          return <CadastraUsuario />;
        case "listar":
          return <ListaUsuario />;
        default:
      }
    }
   
  };

  return (
    <div className="dashboard-wrapper" style={{ display: "flex" }}>
      <Sidebar 
        activeMenu={activeMenu} 
        activeSubmenu={activeSubmenu} 
        onSelectMenu={setActiveMenu} 
        onSelectSubmenu={setActiveSubmenu} 
      />
      <div className="dashboard-content" style={{ flex: 1, padding: "20px" }}>
        {renderContent()}
      </div>
    </div>
  );
}

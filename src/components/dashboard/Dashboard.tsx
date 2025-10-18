import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import CadastraUsuario from "../cadastraUsuario/CadastraUsuario";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("usuario");

  return (
    <div className="dashboard-wrapper">
      <Sidebar active={activeMenu} />

      <div className="dashboard-content">
        {activeMenu === "usuario" && <CadastraUsuario />}
      </div>
    </div>
  );
}

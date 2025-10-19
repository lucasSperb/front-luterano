import React, { useState, useEffect } from "react";
import "./ListaUsuario.css";

// Componente fictício para demonstrar listagem
interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: string;
}

export default function ListaUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    // Exemplo de dados estáticos
    const dados: Usuario[] = [
      { id: 1, nome: "João Silva", email: "joao@email.com", tipoUsuario: "aluno" },
      { id: 2, nome: "Maria Souza", email: "maria@email.com", tipoUsuario: "professor" },
      { id: 3, nome: "Admin", email: "admin@email.com", tipoUsuario: "admin" },
    ];
    setUsuarios(dados);
  }, []);

  return (
    <div className="lista-usuario-wrapper">
      <h2>Lista de Usuários</h2>
      <table className="lista-usuario-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.tipoUsuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

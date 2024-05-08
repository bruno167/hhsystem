'use client'

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";
import { SideBar } from "./components/Sidebar/sidebar";
import { Header } from "./components/Header/header";
import Gerenciar from "./components/Gerenciar/gerenciar";
import Cadastro from "./components/Gerenciar/cadastro";
import Dashboard from "./components/Dashboard/dashboard";


export default function Home() {
  const [currentPage, setCurrentPage] = useState("Gerenciar");

  const handleGerenciarClick = () => {
    setCurrentPage("Gerenciar");
  };

  const handleCadastroClick = () => {
    setCurrentPage("Cadastro");
  };

  const handleDashboardClick = () => {
    setCurrentPage("Dashboard");
  };

  return (
    <main>
        <Header />
        <SideBar 
          onGerenciarClick={handleGerenciarClick} 
          onCadastroClick={handleCadastroClick}
          onDashboardClick={handleDashboardClick}
        /> 
        {currentPage === "Gerenciar" ? (
          <Gerenciar />
        ) : currentPage === "Cadastro" ? (
          <Cadastro profissional={undefined} onSave={undefined} onCancel={undefined} />
        ) : (
          <Dashboard />
        )}
    </main>
  );
}

'use client'

import { useEffect, useState } from "react"
import "./dashboard.scss"
import { Delete, Edit, MoreHorizontal, Trash, Trash2 } from "lucide-react";

interface Profissional {
    id: number;
    nome: string;
    cpf: number;
    rg: string;
    nascimento: string;
    email: string;
    telefone: number;
    endereço:string;
    cfm: number;
    especialidade: string;
    cidade: string;
  }


interface DashboardProps {

}
export default function Dashboard(props : DashboardProps){
    const [profissionais, setProfissionais] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/profissionaisDeSaude')
            .then(response => response.json())
            .then(data => setProfissionais(data))
            .then(error => console.error('Erro ao recuperar os dados:', error));
    }, []);

    return(
        <div className="content">
            {profissionais.map(profissional => (
                <div key={profissional.id} className="card">
                    <h2>{profissional.nome}</h2>
                    <p>Especialidade:{profissional.especialidade}</p>
                    <p>Cidade:{profissional.cidade}</p>
                    <section>
                        <Edit />
                        <Trash2 />
                    </section>
                </div>
            ))}
        </div>
    )
}
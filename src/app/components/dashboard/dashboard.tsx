'use client'

import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import "./dashboard.scss";
import Modal from "./infomodal";

interface Profissional {
    id: number;
    nome: string;
    cpf: number;
    rg: string;
    nascimento: string;
    email: string;
    telefone: number;
    cidade: string;
    cfm: number;
    especialidade: string;
}

interface DashboardProps {}

export default function Dashboard ()  {
    const [profissionais, setProfissionais] = useState<Profissional[]>([]);
    const [editedProfissional, setEditedProfissional] = useState<Profissional | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        fetch('http://localhost:3000/profissionaisDeSaude')
            .then(response => response.json())
            .then(data => setProfissionais(data))
            .catch(error => console.error('Erro ao recuperar os dados:', error));
    }, []);

    const handleEditProfissional = (profissional: Profissional) => {
        setEditedProfissional(profissional);
        setIsModalOpen(true);
    };

    const handleSaveProfissional = (editedProfissional: Profissional) => {
        fetch(`http://localhost:3000/profissionaisDeSaude/${editedProfissional.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedProfissional),
        })
        .then(response => response.json())
        .then(updatedProfissional => {
            const updatedProfissionais = profissionais.map(profissional => {
                if (profissional.id === updatedProfissional.id) {
                    return updatedProfissional;
                }
                return profissional;
            });
            setProfissionais(updatedProfissionais);
            setEditedProfissional(null);
        })
        .catch(error => console.error('Erro ao salvar os dados:', error));
    };

    return (
        <div className="content">
                <header>
                    <h1>Profissionais</h1>
                </header>
                <table>
                    <thead>
                        <tr className="head">
                            <th>
                                <h3>Nome</h3>
                            </th>
                            <th>
                                <h3>Área</h3>
                            </th>
                            <th>
                                <h3>CPF</h3>
                            </th>
                            <th>
                                <h3>Nascimento</h3>
                            </th>
                            <th>
                                <h3>EMAIL</h3>
                            </th>
                            <th>
                                <h3>CFM</h3>
                            </th>
                            <th>
                                <h3>Cidade</h3>
                            </th>
                            <th>
                            </th>
                            <th>
                                <div className="add-card">
                                    <Plus />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {profissionais.map(profissional => (
                            <tr key={profissional.id}>
                                <td>
                                    <h2>{profissional.nome}</h2>
                                </td>
                                <td>
                                    <p>{profissional.especialidade}</p>
                                </td>
                                <td>
                                    <p>{profissional.cpf}</p>
                                </td>
                                <td>
                                    <p>{profissional.nascimento}</p>
                                </td>
                                <td>
                                    <p>{profissional.email}</p>
                                </td>
                                <td>
                                    <p>{profissional.cfm}</p>
                                </td>
                                <td>
                                    <p>{profissional.cidade}</p>
                                </td>
                                <td className="buttom-modify">
                                    <Edit onClick={ ( ) => handleEditProfissional(profissional)}/>
                                </td>
                                <td className="buttom-delete">
                                    <Trash2 />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isModalOpen && editedProfissional && (
                    <Modal
                        profissional={editedProfissional}
                        onSave={handleSaveProfissional}
                        onCancel={() => {
                            setEditedProfissional(null);
                            setIsModalOpen(false); // Fecha o modal ao cancelar a edição
                        }}
                    />
            )}
            </div>
    );
}

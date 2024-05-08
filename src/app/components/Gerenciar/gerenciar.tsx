'use client'

import React, { useState, useEffect } from 'react';
import axios, { Axios } from 'axios';
import './gerenciar.scss';
import { Delete, Edit2, Plus, Trash2, X } from 'lucide-react';
import EditModal from './editModal';

interface ProfissionalSaude {
    id: number;
    nome: string;
    cpf: string;
    rg: string;
    nascimento: string;
    email: string;
    telefone: string;
    cidade: string;
    cep: string;
    rua: string;
    casa: string;
    bairro: string;
    cfm: string;
    especialidade: string;
    ativo: boolean;
    imagem: "";
    uf: string;
    ddd: number;
    valor:number;
    atendimento: string;
}

interface FilterOptions {
  ativo: boolean | '';
  cidade: string;
  nome: string;
}


const ProfissionaisSaudeTabela: React.FC = () => {
  const [profissionais, setProfissionais] = useState<ProfissionalSaude[]>([]);
  const [filteredProfissionais, setFilteredProfissionais] = useState<ProfissionalSaude[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    ativo: '',
    cidade: '',
    nome: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedProfissional, setSelectedProfissional] = useState<ProfissionalSaude | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ProfissionalSaude[]>('http://localhost:3000/profissionaisDeSaude');
        console.log('Dados recebidos da API:', response.data);
        setProfissionais(response.data);
        setFilteredProfissionais(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    fetchData();
  }, []);

  const renderizarContato = (profissional: ProfissionalSaude) => {
    if (profissional.email && profissional.telefone) {
      return profissional.email;
    } else if (profissional.telefone) {
      return profissional.telefone;
    } else {
      return 'Sem informações de contato';
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  useEffect(() => {
    let filteredData = profissionais.filter((profissional) => {
      let match = true;
      if (filters.ativo !== '') {
        if (filters.ativo === 'true') {
          match = match && profissional.ativo === true;
        } else if (filters.ativo === 'false') {
          match = match && profissional.ativo === false;
        }
      }
      if (filters.cidade !== '') {
        match = match && profissional.cidade.toLowerCase() === filters.cidade.toLowerCase();
      }
      if (filters.nome !== '') {
        match = match && profissional.nome.toLowerCase().includes(filters.nome.toLowerCase());
      }
      return match;
    });
    setFilteredProfissionais(filteredData);
  }, [profissionais, filters]);

  const handleEditProfissional = (profissional: ProfissionalSaude) => {
    setSelectedProfissional(profissional);
    setIsEditModalOpen(true);
  };

  const handleSaveProfissional = async (editedProfissional: ProfissionalSaude) => {
    try {
      await axios.put(`http://localhost:3000/profissionaisDeSaude/${editedProfissional.id}` , editedProfissional);

      const updatedProfissionais = profissionais.map(p => 
        p.id === editedProfissional.id ? editedProfissional : p
      );
      setProfissionais(updatedProfissionais);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao editar profissional:', error);
      
    }      
    
  };

  const handleDeleteProfissional = async (id: number) => {
    try {
        await axios.delete(`http://localhost:3000/profissionaisDeSaude/${id}`);

        const updatedProfissionais = profissionais.filter(p => p.id !== id);
        setProfissionais(updatedProfissionais);
    } catch (error) {
        console.error('Erro ao excluir profissional:', error);
    }
};

  return (
    <div className="content">
      <div className="filters">
        <input
          type="text"
          placeholder="Nome"
          name="nome"
          value={filters.nome}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Cidade"
          name="cidade"
          value={filters.cidade}
          onChange={handleFilterChange}
        />
        <select
          name="ativo"
          value={filters.ativo}
          onChange={handleFilterChange}
        >
          <option value="">Todos</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
        <button onClick={() => setFilters({ ativo: '', cidade: '', nome: '' })}>Limpar Filtro</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Especialidade</th>
            <th>Registro</th>
            <th>CPF</th>
            <th>Contato</th>
            <th>Cidade</th>
            <th>Ativo</th>
            <th>Controle</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfissionais.map((profissional) => (
            <tr key={profissional.id}> 
              <td>{profissional.nome}</td>
              <td>{profissional.especialidade}</td>
              <td>{profissional.cfm}</td>
              <td>{profissional.cpf}</td>
              <td>{renderizarContato(profissional)}</td>
              <td>{profissional.cidade} - {profissional.uf}</td>
              <td>
                <span className={`status ${profissional.ativo ? 'ativo' : 'inativo'}`}>
                  {profissional.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <div className='td-modify'>
                <button className='buttom-modify' onClick={() => handleEditProfissional(profissional)}>
                  <Edit2 />
                </button>
                <button className='buttom-delete' onClick={() => handleDeleteProfissional(profissional.id)}>
                  <Trash2 />
                </button>
              </div>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditModalOpen && selectedProfissional && (
        <EditModal
        profissional={selectedProfissional}
        onSave={(editedProfissional) => {
          handleSaveProfissional(editedProfissional);
          setIsEditModalOpen(false);
        }}
        onCancel={() => setIsEditModalOpen(false)}
      />
      )}
    </div>
  );
};

export default ProfissionaisSaudeTabela;

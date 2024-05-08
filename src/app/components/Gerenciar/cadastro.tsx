'use client'

import { useRef, useState } from "react";
import "./modal.scss";
import "./gerenciar.scss";
import { X } from "lucide-react";
import axios from "axios";

const Cadastro = ({ onSave }) => {
    const checkIfCpfExists = async (cpf) => {
        console.log('Verificando se o CPF existe:', cpf);
        try {
            const response = await axios.get(`http://localhost:3000/profissionaisDeSaude?cpf=${cpf}`);
            console.log('Resposta da solicitação:', response.data);
            return response.data.length > 0;
        } catch (error) {
            console.error('Erro ao verificar CPF:', error);
            return false;
        }
    };


    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [ativo, setAtivo] = useState<string>('ativo');
    const [valorConsulta, setValorConsulta] = useState<string>('');
    const [opcaoAtendimento, setOpcaoAtendimento] = useState<string>('');

    const [novoProfissional, setNovoProfissional] = useState({
        id:    '',
        nome: '',
        cpf: '',
        rg: '',
        nascimento: '',
        email:  '',
        telefone:  '',
        cidade: '',
        cep: '',
        rua: '',
        casa: '',
        bairro: '',
        cfm: '',
        especialidade:  '',
        ativo: '',
        uf: '',
        valorConsulta: '',
        opcaoAtendimento: '',
    });
    const [idCounter, setIdCounter] = useState(1);

    const formRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value.replace(/[^\d.,]/g, '');

        if (name === 'valor') {
            setValorConsulta(numericValue);
        }
        
        if (name === 'cpf') {
            const cleanedValue = value.replace(/\D/g, '');
            if (cleanedValue.length !== 11) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: "CPF inválido. Deve conter 11 números."
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: undefined
                }));
            }
            setNovoProfissional(prevState => ({
                ...prevState,
                [name]: cleanedValue,
            }));
        } else {
            setNovoProfissional(prevState => ({
                ...prevState,
                [name]: (name === 'rg' || name === 'telefone' || name === 'cep') ? value.replace(/[^\d]/g, '') : value,
            }));
        }
    
        if (name === "cep") {
            axios.get(`https://viacep.com.br/ws/${value}/json/`)
                .then(response => {
                    const data = response.data;
                    setNovoProfissional(prevState => ({
                        ...prevState,
                        cidade: data.localidade,
                        rua: data.logradouro,
                        bairro: data.bairro,
                        uf: data.uf,
                    }));
                })
                .catch(error => {
                    console.error('Erro ao consultar o CEP:', error);
                });
        }
    };

    const requiredFields = ["nome", "cpf", "rg", "nascimento", "cep", "cfm", "especialidade"];
    const newErrors = {};
    requiredFields.forEach(field => {
        if (!novoProfissional[field]) {
            newErrors[field] = "Campo obrigatório";
        }
    });

    const handleSubmit = async () => {     
        const cpfExists = await checkIfCpfExists(novoProfissional.cpf);
        if (cpfExists) {
            setErrors(prevErrors => ({
                ...prevErrors,
                cpf: "Este CPF já está em uso."
            }));
            return;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsLoading(true);
        try {
            const cpfExists = await checkIfCpfExists(novoProfissional.cpf);
            if (cpfExists) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    cpf: "Este CPF já está cadastrado."
                }));
                return;
            }
            
            let newId = novoProfissional.id ? parseInt(novoProfissional.id) + 1 : 1;
            const existingIds = await axios.get("http://localhost:3000/profissionaisDeSaude")
                .then(response => response.data.map(profissional => profissional.id));
            while (existingIds.includes(newId.toString())) {
                newId += 1;
            }
            
            const novoProfissionalComID = {
                ...novoProfissional,
                id: newId.toString(),
                ativo: ativo,
                valorConsulta: valorConsulta,
                opcaoAtendimento: opcaoAtendimento,
            };    
    
            await axios.post("http://localhost:3000/profissionaisDeSaude", novoProfissionalComID);

            setNovoProfissional({
                id:    '',
                nome: '',
                cpf: '',
                rg: '',
                nascimento: '',
                email:  '',
                telefone:  '',
                cidade: '',
                cep: '',
                rua: '',
                casa: '',
                bairro: '',
                cfm: '',
                especialidade:  '',
                ativo: '',
                uf: '',
                valorConsulta: '0',
                opcaoAtendimento: '',
            });

            setShowSuccessMessage(true);
    
            setIdCounter(prevId => prevId + 1);

            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 4000);
        } catch (error) {
            console.error('Erro ao salvar', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatRG = (rg: string): string => {
        return rg.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');
    };

    const formatTelefone = (telefone: string): string => {
        return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    };

    const atendimento: string[]= [
        "Presencial",
        "Consulta Online"
    ];

    const formatarValorConsulta = (valor: string): string => {
        const valorNumerico = parseFloat(valor.replace(/\D/g, '')) / 100;
        return valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };


    const especialidades: string[]= [
        "Clínico Geral",
        "Cardiologia",
        "Pediatria",
        "Ortopedia",
        "Ginecologia",
        "Neurologia",
        "Dermatologia",
        "Psiquiatria",
        "Oftalmologia",
        "Otorrinolaringologia",
    ];

    return (
        <main className="content">
            <div className="cadastro">
                <h2>Cadastro de Profissional</h2>
                <label>Nome: <span>*</span> </label>
                <input
                    type="text"
                    name="nome"
                    value={novoProfissional.nome}
                    onChange={handleInputChange}
                    required
                    className={errors.nome ? "error" : ""}
                />
                {errors.nome && <div className="error-message">{errors.nome}</div>}
                <label>CPF: <span>*</span> </label>
                <input
                    type="text"
                    name="cpf"
                    value={novoProfissional.cpf}
                    onChange={handleInputChange}
                    required
                    minLength={11}
                    maxLength={11}
                    className={errors.cpf ? "error" : ""}
                />
                {errors.cpf && <div className="error-message">{errors.cpf}</div>}
                <label>RG: <span>*</span> </label>
                <input 
                    type="text" 
                    name="rg" 
                    value={formatRG(novoProfissional.rg)} 
                    onChange={handleInputChange} 
                    maxLength={14} 
                    required 
                />
                <label>Nascimento: <span>*</span> </label>
                <input 
                    type="date" 
                    name="nascimento" 
                    value={novoProfissional.nascimento} 
                    onChange={handleInputChange} 
                    required 
                />
                <label>Email:</label>
                <input 
                    type="email" 
                    name="email" 
                    value={novoProfissional.email} 
                    onChange={handleInputChange} 
                />
                <label>Telefone:</label>
                <input 
                    type="tel" 
                    name="telefone" 
                    value={formatTelefone(novoProfissional.telefone)} 
                    onChange={handleInputChange} 
                    maxLength={14} 
                />
                <label>CEP: <span>*</span> </label>
                <section className="CEP">
                    <input type="text" name="cep" value={novoProfissional.cep} onChange={handleInputChange} required />
                    <input type="text" name="rua" value={novoProfissional.rua} onChange={handleInputChange} disabled />
                    <input type="text" name="cidade" value={novoProfissional.cidade}onChange={handleInputChange} disabled />
                    <input type="text" name="uf" value={novoProfissional.uf} onChange={handleInputChange} disabled />
                    <input type="text" name="bairro" value={novoProfissional.bairro} onChange={handleInputChange} disabled />
                    <input type="text" name="casa" value={novoProfissional.casa} onChange={handleInputChange}  placeholder="Número da Casa"/>
                </section>
                <label>Registro: <span>*</span> </label>
                <input type="text" name="cfm" value={novoProfissional.cfm} onChange={handleInputChange} required />
                <label>Especialidade: <span>*</span> </label>
                <select name="especialidade" value={novoProfissional.especialidade} onChange={handleInputChange} required>
                    <option value="">Selecione a Especialidade</option>
                    {especialidades.map((especialidade, index) => (
                        <option key={index} value={especialidade}>{especialidade}</option>
                    ))}
                </select>
                <label>Valor da Consulta:</label>
                <input type="text" name="valor" value={valorConsulta !== '' ? formatarValorConsulta(valorConsulta) : ''} 
                    onChange={handleInputChange} 
                />
                <select 
                    name="atendimento" 
                    value={opcaoAtendimento} 
                    onChange={(e) => setOpcaoAtendimento(e.target.value)} 
                >
                    <option value="">Selecione o modo de atendimento</option>
                    {atendimento.map((atendimento, index) => (
                        <option key={index} value={atendimento}>{atendimento}</option>
                    ))}
                </select>
                <label>Status: </label>
                <select name="ativo" value={ativo} onChange={(e) => setAtivo(e.target.value)}>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                </select>
                <button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar"}
                </button>
                {showSuccessMessage && (
                    <div className="success-message">Profissional cadastrado com sucesso!</div>
                )}
            </div>
        </main>
    );
};

export default Cadastro;

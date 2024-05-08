import { useEffect, useState } from "react";
import "./modal.scss";
import { X } from "lucide-react";
import axios from "axios";

const EditModal = ({ profissional, onSave, onCancel }) => {
    
    const checkIfCpfExists = async (cpf) => {
        try {
            const response = await axios.get(`http://localhost:3000/profissionaisDeSaude?cpf=${cpf}`);
            return response.data.length > 0;
        } catch (error) {
            console.error('Erro ao verificar CPF:', error);
            return false;
        }
    };
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [ativo, setAtivo] = useState<boolean>(profissional.ativo === "Ativo");
    const [valorConsulta, setValorConsulta] = useState<string>(profissional.valorConsulta || '');
    const [opcaoAtendimento, setOpcaoAtendimento] = useState<string>(profissional.opcaoAtendimento || '');

    const formatarValorConsulta = (valor: string): string => {
        const valorNumerico = parseFloat(valor.replace(/\D/g, '')) / 100;
        return valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };
    


    const [editedProfissional, setEditedProfissional] = useState({
        id: profissional.id,
        nome: profissional.nome,
        cpf: profissional.cpf,
        rg: profissional.rg,
        nascimento: profissional.nascimento,
        email: profissional.email,
        telefone: profissional.telefone,
        cidade: profissional.cidade,
        cep: profissional.cep,
        rua: profissional.rua,
        casa: profissional.casa,
        bairro: profissional.bairro,
        cfm: profissional.cfm,
        especialidade: profissional.especialidade,
        ativo: profissional.ativo,
        uf: profissional.uf,
        imagem: 'uploads/profissional1',
        valorConsulta: profissional.valorConsulta,
        opcaoAtendimento: profissional.opcaoAtendimento,
    });

    useEffect( ( ) => {
        setAtivo(profissional.ativo === "Ativo");
    }, [profissional.ativo]);

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


    const handleInputChange = (e) => {
        const { name, value } = e.target;


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
            setEditedProfissional(prevState => ({
                ...prevState,
                [name]: cleanedValue,
            }));
        } else {
            setEditedProfissional(prevState => ({
                ...prevState,
                [name]: (name === 'rg' || name === 'telefone' || name === 'cep') ? value.replace(/[^\d]/g, '') : value,
            }));
        }

        if (name === "cep") {
            axios.get(`https://viacep.com.br/ws/${value}/json/`)
                .then(response => {
                    const data = response.data;
                    setEditedProfissional(prevState => ({
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

        if (name === "ativo") {
            setAtivo(value === "true" ? true : false);
        }
        
    };

    const handleSubmit = async () => {
        const requiredFields = ["nome", "cpf", "rg", "nascimento", "cep", "cfm", "especialidade"];
        const contactFields = ["email", "telefone"];
        const newErrors = {};

        if(editedProfissional.cpf !== profissional.cpf) {

            const cpfExists = await checkIfCpfExists(editedProfissional.cpf);
            if (cpfExists) {
            setErrors(prevErrors => ({
                ...prevErrors,
                cpf: "Este CPF já está em uso."
            }));
            return;
        }
    }
        requiredFields.forEach(field => {
            if (!editedProfissional[field]) {
                newErrors[field] = "Campo obrigatório";
            }
        });
        
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        let hasContactInfo = false;
        contactFields.forEach(field => {
            if (editedProfissional[field]?.trim()) { 
                hasContactInfo = true;
            }
        });
    
        if (!hasContactInfo) {
            newErrors["contato"] = "Informe pelo menos um email ou telefone";
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsLoading(true);


        const valorConsultaFormatted = valorConsulta.replace(/[^\d,]/g, '');
        const editedProfissionalWithBoolean = {
            ...editedProfissional,
            ativo: ativo,
            valorConsulta: `R$ ${valorConsultaFormatted}`,
            opcaoAtendimento: opcaoAtendimento,
        };
    
        try {
            
            if (editedProfissional.cpf !== profissional.cpf) {
                const cpfExists = await checkIfCpfExists(editedProfissional.cpf);
                if (cpfExists) {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        cpf: "Este CPF já está em uso."
                    }));
                    return;
                }
            }

            await axios.put(`http://localhost:3000/profissionaisDeSaude/${editedProfissional.id}`, editedProfissionalWithBoolean);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 4000);
        } catch (error) {
            console.error('Erro ao salvar', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="bg-modal">
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={onCancel}><X /></span>
                    <h2>Edit Profissional</h2>
                    <label>Nome: <span>*</span> </label>
                    <input
                        type="text"
                        name="nome"
                        value={editedProfissional.nome}
                        onChange={handleInputChange}
                        required
                        className={errors.nome ? "error" : " "}
                    />
                    {errors.nome && <div className="error-message">{errors.nome}</div>}
                    <label>CPF: <span>*</span> </label>
                    <input
                        type="text"
                        name="cpf"
                        value={editedProfissional.cpf}
                        onChange={handleInputChange}
                        required
                        minLength={11}
                        maxLength={11}
                        className={errors.nome ? "error" : " "}
                    />
                    {errors.cpf && <div className="error-message">{errors.cpf}</div>}
                    <label>RG: <span>*</span> </label>
                    <input 
                        type="text" 
                        name="rg" 
                        value={editedProfissional.rg} 
                        onChange={handleInputChange} 
                        maxLength={14} 
                        required 
                    />
                    <label>Nascimento: <span>*</span> </label>
                    <input 
                        type="date" 
                        name="nascimento" 
                        value={editedProfissional.nascimento} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={editedProfissional.email} 
                        onChange={handleInputChange} 
                    />
                    {errors.contato && <div className="error-message">{errors.contato}</div>}
                    <label>Telefone:</label>
                    <input 
                        type="tel" 
                        name="telefone" 
                        value={editedProfissional.telefone} 
                        onChange={handleInputChange} 
                        maxLength={14} 
                    />
                    {errors.contato && <div className="error-message">{errors.contato}</div>}
                    <label>CEP: <span>*</span> </label>
                    <section className="CEP">
                        <input type="text" name="cep" value={editedProfissional.cep} onChange={handleInputChange} required />
                        <input type="text" name="rua" value={editedProfissional.rua} onChange={handleInputChange} disabled />
                        <input type="text" name="cidade" value={editedProfissional.cidade} onChange={handleInputChange} disabled />
                        <input type="text" name="uf" value={editedProfissional.uf} onChange={handleInputChange} disabled />
                        <input type="text" name="bairro" value={editedProfissional.bairro} onChange={handleInputChange} disabled />
                        <input type="text" name="casa" value={editedProfissional.casa} onChange={handleInputChange}  placeholder="Número da Casa"/>
                    </section>
                    {errors.nome && <div className="error-message">{errors.nome}</div>}
                    <label>Registro: <span>*</span> </label>
                    <input type="text" name="cfm" value={editedProfissional.cfm} onChange={handleInputChange} required />
                    <label>Especialidade: <span>*</span> </label>
                    <select name="especialidade" value={editedProfissional.especialidade} onChange={handleInputChange} required>
                        <option value="">{profissional.especialidade}</option>
                        {especialidades.map((especialidade, index) => (
                            <option key={index} value={especialidade}>{especialidade}</option>
                        ))}
                    </select>
                    <label>Valor da Consulta:</label>
                    <input 
                        type="text"
                        name="valorConsulta"
                        value={valorConsulta !== '' ? formatarValorConsulta(valorConsulta) : ''}
                        onChange={(e) => setValorConsulta(e.target.value)}
                    />
                    <select 
                        name="opcaoAtendimento" 
                        value={opcaoAtendimento} 
                        onChange={(e) => setOpcaoAtendimento(e.target.value)} 
                    >
                        <option value="">Selecione o modo de atendimento</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Consulta Online">Consulta Online</option>
                    </select>
                    <label>Status: </label>
                    <select 
                        name="ativo" 
                        value={ativo ? "true" : "false"}
                        onChange={(e) => setAtivo(e.target.value === "true")}
                    >
                        <option value="true">Ativo</option>
                        <option value="false">Inativo</option>
                    </select>
                    <button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar"}
                    </button>
                    {showSuccessMessage && (
                        <div className="success-message">Profissional editado com sucesso!</div>
                    )}
                    
                </div>
            </div>
        </main>
    );
};

export default EditModal;

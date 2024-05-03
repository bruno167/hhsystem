import { useState } from "react";
import "./modal.scss";
import { X } from "lucide-react";
import axios from "axios";
import { Profissional } from './types';

interface Errors {
    [key: string]: string | undefined;
}

const Modal = ({ profissional, onSave, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [isFormValid, setIsFormValid] = useState(false);

    const [editedProfissional, setEditedProfissional] = useState<Profissional>({
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
        especialidade: profissional.especialidade
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'cpf') {
            handleCPFInputChange(value);
        } else if (name === 'cep') {
            handleCEPInputChange(value);
        } else if (name === 'email') {
            handleEmailInputChange(value);
        } else {
            handleRegularInputChange(name, value);
        }
    };

    const handleCPFInputChange = (value: string) => {
        const cleanedValue = value.replace(/\D/g, '');

        if (cleanedValue.length !== 11) {
            setErrors(prevErrors => ({
                ...prevErrors,
                cpf: "CPF inválido.."
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                cpf: undefined
            }));
        }

        setEditedProfissional(prevState => ({
            ...prevState,
            cpf: cleanedValue,
        }));
    };

    const handleCEPInputChange = (value: string) => {
        axios.get(`https://viacep.com.br/ws/${value}/json/`)
            .then(response => {
                const data = response.data;
                setEditedProfissional(prevState => ({
                    ...prevState,
                    cidade: data.localidade,
                    rua: data.logradouro,
                    bairro: data.bairro,
                }));

                setErrors(prevErrors => ({
                    ...prevErrors,
                    cep: undefined
                }));
            })
            .catch(error => {
                console.error('Erro ao consultar o CEP:', error);

                setErrors(prevErrors => ({
                    ...prevErrors,
                    cep: "CEP Invalido."
                }));
            });

        setEditedProfissional(prevState => ({
            ...prevState,
            cep: value.replace(/[^\d]/g, ''),
        }));
    };

    const handleEmailInputChange = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(value)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                email: "Digite um email válido."
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                email: undefined
            }));
        }

        setEditedProfissional(prevState => ({
            ...prevState,
            email: value,
        }));
    };

    const handleRegularInputChange = (name: string, value: string) => {
        setEditedProfissional(prevState => ({
            ...prevState,
            [name]: (name === 'rg' || name === 'telefone' || name === 'cep') ? value.replace(/[^\d]/g, '') : value,
        }));
    };

    const handleSubmit = () => {
        const requiredFields = ["nome", "cpf", "rg", "nascimento", "email", "cep", "cfm", "especialidade"];
        const newErrors: Errors = {};
        let hasErrors = false;

        requiredFields.forEach(field => {
            if (!editedProfissional[field]) {
                newErrors[field] = "Campo obrigatório";
            }
        });

        if (editedProfissional.cpf.replace(/\D/g, '').length !== 11) {
            newErrors['cpf'] = "CPF inválido.";
            hasErrors = true;
        }

        if (!isValidEmail(editedProfissional.email)) {
            newErrors['email'] = "Digite um email válido.";
            hasErrors = true;
        }

        if (editedProfissional.cep.replace(/\D/g, '').length !== 8) {
            newErrors['cep'] = "CEP inválido.";
            hasErrors = true; // Se o CEP for inválido, define hasErrors como true
        }

        const hasError = Object.keys(newErrors).length > 0;

        setErrors(newErrors);
        setIsFormValid(!hasError);

        if (hasError) {
            setErrors(newErrors);
            setIsFormValid(false);
            return;
        }

        setIsLoading(true);
        onSave(editedProfissional);

        setTimeout(() => {
            setIsLoading(false);
            setShowSuccessMessage(true);
            onSave(editedProfissional);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 4000);
        }, 2000);
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
                        className={errors.nome ? "error" : ""}
                    />
                    {errors.nome && <div className="error-message">{errors.nome}</div>}
                    <label>CPF: <span>*</span> </label>
                    <input
                        type="text"
                        name="cpf"
                        value={editedProfissional.cpf}
                        onChange={handleInputChange}
                        required
                        className={errors.cpf ? "error" : ""}
                    />
                    {errors.cpf && <div className="error-message">{errors.cpf}</div>}
                    <label>RG: <span>*</span> </label>
                    <input
                        type="text"
                        name="rg"
                        value={editedProfissional.rg}
                        onChange={handleInputChange}
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
                    <label>Email: <span>*</span> </label>
                    <input
                        type="email"
                        name="email"
                        value={editedProfissional.email}
                        onChange={handleInputChange}
                        required
                        className={errors.email ? "error" : ""}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                    <label>Telefone: </label>
                    <input
                        type="tel"
                        name="telefone"
                        value={editedProfissional.telefone}
                        onChange={handleInputChange}
                    />
                    <label>CEP: <span>*</span> </label>
                    <input
                        type="text"
                        name="cep"
                        value={editedProfissional.cep}
                        onChange={handleInputChange}
                        required
                        className={errors.cep ? "error": ""}
                    />
                    {errors.cep && <div className="error-message">{errors.cep}</div>}
                    <div className="CEP">
                        
                    <input 
                        type="text"
                        name="rua"
                        value={editedProfissional.rua}
                        onChange={handleInputChange}

                        disabled
                    >
                    </input>
                    <input 
                        type="text"
                        name="bairro"
                        value={editedProfissional.bairro}
                        onChange={handleInputChange}

                        disabled
                    >
                    </input>
                    <input 
                        type="text"
                        name="cidade"
                        value={editedProfissional.cidade}
                        onChange={handleInputChange}

                        disabled
                    >
                    </input>
                    <input 
                        type="text"
                        name="casa"
                        onChange={handleInputChange}
                        placeholder="S/N"
                    >
                    </input>
                    </div>
                    <label>CRM/CFM: <span>*</span> </label>
                    <input
                        type="text"
                        name="cfm"
                        value={editedProfissional.cfm}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Especialidade: <span>*</span> </label>
                    <select
                        name="especialidade"
                        value={editedProfissional.especialidade}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Selecione a Especialidade</option>
                        <option value="Clínico Geral">Clínico Geral</option>
                        <option value="Cardiologia">Cardiologia</option>
                        <option value="Pediatria">Pediatria</option>
                        <option value="Ortopedia">Ortopedia</option>
                        <option value="Ginecologia">Ginecologia</option>
                        <option value="Neurologia">Neurologia</option>
                        <option value="Dermatologia">Dermatologia</option>
                        <option value="Psiquiatria">Psiquiatria</option>
                        <option value="Oftalmologia">Oftalmologia</option>
                        <option value="Otorrinolaringologia">Otorrinolaringologia</option>
                    </select>
                    <button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar"}
                    </button>
                    {showSuccessMessage && (
                        <div className="success-message">Alteração bem sucedida!</div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Modal;

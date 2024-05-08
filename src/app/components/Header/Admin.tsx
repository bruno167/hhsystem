import { UserRound, Settings, LogOut } from "lucide-react";
import "./Admin.scss";

interface AdminProps {
    onClick: () => void;
}

export default function Admin(props: AdminProps) {
    return (
        <div className="dropdown">
            <ul>
                <h3 className="admin-title">MicheleHH</h3>
                <p className="admin-role">Administrador</p>
                <li className="admin-item">
                    <a href="#">
                        <UserRound className="admin-icon" />
                        <span className="admin-text">Meu Perfil</span>
                    </a>
                </li>
                <li className="admin-item">
                    <a href="#">
                        <Settings className="admin-icon" />
                        <span className="admin-text">Configurações</span>
                    </a>
                </li>
                <li className="admin-item">
                    <a href="#">
                        <LogOut className="admin-icon" />
                        <span className="admin-text">Sair</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}

import { useState } from "react";
import "./sidebar.scss"
import { LayoutDashboard, UserRoundPlus, UserRoundCog, Settings, ShieldQuestion, LogOutIcon } from "lucide-react";

interface SideBarProps {
    onGerenciarClick: () => void; 
    onCadastroClick: () => void; 
    onDashboardClick: () => void;
}

export function SideBar(props : SideBarProps){
    return(
            <nav>
                <ul>
                    <li>
                        <p onClick={props.onDashboardClick}>
                            <LayoutDashboard className="icon"/>
                            <span className="text">Dashboard</span>
                        </p>
                    </li>
                    <li>
                        <p onClick={props.onCadastroClick}> 
                            <UserRoundPlus className="icon" />
                            <span className="text">Cadastro</span>
                        </p>
                    </li>
                    <li>
                        <p onClick={props.onGerenciarClick}>
                            <UserRoundCog className="icon"/>
                            <span className="text">Gerenciar</span>
                        </p>
                    </li>
                    <li>
                        <p>
                            <Settings className="icon"/>
                            <span className="text">Configurações</span>
                        </p>
                    </li>
                    <li>
                        <p>
                            <ShieldQuestion className="icon"/>
                            <span className="text">FAQ</span>
                        </p>
                    </li>
                    <li className="bottom-icon">
                            <p>
                                <LogOutIcon className="icon"/>
                                <span className="text">Sair</span>
                            </p>
                    </li>

                </ul>
            </nav>
    )
}

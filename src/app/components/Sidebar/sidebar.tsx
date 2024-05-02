import { GanttChart, Github, GithubIcon, Home, LayoutDashboard, LogOutIcon, Search, Settings, ShieldQuestion, User, UserCog2, UserRoundCog, UserRoundPlus, WrenchIcon } from "lucide-react";
import "./sidebar.scss"
import Dashboard from "../dashboard/dashboard";

interface SideBarProps {

}
export function SideBar(props : SideBarProps){
    return(
            <nav>
                <ul>
                    <li>
                        <p>
                            <LayoutDashboard className="icon"/>
                            <span className="text">Dashboard</span>
                        </p>
                    </li>
                    <li>
                        <p>
                            <UserRoundPlus className="icon" />
                            <span className="text">Cadastro</span>
                        </p>
                    </li>
                    <li>
                        <p>
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
                                <span className="text">Logout</span>
                            </p>
                    </li>

                </ul>
            </nav>
    )
}
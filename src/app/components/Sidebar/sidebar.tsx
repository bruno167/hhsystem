import { Home, Search, UserCog2, WrenchIcon } from "lucide-react";
import "./sidebar.scss"

interface SideBarProps {

}
export function SideBar(props : SideBarProps){
    return(
        <nav>
            <ul>
                <li>
                    <Home />
                </li>
                <li>
                    <UserCog2 />
                </li>
                <li>
                    <Search />
                </li>
                <li>
                    <WrenchIcon />
                </li>

            </ul>
        </nav>
    )
}
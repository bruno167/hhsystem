import { useState } from "react"
import "./Admin.scss";
import { LogOut, Settings, User, UserRound } from "lucide-react";

interface AdminProps { onClick: () => void;

}
export default function Admin(props : AdminProps){


    return(
        <div className="dropdown">
          <ul>
              <h3>AdminUser</h3>
              <p>Administrador</p>
            <li>
              <a href="#">
                <UserRound />
                Profile
              </a>
            </li>
            <li>
              <a href="#"> 
              <Settings />
              Settings 
              </a>
            </li>
            <li>
              <a href="#">
                <LogOut />
                Logout
              </a>
            </li>
          </ul>
        </div>
    )
}
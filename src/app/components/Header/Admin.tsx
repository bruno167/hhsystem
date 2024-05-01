import { useState } from "react"
import "./Admin.scss";
import { LogOut, Settings, User } from "lucide-react";

interface AdminProps { onClick: () => void;

}
export default function Admin(props : AdminProps){


    return(
        <div className="dropdown">
          <ul>
              <h3>AdminUser</h3>
              <p>Administrador</p>
            <li>
              <User />
              <a href="#">Profile</a>
            </li>
            <li>
              <Settings />
              <a href="#">Settings</a>
            </li>
            <li>
              <LogOut />
              <a href="#">Logout</a>
            </li>
          </ul>
        </div>
    )
}